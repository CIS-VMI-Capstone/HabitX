import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Tabs, Tab, Alert, Skeleton, Fab, Tooltip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Parse from '../config/parse.js';
import { useAuth } from '../context/AuthContext.jsx';
import HabitCard from '../components/HabitCard.jsx';

const FILTERS = ['Active', 'Completed', 'All'];

export default function Habits() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [allLogsMap, setAllLogsMap] = useState({});
  const [logMap, setLogMap] = useState({});
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date();
      const dayStart = new Date(today); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(today); dayEnd.setHours(23, 59, 59, 999);

      // All habits (including archived/completed)
      const query = new Parse.Query('HabitGoal');
      query.equalTo('user', user);
      query.descending('createdAt');
      const results = await query.find();

      // Today's logs
      const todayQuery = new Parse.Query('HabitLog');
      todayQuery.equalTo('user', user);
      todayQuery.greaterThanOrEqualTo('date', dayStart);
      todayQuery.lessThanOrEqualTo('date', dayEnd);
      const todayLogs = await todayQuery.find();
      const newLogMap = {};
      todayLogs.forEach((l) => { newLogMap[l.get('habit').id] = l; });

      // All logs
      const allQuery = new Parse.Query('HabitLog');
      allQuery.equalTo('user', user);
      allQuery.ascending('date');
      allQuery.limit(5000);
      const allLogs = await allQuery.find();
      const newAllLogsMap = {};
      allLogs.forEach((l) => {
        const hid = l.get('habit').id;
        if (!newAllLogsMap[hid]) newAllLogsMap[hid] = [];
        newAllLogsMap[hid].push({ date: l.get('date'), completed: l.get('completed') });
      });

      setHabits(results);
      setLogMap(newLogMap);
      setAllLogsMap(newAllLogsMap);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load habits.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLog = async (habitId, completed) => {
    try {
      const HabitGoal = Parse.Object.extend('HabitGoal');
      const ptr = new HabitGoal(); ptr.id = habitId;

      const today = new Date();
      const dayStart = new Date(today); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(today); dayEnd.setHours(23, 59, 59, 999);

      const eq = new Parse.Query('HabitLog');
      eq.equalTo('habit', ptr);
      eq.equalTo('user', user);
      eq.greaterThanOrEqualTo('date', dayStart);
      eq.lessThanOrEqualTo('date', dayEnd);
      const existing = await eq.first();

      const HabitLog = Parse.Object.extend('HabitLog');
      const log = existing || new HabitLog();
      log.set('habit', ptr);
      log.set('user', user);
      log.set('date', new Date());
      log.set('completed', completed);
      log.setACL(new Parse.ACL(user));
      await log.save();
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (habitId) => {
    try {
      const q = new Parse.Query('HabitGoal');
      const habit = await q.get(habitId);
      habit.set('isArchived', true);
      await habit.save();
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const now = new Date(); now.setHours(0, 0, 0, 0);

  const filtered = habits.filter((h) => {
    const isArchived = h.get('isArchived') === true;
    const expired = new Date(h.get('endDate')) < now;
    if (tab === 0) return !isArchived && !expired;   // Active
    if (tab === 1) return isArchived || expired;      // Completed/Expired
    return true;                                      // All
  });

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={160} height={36} sx={{ mb: 2 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={140} sx={{ mb: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" flex={1}>
          My Habits
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 600 } }}
      >
        {FILTERS.map((f) => <Tab key={f} label={f} />)}
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {filtered.length === 0 ? (
        <Alert severity="info">
          {tab === 0
            ? 'No active habits. Tap + to add your first one!'
            : 'Nothing here yet.'}
        </Alert>
      ) : (
        filtered.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            logs={allLogsMap[habit.id] || []}
            todayLog={logMap[habit.id] || null}
            onLog={handleLog}
            onArchive={handleArchive}
            showLogButtons={tab !== 1}
            clickable
          />
        ))
      )}

      <Tooltip title="Add Habit">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: { xs: 80, md: 32 }, right: 24 }}
          onClick={() => navigate('/habits/new')}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Box>
  );
}
