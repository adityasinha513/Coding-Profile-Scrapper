import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Code as CodeIcon,
  Bolt as QuickIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ darkMode }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tab, setTab] = useState(0); // 0: Login, 1: Register

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [github, setGithub] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 0) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          name,
          leetcode,
          github,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login for recruiters & portfolio visitors
  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login('demo@portfolio.com', 'demo123');
      navigate('/dashboard');
    } catch (err) {
      setError('Could not log into demo account. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '20px',
          bgcolor: darkMode ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow: darkMode
            ? '0 20px 40px rgba(0, 0, 0, 0.4)'
            : '0 20px 40px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Brand Icon Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              mb: 1.5,
            }}
          >
            <CodeIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Coding Profile Scrapper
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Track & compare your competitive stats across platforms
          </Typography>
        </Box>

        {/* 1-Click Portfolio Demo Login Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<QuickIcon sx={{ color: '#f59e0b' }} />}
          onClick={handleDemoLogin}
          disabled={loading}
          sx={{
            py: 1.2,
            mb: 2.5,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            borderColor: '#f59e0b',
            color: darkMode ? '#fef08a' : '#b45309',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              borderColor: '#d97706',
            },
          }}
        >
          🚀 1-Click Guest Demo (Instant Access)
        </Button>

        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
            OR SIGN IN WITH ACCOUNT
          </Typography>
        </Divider>

        {/* Auth Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3,
            minHeight: 40,
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="Sign In" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' }} />
          <Tab label="Register" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' }} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {/* Auth Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {tab === 1 && (
            <TextField
              margin="dense"
              required
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              sx={{ mb: 1.5 }}
            />
          )}

          <TextField
            margin="dense"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            sx={{ mb: 1.5 }}
          />

          <TextField
            margin="dense"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            sx={{ mb: 1.5 }}
          />

          {tab === 1 && (
            <>
              <TextField
                margin="dense"
                fullWidth
                label="LeetCode Handle (optional)"
                placeholder="e.g. adityasinha513"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                size="small"
                sx={{ mb: 1.5 }}
              />
              <TextField
                margin="dense"
                fullWidth
                label="GitHub Username (optional)"
                placeholder="e.g. adityasinha513"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                size="small"
                sx={{ mb: 1.5 }}
              />
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : tab === 0 ? 'Sign In' : 'Create Account'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
