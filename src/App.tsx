import React, { useState } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Sidebar from "./components/Sidebar";
import Todo from "./components/Todo";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Forgot from "./pages/Forgot";
import About from "./pages/About";

type Page =
  | "home"
  | "login"
  | "register"
  | "forgot"
  | "about"
  | "password-reset";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  
  try {
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
            {page === "password-reset" && <Forgot onNavigate={setPage} />}
          </Container>
        </Box>
      </Box>
    );
  } catch (error) {
    console.error("App render error:", error);
    return (
      <Box sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
        <h1>Error loading app</h1>
        <p>Please check the browser console for details.</p>
        <pre style={{ backgroundColor: "#fff", padding: 2, overflow: "auto" }}>
          {String(error)}
        </pre>
      </Box>
    );
  }
}
