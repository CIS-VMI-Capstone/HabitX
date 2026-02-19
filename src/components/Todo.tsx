import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
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

type Task = { text: string; done: boolean };

const STORAGE_KEY = "tasks";

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
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
    setTasks((t) => [...t, { text, done: false }]);
    setValue("");
  }

  function toggleTask(i: number) {
    setTasks((t) => t.map((task, idx) => (idx === i ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(i: number) {
    setTasks((t) => t.filter((_, idx) => idx !== i));
  }

  function editTask(i: number) {
    const newText = window.prompt("Edit task:", tasks[i].text);
    if (newText !== null && newText.trim() !== "") {
      setTasks((t) => t.map((task, idx) => (idx === i ? { ...task, text: newText.trim() } : task)));
    }
  }

  return (
    <Paper sx={{ maxWidth: 700, p: 3, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        To-do List
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField value={value} onChange={(e) => setValue(e.target.value)} fullWidth placeholder="Add a task..." onKeyDown={(e) => e.key === "Enter" && addTask()} />
        <Button variant="contained" onClick={addTask}>
          Add
        </Button>
      </Box>

      {tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks yet. Add one above.</Typography>
      ) : (
        <List>
          {tasks.map((task, i) => (
            <ListItem key={i} divider>
              <Checkbox checked={task.done} onChange={() => toggleTask(i)} />
              <ListItemText primary={task.text} sx={{ textDecoration: task.done ? "line-through" : "none", color: task.done ? "text.disabled" : "inherit" }} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => editTask(i)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(i)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
