import React from "react";
import { createRoot } from "react-dom/client";
import Parse from "parse";
import App from "./App";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Initialize Parse with your Back4App credentials
const env = (import.meta as any).env || {};
const APP_KEY = env.VITE_APP_KEY || "bxwMWflUPNVtSCUQTKLRr6wpUYe9M5b0d6SVFkE4";
const JS_KEY = env.VITE_JS_KEY || "LIJulDqKabpcsMLgvbBLFCdMqtjyTu7DzhPqjAbP";
const SERVER_URL = env.VITE_SERVER_URL || "https://parseapi.back4app.com/";

console.log("Initializing Parse with:", { APP_KEY: APP_KEY.substring(0, 10) + "...", SERVER_URL });

try {
  Parse.initialize(APP_KEY, JS_KEY);
  Parse.serverURL = SERVER_URL;
  
  // Make Parse available globally for backward compatibility
  (window as any).Parse = Parse;
  console.log("Parse initialized successfully");
} catch (error) {
  console.error("Failed to initialize Parse:", error);
}

const theme = createTheme({
  palette: {
    primary: { main: "#000000ff" },
    secondary: { main: "#050505ff" },
  },
});

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element not found");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
