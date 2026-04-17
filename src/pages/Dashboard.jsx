import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Grid, Skeleton, Alert, Divider, Chip,
} from '@mui/material';
import { LocalFireDepartment, CheckCircle, EmojiEvents } from '@mui/icons-material';
import Parse from '../config/parse.js';
import { useAuth } from '../context/AuthContext.jsx';
import HabitCard from '../components/HabitCard.jsx';
import { calculateStreaks, todayKey, toDateKey } from '../utils/streaks.js';
import APP_CONFIG from '../config/app.config.js';
import { HABIT_COLORS } from '../theme/index.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logMap, setLogMap] = useState({});    // habitId → today's log Parse object
  const [allLogsMap, setAllLogsMap] = useState({});  // habitId → [{date, completed}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const displayName = user?.get('displayName') || user?.get('email')?.split('@')[0] || 'there';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date();
      const dayStart = new Date(today); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(today); dayEnd.setHours(23, 59, 59, 999);

      // Active habits (end date >= today, not archived)
      const habitQuery = new Parse.Query('HabitGoal');
      habitQuery.equalTo('user', user);
      habitQuery.notEqualTo('isArchived', true);
      habitQuery.greaterThanOrEqualTo('endDate', dayStart);
      habitQuery.descending('createdAt');
      const habitResults = await habitQuery.find();

      // Today's logs for the user
      const todayLogQuery = new Parse.Query('HabitLog');
      todayLogQuery.equalTo('user', user);
      todayLogQuery.greaterThanOrEqualTo('date', dayStart);
      todayLogQuery.lessThanOrEqualTo('date', dayEnd);
      const todayLogs = await todayLogQuery.find();

      const newLogMap = {};
      todayLogs.forEach((log) => {
        newLogMap[log.get('habit').id] = log;
      });

      // All logs for streak calculation
      const allLogsQuery = new Parse.Query('HabitLog');
      allLogsQuery.equalTo('user', user);
      allLogsQuery.ascending('date');
      allLogsQuery.limit(5000);
      const allLogs = await allLogsQuery.find();

      const newAllLogsMap = {};
      allLogs.forEach((log) => {
        const hid = log.get('habit').id;
        if (!newAllLogsMap[hid]) newAllLogsMap[hid] = [];
        newAllLogsMap[hid].push({ date: log.get('date'), completed: log.get('completed') });
      });

      setHabits(habitResults);
      setLogMap(newLogMap);
      setAllLogsMap(newAllLogsMap);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLog = async (habitId, completed) => {
    try {
      const HabitGoal = Parse.Object.extend('HabitGoal');
      const habitPtr = new HabitGoal();
      habitPtr.id = habitId;

      const today = new Date();
      const dayStart = new Date(today); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(today); dayEnd.setHours(23, 59, 59, 999);

      // Upsert today's log
      const existingQuery = new Parse.Query('HabitLog');
      existingQuery.equalTo('habit', habitPtr);
      existingQuery.equalTo('user', user);
      existingQuery.greaterThanOrEqualTo('date', dayStart);
      existingQuery.lessThanOrEqualTo('date', dayEnd);
      const existing = await existingQuery.first();

      const HabitLog = Parse.Object.extend('HabitLog');
      const log = existing || new HabitLog();
      log.set('habit', habitPtr);
      log.set('user', user);
      log.set('date', new Date());
      log.set('completed', completed);
      const acl = new Parse.ACL(user);
      log.setACL(acl);
      await log.save();

      // Refresh
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const todayStr = todayKey();
  const unlogged = habits.filter((h) => !logMap[h.id]);
  const logged   = habits.filter((h) =>  logMap[h.id]);
  const activeStreaks = habits.filter((h) => {
    const { currentStreak } = calculateStreaks(allLogsMap[h.id] || []);
    return currentStreak >= APP_CONFIG.STREAK_MIN_DAYS;
  });

  // Overall stats
  const totalActive = habits.length;
  const totalLoggedToday = logged.length;
  const overallSuccessCount = Object.values(allLogsMap).flat().filter((l) => l.completed).length;
  const overallTotalCount  = Object.values(allLogsMap).flat().length;
  const overallRate = overallTotalCount > 0
    ? Math.round((overallSuccessCount / overallTotalCount) * 100) : 0;

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={220} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={160} height={24} sx={{ mb: 3 }} />
        {[1, 2].map((i) => <Skeleton key={i} variant="rounded" height={140} sx={{ mb: 2 }} />)}
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">
          {greeting()}, {displayName}!
        </Typography>
        <Typography color="text.secondary" variant="body2" mt={0.5}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Habits', value: totalActive, icon: <CheckCircle />, color: 'primary.main' },
          { label: 'Logged Today',  value: `${totalLoggedToday}/${totalActive}`, icon: <CheckCircle />, color: 'success.main' },
          { label: 'Overall Rate',  value: `${overallRate}%`, icon: <EmojiEvents />, color: 'warning.main' },
          { label: 'Active Streaks', value: activeStreaks.length, icon: <LocalFireDepartment />, color: 'error.main' },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: 2,
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <Box sx={{ color: stat.color, mb: 0.5 }}>{stat.icon}</Box>
              <Typography variant="h5" fontWeight={800} lineHeight={1}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Today's Check-ins */}
      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
        Today&apos;s Check-ins
        {unlogged.length > 0 && (
          <Chip label={`${unlogged.length} pending`} size="small" color="warning" sx={{ ml: 1 }} />
        )}
      </Typography>

      {habits.length === 0 ? (
        <Alert severity="info">
          No active habits yet. Head to <strong>My Habits</strong> and create your first one!
        </Alert>
      ) : unlogged.length === 0 ? (
        <Alert severity="success" icon={<CheckCircle />}>
          All done for today — great work! 🎉
        </Alert>
      ) : (
        <Box sx={{ mb: 3 }}>
          {unlogged.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              logs={allLogsMap[habit.id] || []}
              todayLog={logMap[habit.id] || null}
              onLog={handleLog}
              showLogButtons
            />
          ))}
        </Box>
      )}

      {/* Already logged today */}
      {logged.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
            Already Logged Today
          </Typography>
          {logged.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              logs={allLogsMap[habit.id] || []}
              todayLog={logMap[habit.id] || null}
              onLog={handleLog}
              showLogButtons
            />
          ))}
        </>
      )}

      {/* Active Streaks */}
      {activeStreaks.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
            <LocalFireDepartment sx={{ verticalAlign: 'middle', color: 'error.main', mr: 0.5 }} />
            Active Streaks
          </Typography>
          {activeStreaks.map((habit) => {
            const { currentStreak } = calculateStreaks(allLogsMap[habit.id] || []);
            const color = habit.get('type') === 'keep'
              ? HABIT_COLORS.keep
              : HABIT_COLORS.stop;
            return (
              <Box
                key={habit.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 1.5,
                  mb: 1,
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                }}
              >
                <LocalFireDepartment sx={{ color: 'error.main', mr: 1 }} />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {habit.get('name')}
                  </Typography>
                </Box>
                <Chip
                  label={`${currentStreak} day streak`}
                  size="small"
                  sx={{ bgcolor: color, color: '#fff', fontWeight: 700 }}
                />
              </Box>
            );
          })}
        </>
      )}
    </Box>
  );
}
