import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Todo from "./components/Todo";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Forgot from "./pages/Forgot";
import About from "./pages/About";

type Page = "home" | "login" | "register" | "forgot" | "about";

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
          {page === "forgot" && <Forgot onNavigate={setPage} />}
          {page === "about" && <About onNavigate={setPage} />}
        </Container>
      </Box>
    </Box>
  );
}
