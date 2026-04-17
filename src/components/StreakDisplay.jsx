import React from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { LocalFireDepartment, EmojiEvents, BarChart, CheckCircle } from '@mui/icons-material';
import { getHighestMilestone } from '../utils/streaks.js';
import APP_CONFIG from '../config/app.config.js';

const MILESTONE_LABELS = {
  3:  '3-Day Starter',
  7:  '1-Week Warrior',
  14: '2-Week Champion',
  21: '3-Week Legend',
  30: '30-Day Master',
  60: '60-Day Elite',
  90: '90-Day Hero',
};

export default function StreakDisplay({ currentStreak, longestStreak, totalLogs, successRate }) {
  const milestone = getHighestMilestone(currentStreak, APP_CONFIG.STREAK_MILESTONES);

  const stats = [
    {
      icon: <LocalFireDepartment sx={{ color: '#FF5722' }} />,
      value: currentStreak,
      label: 'Current Streak',
      suffix: currentStreak === 1 ? ' day' : ' days',
    },
    {
      icon: <EmojiEvents sx={{ color: '#FFC107' }} />,
      value: longestStreak,
      label: 'Longest Streak',
      suffix: longestStreak === 1 ? ' day' : ' days',
    },
    {
      icon: <CheckCircle sx={{ color: '#43A047' }} />,
      value: `${successRate}%`,
      label: 'Success Rate',
      suffix: '',
    },
    {
      icon: <BarChart sx={{ color: '#5C6BC0' }} />,
      value: totalLogs,
      label: 'Total Logged',
      suffix: totalLogs === 1 ? ' day' : ' days',
    },
  ];

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Your Progress
      </Typography>

      <Grid container spacing={1.5} sx={{ mb: milestone ? 2 : 0 }}>
        {stats.map((s) => (
          <Grid item xs={6} key={s.label}>
            <Box
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {s.icon}
              <Box>
                <Typography variant="h6" lineHeight={1}>
                  {s.value}
                  {s.suffix && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.25 }}
                    >
                      {s.suffix}
                    </Typography>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {s.label}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Milestone badge */}
      {milestone && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: '#FFF8E1',
            borderRadius: 2,
            border: '1px solid #FFD54F',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <EmojiEvents sx={{ color: '#FFC107' }} />
          <Box>
            <Typography variant="subtitle2" color="#E65100">
              🏆 {MILESTONE_LABELS[milestone] || `${milestone}-Day Achievement`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentStreak} day streak unlocked this badge!
            </Typography>
          </Box>
        </Box>
      )}

      {/* Motivational message */}
      {currentStreak === 0 && totalLogs === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Log your first day to start building a streak!
        </Typography>
      )}
      {currentStreak === 0 && totalLogs > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Log a success today to start a new streak!
        </Typography>
      )}
      {currentStreak > 0 && currentStreak < APP_CONFIG.STREAK_MIN_DAYS && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {APP_CONFIG.STREAK_MIN_DAYS - currentStreak} more day
          {APP_CONFIG.STREAK_MIN_DAYS - currentStreak !== 1 ? 's' : ''} until your streak badge!
        </Typography>
      )}
    </Box>
  );
}
