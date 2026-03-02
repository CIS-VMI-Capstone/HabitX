import React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

type Props = { onNavigate: (p: any) => void };

export default function Registration({ onNavigate }: Props) {
  return (
    <Paper sx={{ maxWidth: 560, p: 4, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Create your account
      </Typography>

      <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: "grid", gap: 2 }}>
        <TextField label="Username" required />
        <TextField label="Email" type="email" required />
        <TextField label="Password" type="password" required />
        <TextField label="Confirm Password" type="password" required />
        <Button variant="contained" fullWidth>
          Create Account
        </Button>

        <Button variant="text" onClick={() => onNavigate("login")}>
          ← Login
        </Button>
      </Box>
    </Paper>
  );
}
