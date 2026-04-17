/**
 * Application configuration.
 * Adjust these values to tune app behaviour without touching component code.
 */
const APP_CONFIG = {
  // Minimum consecutive logged-success days before a streak badge appears
  STREAK_MIN_DAYS: 3,

  // Milestone thresholds shown as special badges / celebrations
  STREAK_MILESTONES: [3, 7, 14, 21, 30, 60, 90],

  // Default duration (in days) pre-filled when creating a new habit
  DEFAULT_GOAL_DAYS: 30,

  // How often the app checks whether a reminder notification is due (ms)
  REMINDER_CHECK_INTERVAL: 60 * 1000, // every minute

  APP_NAME: 'HabitX',
};

export default APP_CONFIG;
