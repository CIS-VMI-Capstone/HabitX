import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <AppBar
  position="static"
  elevation={0}
  sx={{
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  }}
>
  <Toolbar
    sx={{
      minHeight: 72,
      justifyContent: "center",
    }}
  >
    <Typography
      component="div"
      sx={{
        fontFamily: "Inter, Roboto, sans-serif",
        fontWeight: 600,
        fontSize: "1.4rem",
        letterSpacing: "-0.02em",
        color: "#000000ff",
      }}
    >
      Routine Rampage
    </Typography>
  </Toolbar>
</AppBar>
  );
}
