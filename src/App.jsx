import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/index.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout      from './components/Layout.jsx';
import Login       from './pages/Login.jsx';
import Dashboard   from './pages/Dashboard.jsx';
import Habits      from './pages/Habits.jsx';
import NewHabit    from './pages/NewHabit.jsx';
import HabitDetail from './pages/HabitDetail.jsx';

/** Redirects to /login when not authenticated. */
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;                          // wait for session restore
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Redirects to / when already authenticated. */
function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={<RedirectIfAuth><Login /></RedirectIfAuth>}
      />

      {/* Protected — all nested under Layout */}
      <Route
        path="/"
        element={<RequireAuth><Layout /></RequireAuth>}
      >
        <Route index              element={<Dashboard />} />
        <Route path="habits"      element={<Habits />} />
        <Route path="habits/new"  element={<NewHabit />} />
        <Route path="habits/:id"  element={<HabitDetail />} />
        <Route path="habits/:id/edit" element={<NewHabit />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
