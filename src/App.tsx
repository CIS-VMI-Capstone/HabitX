import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Sidebar from "./components/Sidebar";
import Todo from "./components/Todo";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Forgot from "./pages/Forgot";
import About from "./pages/About";
import Calendar from "./components/Calendar";
import Parse from "./parseConfig";

type Page =
  | "home"
  | "login"
  | "register"
  | "forgot"
  | "about";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  useEffect(() => {
    fetchTodos();
  }, []);

 async function fetchTodos() {
    const Todo = Parse.Object.extend('Todos');
    const query = new Parse.Query(Todo);

    try {
      const results = await query.find();
      console.log('Fetched:', results);
      return results;
    } catch (error) {
      console.error('Error fetching:', error);
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar onNavigate={(p) => setPage(p)} />
      <Box sx={{ flex: 1 }}>
        <Container sx={{ py: 4 }}>
          {page === "home" && <Todo />}
          {page === "login" && <Login onNavigate={setPage} />}
          {page === "register" && <Registration onNavigate={setPage} />}
          {page === "forgot" && <Forgot onNavigate={setPage} />}
          {page === "about" && <About onNavigate={setPage} />}
        </Container>
      </Box>
    </Box>
  );
}
