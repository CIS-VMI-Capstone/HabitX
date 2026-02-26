import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

type Props = {
  onNavigate: (page: "home" | "login" | "register" | "forgot" | "about") => void;
};

export default function Sidebar({ onNavigate }: Props) {
  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 220, "& .MuiDrawer-paper": { width: 220, boxSizing: "border-box", bgcolor: "#1f2933", color: "white", pt: 2 } }}>
      <Box sx={{ px: 2, pb: 2 }}>
        {/* Routine Rampage Logo */}
        <img src="/images/NewRampageLogo.png" alt="logo" style={{ width: 120, display: "block", margin: "0 auto 8px" }} />
      </Box>

      <List>
        <ListItemButton onClick={() => onNavigate("home")}>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={() => onNavigate("login")}>
          <ListItemText primary="Login" />
        </ListItemButton>
        <ListItemButton onClick={() => onNavigate("about")}>
          <ListItemText primary="About" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
