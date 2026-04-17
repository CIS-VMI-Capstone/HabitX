import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  ToggleButton, ToggleButtonGroup, Alert, Divider, CircularProgress,
} from '@mui/material';
import { ArrowBack, FavoriteBorder, Block } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Parse from '../config/parse.js';
import { useAuth } from '../context/AuthContext.jsx';
import APP_CONFIG from '../config/app.config.js';
import { HABIT_COLORS } from '../theme/index.js';
import dayjs from 'dayjs';

export default function NewHabit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('keep'); // 'keep' | 'stop'
  const [endDate, setEndDate] = useState(
    dayjs().add(APP_CONFIG.DEFAULT_GOAL_DAYS, 'day').format('YYYY-MM-DD')
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(!!id);

  // Load existing habit data when editing
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const q = new Parse.Query('HabitGoal');
        const habit = await q.get(id);
        setName(habit.get('name') || '');
        setDescription(habit.get('description') || '');
        setType(habit.get('type') || 'keep');
        const ed = habit.get('endDate');
        if (ed) setEndDate(dayjs(ed).format('YYYY-MM-DD'));
      } catch (err) {
        setError('Could not load habit for editing.');
        console.error(err);
      } finally {
        setLoadingEdit(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Habit name is required.');
      return;
    }
    if (!endDate) {
      setError('Please set an end date.');
      return;
    }
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (end < new Date()) {
      setError('End date must be in the future.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const HabitGoal = Parse.Object.extend('HabitGoal');
      const habit = id
        ? await new Parse.Query('HabitGoal').get(id)
        : new HabitGoal();

      habit.set('name', name.trim());
      habit.set('description', description.trim());
      habit.set('type', type);
      habit.set('endDate', end);
      habit.set('user', user);
      if (!id) {
        habit.set('isArchived', false);
        habit.setACL(new Parse.ACL(user));
      }
      await habit.save();
      navigate('/habits', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save habit.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEdit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const typeColor = type === 'keep' ? HABIT_COLORS.keep : HABIT_COLORS.stop;

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {id ? 'Edit Habit' : 'New Habit'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Habit type */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              What kind of habit?
            </Typography>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(_, v) => v && setType(v)}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton
                value="keep"
                sx={{
                  '&.Mui-selected': {
                    bgcolor: HABIT_COLORS.keepLight,
                    color: HABIT_COLORS.keep,
                    borderColor: HABIT_COLORS.keep,
                    fontWeight: 700,
                    '&:hover': { bgcolor: HABIT_COLORS.keepLight },
                  },
                }}
              >
                <FavoriteBorder sx={{ mr: 1 }} />
                Keep Up — build a good habit
              </ToggleButton>
              <ToggleButton
                value="stop"
                sx={{
                  '&.Mui-selected': {
                    bgcolor: HABIT_COLORS.stopLight,
                    color: HABIT_COLORS.stop,
                    borderColor: HABIT_COLORS.stop,
                    fontWeight: 700,
                    '&:hover': { bgcolor: HABIT_COLORS.stopLight },
                  },
                }}
              >
                <Block sx={{ mr: 1 }} />
                Put Down — break a bad habit
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Habit Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'keep' ? 'e.g. Exercise 30 min daily' : 'e.g. No smoking'}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 80 }}
            />

            <TextField
              label="Description (optional)"
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this matter to you?"
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 280 }}
            />

            <TextField
              label="Goal End Date"
              type="date"
              fullWidth
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ mb: 1 }}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: dayjs().add(1, 'day').format('YYYY-MM-DD'),
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
              Default is {APP_CONFIG.DEFAULT_GOAL_DAYS} days from today.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{ bgcolor: typeColor, '&:hover': { bgcolor: typeColor, filter: 'brightness(0.9)' } }}
              >
                {submitting ? 'Saving…' : id ? 'Save Changes' : 'Create Habit'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
