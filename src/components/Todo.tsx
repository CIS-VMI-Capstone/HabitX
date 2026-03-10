import React, { useEffect, useState } from "react";
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

//Built in browser storage to temporarily store our list....so it does not dissapear
const STORAGE_KEY = "tasks";

export default function Todo() {
  //Load task from the local browser storage when we run 'npm run dev'
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      //Store it as JSON then retrieve it back as JS
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      //Make sure the task matches our "task" -> "Text: String....etc"
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
                  secondary={`Created: ${new Date(task.createdAt).toLocaleDateString()}`}
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