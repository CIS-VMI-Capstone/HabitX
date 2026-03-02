import React, { useState } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Todo from "./components/Todo";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Forgot from "./pages/Forgot";
import About from "./pages/About";
import Calendar from "./components/Calender";

type Page =
  | "home"
  | "login"
  | "register"
  | "forgot"
  | "about"
  | "calendar";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar onNavigate={(p) => setPage(p)} />
      <Box sx={{ flex: 1 }}>
        <Header />
        <Container sx={{ py: 4 }}>
          {page === "home" && <Todo />}
          {page === "login" && <Login onNavigate={setPage} />}
          {page === "register" && <Registration onNavigate={setPage} />}
          {page === "forgot" && <Forgot onNavigate={setPage} />}
          {page === "about" && <About onNavigate={setPage} />}
          {page === "calendar" && <Calendar />}
        </Container>
      </Box>
    </Box>
  );
}
