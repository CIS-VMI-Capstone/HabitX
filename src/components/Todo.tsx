import React, { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Calendar, { Task } from "./Calendar";

// Built in browser storage to temporarily store our list
const STORAGE_KEY = "tasks";

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateToKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCompletedDateKeys(tasks: Task[]) {
  const completedDays = new Set<string>();

  tasks.forEach((task) => {
    if (task.completedAt) {
      const completedDate = new Date(task.completedAt);
      completedDays.add(dateToKey(normalizeDate(completedDate)));
    }
  });

  return Array.from(completedDays).sort();
}

//Streak Function (ChatGPT Helped)
function calculateCurrentStreak(tasks: Task[]) {
  const completedDays = new Set(getCompletedDateKeys(tasks));

  const today = normalizeDate(new Date());
  const todayKey = dateToKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dateToKey(yesterday);

  // Streak == Dead
  if (!completedDays.has(todayKey) && !completedDays.has(yesterdayKey)) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date(today);

  if (!completedDays.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (completedDays.has(dateToKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function calculateBestStreak(tasks: Task[]) {
  const completedDayKeys = getCompletedDateKeys(tasks);

  if (completedDayKeys.length === 0) return 0;

  const completedDates = completedDayKeys.map((key) => {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  let best = 1;
  let current = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prev = normalizeDate(completedDates[i - 1]);
    const curr = normalizeDate(completedDates[i]);

    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}

export default function Todo() {
  // Load tasks from local browser storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      return parsed.map((task: any) => ({
        text: task.text ?? "",
        done: task.done ?? false,
        createdAt: task.createdAt ?? new Date().toISOString(),
        completedAt: task.completedAt
      }));
    } catch {
      return [];
    }
  });

  const [value, setValue] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const streakInfo = useMemo(() => {
    const todayKey = dateToKey(normalizeDate(new Date()));
    const completedDays = new Set(getCompletedDateKeys(tasks));

    return {
      currentStreak: calculateCurrentStreak(tasks),
      bestStreak: calculateBestStreak(tasks),
      completedToday: completedDays.has(todayKey)
    };
  }, [tasks]);

  function addTask() {
    const text = value.trim();
    if (!text) return;

    setTasks((t) => [
      ...t,
      {
        text,
        done: false,
        createdAt: new Date().toISOString()
      }
    ]);

    setValue("");
  }

  function toggleTask(i: number) {
    setTasks((t) =>
      t.map((task, idx) =>
        idx === i
          ? {
              ...task,
              done: !task.done,
              completedAt: !task.done ? new Date().toISOString() : undefined
            }
          : task
      )
    );
  }

  function deleteTask(i: number) {
    setTasks((t) => t.filter((_, idx) => idx !== i));
  }

  function editTask(i: number) {
    const newText = window.prompt("Edit task:", tasks[i].text);

    if (newText !== null && newText.trim() !== "") {
      setTasks((t) =>
        t.map((task, idx) =>
          idx === i ? { ...task, text: newText.trim() } : task
        )
      );
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
        alignItems: "flex-start"
      }}
    >
      <Paper sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          To-do List
        </Typography>

        <Paper
          elevation={2}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: "warning.50"
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            💰 Task Streak: {streakInfo.currentStreak} day
            {streakInfo.currentStreak !== 1 ? "s" : ""}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Best streak: {streakInfo.bestStreak} day
            {streakInfo.bestStreak !== 1 ? "s" : ""}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: streakInfo.completedToday ? "success.main" : "warning.main",
              fontWeight: 600
            }}
          >
            {streakInfo.completedToday
              ? "You kept your streak alive today."
              : "Complete a task today to keep your streak alive."}
          </Typography>
        </Paper>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            placeholder="Add a task..."
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Button variant="contained" onClick={addTask}>
            Add
          </Button>
        </Box>

        {tasks.length === 0 ? (
          <Typography color="text.secondary">
            No tasks yet. Add one above.
          </Typography>
        ) : (
          <List>
            {tasks.map((task, i) => (
              <ListItem key={i} divider>
                <Checkbox
                  checked={task.done}
                  onChange={() => toggleTask(i)}
                />

                <ListItemText
                  primary={task.text}
                  secondary={
                    task.completedAt
                      ? `Completed: ${new Date(task.completedAt).toLocaleString()}`
                      : `Created: ${new Date(task.createdAt).toLocaleDateString()}`
                  }
                  sx={{
                    textDecoration: task.done ? "line-through" : "none",
                    color: task.done ? "text.disabled" : "inherit"
                  }}
                />

                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => editTask(i)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton edge="end" onClick={() => deleteTask(i)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Box sx={{ flex: 1 }}>
        <Calendar tasks={tasks} />
      </Box>
    </Box>
  );
}