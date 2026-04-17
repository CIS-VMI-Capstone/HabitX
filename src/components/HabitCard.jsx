import React from 'react';
import {
  Card, CardContent, CardActions, Box, Typography, Chip,
  Button, LinearProgress, IconButton, Tooltip,
} from '@mui/material';
import {
  LocalFireDepartment, CheckCircle, Cancel, Archive, OpenInNew,
  FavoriteBorder, Block,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { calculateStreaks, daysRemaining, getProgress } from '../utils/streaks.js';
import { getLogLabels } from '../utils/streaks.js';
import { HABIT_COLORS } from '../theme/index.js';
import APP_CONFIG from '../config/app.config.js';
import dayjs from 'dayjs';

export default function HabitCard({
  habit,
  logs = [],
  todayLog = null,
  onLog,
  onArchive,
  showLogButtons = false,
  clickable = false,
}) {
  const navigate = useNavigate();

  const type    = habit.get('type');       // 'keep' | 'stop'
  const name    = habit.get('name');
  const desc    = habit.get('description');
  const endDate = habit.get('endDate');

  const typeColor = type === 'keep' ? HABIT_COLORS.keep : HABIT_COLORS.stop;
  const typeBg    = type === 'keep' ? HABIT_COLORS.keepLight : HABIT_COLORS.stopLight;

  const { currentStreak, successRate } = calculateStreaks(logs);
  const hasStreak = currentStreak >= APP_CONFIG.STREAK_MIN_DAYS;
  const remaining = daysRemaining(endDate);
  const progress  = getProgress(habit.createdAt, endDate);
  const labels    = getLogLabels(type);

  // State for today's log
  const loggedToday   = !!todayLog;
  const todayCompleted = todayLog ? todayLog.get('completed') : null;

  const handleCardClick = () => {
    if (clickable) navigate(`/habits/${habit.id}`);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `4px solid ${typeColor}`,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s',
        '&:hover': clickable ? { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } : {},
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Top row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box flex={1} minWidth={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" noWrap>
                {name}
              </Typography>
              <Chip
                icon={type === 'keep' ? <FavoriteBorder /> : <Block />}
                label={type === 'keep' ? 'Keep Up' : 'Put Down'}
                size="small"
                sx={{
                  bgcolor: typeBg,
                  color: typeColor,
                  fontWeight: 700,
                  '& .MuiChip-icon': { color: typeColor },
                }}
              />
              {hasStreak && (
                <Chip
                  icon={<LocalFireDepartment />}
                  label={`${currentStreak}d streak`}
                  size="small"
                  sx={{ bgcolor: '#FFF3E0', color: '#E65100', '& .MuiChip-icon': { color: '#FF5722' } }}
                />
              )}
            </Box>
            {desc && (
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ mt: 0.25 }}
              >
                {desc}
              </Typography>
            )}
          </Box>

          {/* Actions (archive, detail) */}
          {(onArchive || clickable) && (
            <Box sx={{ display: 'flex', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              {clickable && (
                <Tooltip title="View details">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/habits/${habit.id}`)}
                  >
                    <OpenInNew fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onArchive && (
                <Tooltip title="Archive habit">
                  <IconButton
                    size="small"
                    onClick={() => onArchive(habit.id)}
                  >
                    <Archive fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        {/* Progress bar */}
        <Box sx={{ mt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {remaining > 0 ? `${remaining} days left` : 'Goal ended'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {successRate}% success rate
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              '& .MuiLinearProgress-bar': { bgcolor: typeColor },
              bgcolor: typeBg,
            }}
          />
        </Box>

        {/* Today's status if already logged */}
        {loggedToday && (
          <Box
            sx={{
              mt: 1.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: todayCompleted ? HABIT_COLORS.keepLight : HABIT_COLORS.stopLight,
              px: 1.25,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            {todayCompleted
              ? <CheckCircle sx={{ fontSize: 16, color: HABIT_COLORS.keep }} />
              : <Cancel    sx={{ fontSize: 16, color: HABIT_COLORS.stop }} />
            }
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: todayCompleted ? HABIT_COLORS.keep : HABIT_COLORS.stop }}
            >
              {todayCompleted
                ? (type === 'keep' ? 'Done Today!' : 'Stayed Strong!')
                : (type === 'keep' ? 'Missed Today' : 'Slipped Today')}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Log buttons */}
      {showLogButtons && (
        <CardActions
          sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant={loggedToday && todayCompleted ? 'contained' : 'outlined'}
            size="small"
            startIcon={<CheckCircle />}
            onClick={() => onLog?.(habit.id, true)}
            sx={{
              flex: 1,
              color: loggedToday && todayCompleted ? '#fff' : HABIT_COLORS.keep,
              borderColor: HABIT_COLORS.keep,
              bgcolor: loggedToday && todayCompleted ? HABIT_COLORS.keep : 'transparent',
              '&:hover': { bgcolor: HABIT_COLORS.keepLight, borderColor: HABIT_COLORS.keep },
            }}
          >
            {labels.success}
          </Button>
          <Button
            variant={loggedToday && !todayCompleted ? 'contained' : 'outlined'}
            size="small"
            startIcon={<Cancel />}
            onClick={() => onLog?.(habit.id, false)}
            sx={{
              flex: 1,
              color: loggedToday && !todayCompleted ? '#fff' : HABIT_COLORS.stop,
              borderColor: HABIT_COLORS.stop,
              bgcolor: loggedToday && !todayCompleted ? HABIT_COLORS.stop : 'transparent',
              '&:hover': { bgcolor: HABIT_COLORS.stopLight, borderColor: HABIT_COLORS.stop },
            }}
          >
            {labels.failure}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
