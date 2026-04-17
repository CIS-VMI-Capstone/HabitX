/**
 * Streak and date utility functions.
 * All streak logic lives here so it can be tested independently of components.
 */

/**
 * Calculate streak stats from an array of log entries.
 *
 * A "streak" is a run of consecutive *logged* days where completed === true.
 * Days with no log entry are ignored (they don't break the streak), which is
 * more forgiving UX — only explicit failures break a run.
 *
 * @param {Array<{date: Date|string, completed: boolean}>} logs
 * @returns {{ currentStreak: number, longestStreak: number, totalLogs: number, successRate: number }}
 */
export function calculateStreaks(logs) {
  if (!logs || logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalLogs: 0, successRate: 0 };
  }

  // Sort ascending by date
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Longest streak — scan forward, reset on failure
  let longestStreak = 0;
  let temp = 0;
  for (const log of sorted) {
    if (log.completed) {
      temp++;
      if (temp > longestStreak) longestStreak = temp;
    } else {
      temp = 0;
    }
  }

  // Current streak — scan backwards from most recent log
  let currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  const totalLogs = logs.length;
  const successCount = logs.filter((l) => l.completed).length;
  const successRate = totalLogs > 0 ? Math.round((successCount / totalLogs) * 100) : 0;

  return { currentStreak, longestStreak, totalLogs, successRate };
}

/**
 * Return the highest milestone the user has reached, or null if none.
 * @param {number} streak
 * @param {number[]} milestones  e.g. [3, 7, 14, 21, 30]
 */
export function getHighestMilestone(streak, milestones) {
  const desc = [...milestones].sort((a, b) => b - a);
  return desc.find((m) => streak >= m) ?? null;
}

/** Format a Date to a YYYY-MM-DD string (local timezone). */
export function toDateKey(date) {
  const d = new Date(date);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

/** Today's YYYY-MM-DD key. */
export function todayKey() {
  return toDateKey(new Date());
}

/** Days remaining until endDate (returns 0 if already past). */
export function daysRemaining(endDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end - now) / 86_400_000));
}

/**
 * Progress percentage through the goal window (0–100).
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 */
export function getProgress(startDate, endDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const total = (end - start) / 86_400_000;
  if (total <= 0) return 100;
  const elapsed = (now - start) / 86_400_000;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

/** Human-friendly button labels based on habit type. */
export function getLogLabels(type) {
  if (type === 'keep') {
    return { success: 'Done Today!', failure: 'Missed It' };
  }
  return { success: 'Stayed Strong!', failure: 'Slipped' };
}
