import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, Button, Alert,
  CircularProgress, Divider, LinearProgress, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  ArrowBack, Edit, DeleteOutline, CheckCircle, Cancel,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Parse from '../config/parse.js';
import { useAuth } from '../context/AuthContext.jsx';
import StreakDisplay from '../components/StreakDisplay.jsx';
import ReminderSettings from '../components/ReminderSettings.jsx';
import { calculateStreaks, toDateKey, daysRemaining, getProgress } from '../utils/streaks.js';
import { HABIT_COLORS } from '../theme/index.js';
import dayjs from 'dayjs';

/** 30-day log calendar dot grid */
function LogCalendar({ logs }) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = dayjs().subtract(i, 'day');
    const key = d.format('YYYY-MM-DD');
    const log = logs.find((l) => toDateKey(l.date) === key);
    days.push({ key, label: d.format('D'), log });
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Last 30 Days
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {days.map(({ key, label, log }) => {
          let bg = '#E0E0E0';
          let title = `${key} — no log`;
          if (log) {
            bg = log.completed ? HABIT_COLORS.keep : HABIT_COLORS.stop;
            title = `${key} — ${log.completed ? 'success' : 'missed'}`;
          }
          return (
            <Tooltip key={key} title={title} arrow>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'default',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: log ? '#fff' : '#999', fontSize: 10, fontWeight: 700 }}
                >
                  {label}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
        {[
          { color: HABIT_COLORS.keep, label: 'Success' },
          { color: HABIT_COLORS.stop, label: 'Missed / Slipped' },
          { color: '#E0E0E0', label: 'Not logged' },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function HabitDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const hQuery = new Parse.Query('HabitGoal');
      const h = await hQuery.get(id);
      setHabit(h);

      const lQuery = new Parse.Query('HabitLog');
      const HabitGoal = Parse.Object.extend('HabitGoal');
      const ptr = new HabitGoal(); ptr.id = id;
      lQuery.equalTo('habit', ptr);
      lQuery.equalTo('user', user);
      lQuery.ascending('date');
      lQuery.limit(5000);
      const ls = await lQuery.find();
      setLogs(ls.map((l) => ({ id: l.id, date: l.get('date'), completed: l.get('completed') })));
    } catch (err) {
      console.error(err);
      setError('Failed to load habit details.');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete all logs for this habit
      const HabitGoal = Parse.Object.extend('HabitGoal');
      const ptr = new HabitGoal(); ptr.id = id;
      const lQuery = new Parse.Query('HabitLog');
      lQuery.equalTo('habit', ptr);
      const ls = await lQuery.find();
      await Parse.Object.destroyAll(ls);
      // Delete reminders
      const rQuery = new Parse.Query('Reminder');
      rQuery.equalTo('habit', ptr);
      const rs = await rQuery.find();
      await Parse.Object.destroyAll(rs);
      // Delete the habit
      await habit.destroy();
      navigate('/habits', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Failed to delete habit.');
      setDeleting(false);
      setDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!habit || error) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
        <Alert severity="error">{error || 'Habit not found.'}</Alert>
      </Box>
    );
  }

  const type = habit.get('type');
  const typeColor = type === 'keep' ? HABIT_COLORS.keep : HABIT_COLORS.stop;
  const typeBg    = type === 'keep' ? HABIT_COLORS.keepLight : HABIT_COLORS.stopLight;
  const { currentStreak, longestStreak, totalLogs, successRate } = calculateStreaks(logs);
  const progress = getProgress(habit.createdAt, habit.get('endDate'));
  const remaining = daysRemaining(habit.get('endDate'));

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      {/* Back + actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Box flex={1} />
        <IconButton onClick={() => navigate(`/habits/${id}/edit`)} size="small" sx={{ mr: 0.5 }}>
          <Edit fontSize="small" />
        </IconButton>
        <IconButton onClick={() => setDeleteDialog(true)} size="small" color="error">
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Box>

      {/* Header card */}
      <Card sx={{ mb: 2, borderTop: `4px solid ${typeColor}` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
            <Box flex={1}>
              <Typography variant="h5">{habit.get('name')}</Typography>
              {habit.get('description') && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {habit.get('description')}
                </Typography>
              )}
            </Box>
            <Chip
              label={type === 'keep' ? 'Keep Up' : 'Put Down'}
              size="small"
              sx={{ bgcolor: typeBg, color: typeColor, fontWeight: 700 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5, mb: 2 }}>
            <Chip
              size="small"
              label={`${remaining} days left`}
              variant="outlined"
            />
            <Chip
              size="small"
              label={`Ends ${dayjs(habit.get('endDate')).format('MMM D, YYYY')}`}
              variant="outlined"
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              '& .MuiLinearProgress-bar': { bgcolor: typeColor },
              bgcolor: typeBg,
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {progress}% through goal period
          </Typography>
        </CardContent>
      </Card>

      {/* Streak info */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <StreakDisplay
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalLogs={totalLogs}
            successRate={successRate}
          />
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <LogCalendar logs={logs} />
        </CardContent>
      </Card>

      {/* Recent log history */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Recent Log History
          </Typography>
          {logs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No logs yet.
            </Typography>
          ) : (
            [...logs].reverse().slice(0, 10).map((log) => (
              <Box
                key={log.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 0.75,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                {log.completed
                  ? <CheckCircle sx={{ color: HABIT_COLORS.keep, mr: 1.5, fontSize: 18 }} />
                  : <Cancel    sx={{ color: HABIT_COLORS.stop, mr: 1.5, fontSize: 18 }} />
                }
                <Typography variant="body2" flex={1}>
                  {dayjs(log.date).format('ddd, MMM D, YYYY')}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ color: log.completed ? HABIT_COLORS.keep : HABIT_COLORS.stop }}
                >
                  {log.completed
                    ? (type === 'keep' ? 'Done' : 'Stayed Strong')
                    : (type === 'keep' ? 'Missed' : 'Slipped')}
                </Typography>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* Reminder settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <ReminderSettings habitId={id} habitName={habit.get('name')} />
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Habit?</DialogTitle>
        <DialogContent>
          <Typography>
            This will permanently delete <strong>{habit.get('name')}</strong> and all its log
            history. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
