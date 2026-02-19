import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: "center", fontFamily: "Times New Roman, serif" }}>
          Routine Rampage
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
