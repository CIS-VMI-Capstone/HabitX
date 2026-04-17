import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Switch, FormControlLabel, TextField, Button,
  Alert, ToggleButton, ToggleButtonGroup, Divider, CircularProgress,
} from '@mui/material';
import { NotificationsActive, NotificationsOff } from '@mui/icons-material';
import Parse from '../config/parse.js';
import { useAuth } from '../context/AuthContext.jsx';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ReminderSettings({ habitId, habitName }) {
  const { user } = useAuth();

  const [reminderId, setReminderId] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('08:00');
  const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6]); // all days by default
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [notifPermission, setNotifPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );

  // Load existing reminder
  useEffect(() => {
    const load = async () => {
      try {
        const HabitGoal = Parse.Object.extend('HabitGoal');
        const ptr = new HabitGoal(); ptr.id = habitId;

        const q = new Parse.Query('Reminder');
        q.equalTo('habit', ptr);
        q.equalTo('user', user);
        const existing = await q.first();

        if (existing) {
          setReminderId(existing.id);
          setEnabled(existing.get('enabled') ?? false);
          setTime(existing.get('time') || '08:00');
          setDays(existing.get('days') ?? [0, 1, 2, 3, 4, 5, 6]);
          setMessage(existing.get('message') || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [habitId, user]);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const HabitGoal = Parse.Object.extend('HabitGoal');
      const ptr = new HabitGoal(); ptr.id = habitId;

      const Reminder = Parse.Object.extend('Reminder');
      let reminder;

      if (reminderId) {
        const q = new Parse.Query('Reminder');
        reminder = await q.get(reminderId);
      } else {
        reminder = new Reminder();
        reminder.set('habit', ptr);
        reminder.set('user', user);
        reminder.setACL(new Parse.ACL(user));
      }

      reminder.set('enabled', enabled);
      reminder.set('time', time);
      reminder.set('days', days);
      reminder.set('habitName', habitName);
      reminder.set('message', message.trim() || `Time to check in on "${habitName}"!`);

      await reminder.save();
      setReminderId(reminder.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save reminder.');
    } finally {
      setSaving(false);
    }
  };

  const handleDayToggle = (_, newDays) => {
    if (newDays.length > 0) setDays(newDays);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        {enabled
          ? <NotificationsActive color="primary" sx={{ mr: 1 }} />
          : <NotificationsOff sx={{ mr: 1, color: 'text.disabled' }} />
        }
        <Typography variant="subtitle2" flex={1}>
          Reminder Notifications
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              size="small"
            />
          }
          label={enabled ? 'On' : 'Off'}
          labelPlacement="start"
          sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 13, color: 'text.secondary' } }}
        />
      </Box>

      {/* Notification permission warning */}
      {enabled && notifPermission !== 'granted' && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            notifPermission === 'default' && (
              <Button size="small" onClick={requestPermission}>
                Allow
              </Button>
            )
          }
        >
          {notifPermission === 'default'
            ? 'Browser notifications need permission to work.'
            : 'Notifications are blocked. Enable them in your browser settings.'}
        </Alert>
      )}

      {enabled && (
        <Box>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Reminder Time
          </Typography>
          <TextField
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2, width: 160 }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Days of the Week
          </Typography>
          <ToggleButtonGroup
            value={days}
            onChange={handleDayToggle}
            sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}
          >
            {DAYS.map((day, idx) => (
              <ToggleButton
                key={idx}
                value={idx}
                size="small"
                sx={{
                  width: 44,
                  height: 36,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Custom Message (optional)
          </Typography>
          <TextField
            fullWidth
            placeholder={`Time to check in on "${habitName}"!`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            inputProps={{ maxLength: 120 }}
            sx={{ mb: 2 }}
          />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Reminder saved!</Alert>}

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={saving}
        size="small"
      >
        {saving ? 'Saving…' : 'Save Reminder'}
      </Button>
    </Box>
  );
}
