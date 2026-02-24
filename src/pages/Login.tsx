import React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


type Props = { onNavigate: (p: any) => void };

export default function Login({ onNavigate }: Props) {
  return (
    <Paper sx={{ maxWidth: 520, p: 4, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Welcome to Routine Rampage
      </Typography>

      <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: "grid", gap: 2 }}>
        <TextField label="Username" required />
        <TextField label="Password" type="password" required />
        <Button variant="contained" fullWidth>
          Login
        </Button>

        <Button variant="text" onClick={() => onNavigate("register")}>
          Create account
        </Button>
        <Button variant="text" onClick={() => onNavigate("forgot")}>
          Forgot password
        </Button>
      </Box>
    </Paper>
  );
}
