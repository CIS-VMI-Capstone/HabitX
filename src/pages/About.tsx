import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import '../styles/about.css';

type Props = { onNavigate?: (p: any) => void };

export default function About({ onNavigate }: Props) {
  return (
    <Paper sx={{ maxWidth: 1000, p: 4, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Our Mission</Typography>
        <Typography>Mission Statement</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Our Vision</Typography>
        <Typography>Vision Statement</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: 20 }}>
        <div className="team-member">
          <img src="./images/IMG_8088.jpeg" alt="Cambden Hadley" />
          <h3>Cambden Hadley</h3>
          <p>Job</p>
        </div>
        <div className="team-member">
          <img src="./images/IMG_9592.jpeg" alt="James Jeffers" />
          <h3>James Jeffers</h3>
          <p>Job</p>
        </div>
        <div className="team-member">
          <img src="./images/IMG_9591.jpeg" alt="Jeffery Cheeseman" />
          <h3>Jeffery Cheeseman</h3>
          <p>Job</p>
        </div>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => onNavigate && onNavigate("home")}>
          ← Home
        </Button>
      </Box>
    </Paper>
  );
}