import React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


type Props = { onNavigate: (p: any) => void };

export default function Forgot({ onNavigate }: Props) {
  return (
    <Paper sx={{ maxWidth: 520, p: 4, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Reset your password
      </Typography>

      <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: "grid", gap: 2 }}>
        <TextField label="Username" />
        <TextField label="Email" type="email" />
        <Button variant="contained">Reset Password</Button>

        <Button variant="text" onClick={() => onNavigate("login")}>
          ← Login
        </Button>
      </Box>
    </Paper>
  );
}
