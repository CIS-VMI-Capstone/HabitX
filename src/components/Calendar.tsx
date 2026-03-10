import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Paper
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight
} from "@mui/icons-material";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type Task = {
  text: string;
  done: boolean;
  createdAt: string;
  completedAt?: string;
};

type CalendarProps = {
  tasks: Task[];
};

const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const selectedDayTasks = selectedDate
    ? tasks.filter((task) => {
        const created = new Date(task.createdAt);
        const completed = task.completedAt ? new Date(task.completedAt) : null;

        return (
          isSameDay(created, selectedDate) ||
          (completed ? isSameDay(completed, selectedDate) : false)
        );
      })
    : [];

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(
        <Grid item xs key={`empty-${i}`}>
          <Box sx={{ height: 50 }} />
        </Grid>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const isToday = isSameDay(date, today);
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

      const hasHistory = tasks.some((task) => {
        const created = new Date(task.createdAt);
        const completed = task.completedAt ? new Date(task.completedAt) : null;

        return (
          isSameDay(created, date) ||
          (completed ? isSameDay(completed, date) : false)
        );
      });

      days.push(
        <Grid item xs key={day}>
          <Paper
            elevation={isSelected ? 6 : hasHistory ? 3 : 1}
            onClick={() => setSelectedDate(date)}
            sx={{
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 2,
              border: hasHistory ? "2px solid" : "1px solid",
              borderColor: hasHistory ? "secondary.main" : "divider",
              bgcolor: isSelected
                ? "primary.main"
                : isToday
                ? "primary.light"
                : "background.paper",
              color: isSelected ? "white" : "text.primary",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isSelected ? "primary.dark" : "action.hover"
              }
            }}
          >
            <Typography variant="body2">{day}</Typography>
          </Paper>
        </Grid>
      );
    }

    return days;
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "background.default"
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>

        <Typography variant="h6" fontWeight={600}>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric"
          })}
        </Typography>

        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Grid container spacing={1} mb={1}>
        {daysOfWeek.map((day) => (
          <Grid item xs key={day}>
            <Typography
              variant="caption"
              align="center"
              display="block"
              fontWeight={600}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1}>
        {renderDays()}
      </Grid>

      {selectedDate && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            History for {selectedDate.toLocaleDateString()}
          </Typography>

          {selectedDayTasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No task history for this day.
            </Typography>
          ) : (
            selectedDayTasks.map((task, index) => (
              <Paper key={index} sx={{ p: 1.5, mb: 1, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  {task.text}
                </Typography>

                <Typography variant="caption" color="text.secondary" display="block">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </Typography>

                {task.completedAt && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Completed: {new Date(task.completedAt).toLocaleString()}
                  </Typography>
                )}

                <Typography
                  variant="caption"
                  color={task.done ? "success.main" : "warning.main"}
                  display="block"
                  sx={{ mt: 0.5 }}
                >
                  Status: {task.done ? "Completed" : "Not completed"}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default Calendar;