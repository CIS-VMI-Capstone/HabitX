import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import "../styles/about.css";

type Props = { onNavigate?: (p: any) => void };

export default function About({ onNavigate }: Props) {
  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 4,
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        background: "linear-gradient(to bottom, #ffffff, #f8fafc)"
      }}
    >
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
            letterSpacing: 0.5
          }}
        >
          Routine Rampage
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 700,
            mx: "auto",
            color: "#475569",
            fontSize: "1.05rem",
            lineHeight: 1.7
          }}
        >
          The most efficient tracker built to help you manage and tackle lifelong habits.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 5
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            height: "100%",
            backgroundColor: "#ffffff"
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
          >
            Our Mission
          </Typography>
          <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>
            Here at Routine Rampage, we are focused on helping users track,
            manage, and improve both their good and bad habits in a way that is
            simple, and motivating.
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            height: "100%",
            backgroundColor: "#ffffff"
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
          >
            Our Vision
          </Typography>
          <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>
            Our vision is to create an app that helps people build consistency while
            staying accountable.
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 4,
            color: "#1e293b"
          }}
        >
          The Team
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)"
            },
            gap: 3
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: 3,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              boxShadow: 2,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6
              }
            }}
          >
            <img
              src="./images/IMG_8088.jpeg"
              alt="Cambden Hadley"
              style={{
                width: "100%",
                maxWidth: "220px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "16px",
                marginBottom: "16px"
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Cambden Hadley
            </Typography>
            <Typography sx={{ color: "#64748b" }}>
              PM & Frontend Developer
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              p: 3,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              boxShadow: 2,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6
              }
            }}
          >
            <img
              src="./images/IMG_9592.jpeg"
              alt="James Jeffers"
              style={{
                width: "100%",
                maxWidth: "220px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "16px",
                marginBottom: "16px"
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
              James Jeffers
            </Typography>
            <Typography sx={{ color: "#64748b" }}>
              Backend Developer
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              p: 3,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              boxShadow: 2,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6
              }
            }}
          >
            <img
              src="./images/IMG_9591.jpeg"
              alt="Jeffery Cheeseman"
              style={{
                width: "100%",
                maxWidth: "220px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "16px",
                marginBottom: "16px"
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Jeffery Cheeseman
            </Typography>
            <Typography sx={{ color: "#64748b" }}>
              Sound Maker
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={() => onNavigate && onNavigate("home")}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem"
          }}
        >
          ← Back Home
        </Button>
      </Box>
    </Paper>
  );
}