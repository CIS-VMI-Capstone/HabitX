import { createTheme } from '@mui/material/styles';

// ─── Habit-type accent colours (used directly in components) ─────────────────
export const HABIT_COLORS = {
  keep: '#2E7D32',   // dark green  — "keep a good habit"
  keepLight: '#E8F5E9',
  stop: '#C62828',   // dark red    — "stop a bad habit"
  stopLight: '#FFEBEE',
};

// ─── MUI Theme ────────────────────────────────────────────────────────────────
export const theme = createTheme({
  palette: {
    primary: {
      main: '#5C6BC0',   // Indigo 400
      light: '#8E99F3',
      dark: '#26418F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#26A69A',   // Teal 400
    },
    success: {
      main: '#43A047',
    },
    error: {
      main: '#E53935',
    },
    background: {
      default: '#F0F2F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 8 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 6 },
      },
    },
  },
});
