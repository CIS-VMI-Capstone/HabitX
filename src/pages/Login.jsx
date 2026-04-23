import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Tabs, Tab, Alert, InputAdornment, IconButton, Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, FitnessCenter } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0); // 0 = sign in, 1 = create account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTabChange = (_, newVal) => {
    setTab(newVal);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 1) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (tab === 0) {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo / Brand */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FitnessCenter sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h4" color="primary">
                RoutineRampage
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Track habits. Build streaks. Change your life.
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 600 } }}
          >
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {tab === 1 && (
              <TextField
                label="Display Name"
                fullWidth
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                sx={{ mb: 2 }}
                autoComplete="name"
                placeholder="How should we call you?"
              />
            )}

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              autoComplete="email"
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: tab === 1 ? 2 : 0 }}
              autoComplete={tab === 0 ? 'current-password' : 'new-password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {tab === 1 && (
              <TextField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting}
              sx={{ mt: 3 }}
            >
              {submitting
                ? 'Please wait…'
                : tab === 0
                ? 'Sign In'
                : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            Data stored securely via Back4App
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
