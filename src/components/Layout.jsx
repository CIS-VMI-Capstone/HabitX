import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Menu,
  MenuItem, Divider, useMediaQuery, BottomNavigation, BottomNavigationAction,
  Fab, Paper,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, ChecklistRtl, Add, Logout, FitnessCenter,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext.jsx';
import Parse from '../config/parse.js';
import APP_CONFIG from '../config/app.config.js';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/' },
  { label: 'My Habits', icon: <ChecklistRtl />, path: '/habits' },
];

export default function Layout() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [anchorEl, setAnchorEl]       = useState(null);
  const [reminders, setReminders]     = useState([]);
  const lastNotifiedRef               = useRef({});

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Load enabled reminders
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const q = new Parse.Query('Reminder');
        q.equalTo('user', user);
        q.equalTo('enabled', true);
        const rs = await q.find();
        setReminders(
          rs.map((r) => ({
            id: r.id,
            habitName: r.get('habitName') || 'your habit',
            time: r.get('time'),
            days: r.get('days') || [0, 1, 2, 3, 4, 5, 6],
            message: r.get('message') || '',
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [user]);

  // Reminder check — fires every minute
  const checkReminders = useCallback(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const currentDay  = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    reminders.forEach((r) => {
      if (!r.days.includes(currentDay)) return;
      if (r.time !== currentTime) return;
      const key = `${r.id}-${currentTime}-${now.toDateString()}`;
      if (lastNotifiedRef.current[key]) return;
      new Notification('HabitX Reminder', {
        body: r.message || `Time to check in on "${r.habitName}"!`,
        icon: '/favicon.svg',
        tag: r.id,
      });
      lastNotifiedRef.current[key] = true;
    });
  }, [reminders]);

  useEffect(() => {
    const id = setInterval(checkReminders, APP_CONFIG.REMINDER_CHECK_INTERVAL);
    return () => clearInterval(id);
  }, [checkReminders]);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.get('displayName') || user?.get('email')?.split('@')[0] || 'User';
  const initials    = displayName.charAt(0).toUpperCase();

  const activeNavIndex = NAV_ITEMS.findIndex((item) =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  );

  const drawerContent = (
    <Box>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FitnessCenter color="primary" />
        <Typography variant="h6" color="primary">
          HabitX
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active =
            item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => isMobile && setDrawerOpen(false)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/habits/new"
            onClick={() => isMobile && setDrawerOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Add Habit" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen((v) => !v)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            HabitX
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.dark', fontSize: 14 }}>
              {initials}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* User menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            {user?.get('email')}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>

      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          pb: isMobile ? 12 : 4,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      {/* Mobile bottom navigation */}
      {isMobile && (
        <Paper
          elevation={3}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: (t) => t.zIndex.appBar }}
        >
          <BottomNavigation
            value={activeNavIndex >= 0 ? activeNavIndex : false}
            onChange={(_, v) => navigate(NAV_ITEMS[v]?.path || '/')}
          >
            <BottomNavigationAction label="Dashboard" icon={<Dashboard />} />
            <BottomNavigationAction label="Habits"    icon={<ChecklistRtl />} />
          </BottomNavigation>
        </Paper>
      )}

      {/* FAB on mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 72, right: 20 }}
          onClick={() => navigate('/habits/new')}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}
