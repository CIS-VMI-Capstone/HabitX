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

const Calendar: React.FC = () => {
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

  const renderDays = () => {
    const days = [];

    // Empty cells before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(<Grid item xs={12 / 7} key={`empty-${i}`} />);
    }

    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const isToday = isSameDay(date, today);
      const isSelected = selectedDate && isSameDay(date, selectedDate);

      days.push(
        <Grid item xs={12 / 7} key={day}>
          <Paper
            elevation={isSelected ? 6 : 1}
            onClick={() => setSelectedDate(date)}
            sx={{
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 2,
              bgcolor: isSelected
                ? "primary.main"
                : isToday
                ? "primary.light"
                : "background.paper",
              color: isSelected
                ? "white"
                : "text.primary",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isSelected
                  ? "primary.dark"
                  : "action.hover"
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
      {/* Header */}
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

      {/* Days of week */}
      <Grid container spacing={1} mb={1}>
        {daysOfWeek.map((day) => (
          <Grid item xs={12 / 7} key={day}>
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

      {/* Calendar days */}
      <Grid container spacing={1}>
        {renderDays()}
      </Grid>
    </Box>
  );
};

export default Calendar;