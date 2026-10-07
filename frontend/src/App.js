import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Link, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import EditHandlesModal from './components/EditHandlesModal';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const getCustomTheme = (isDark) =>
  createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#3b82f6',
      },
      secondary: {
        main: '#8b5cf6',
      },
      background: {
        default: isDark ? '#0b1120' : '#f8fafc',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h4: { fontWeight: 800 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) return null;
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent({ darkMode, setDarkMode }) {
  const [openEditHandles, setOpenEditHandles] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenEditHandles={() => setOpenEditHandles(true)}
      />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  onOpenEditHandles={() => setOpenEditHandles(true)}
                  darkMode={darkMode}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>

      {/* Global Edit Handles Modal */}
      <EditHandlesModal
        open={openEditHandles}
        onClose={() => setOpenEditHandles(false)}
        darkMode={darkMode}
      />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
          backgroundColor: darkMode ? '#0b1120' : '#ffffff',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()}{' '}
          <Link
            href="https://github.com/adityasinha513"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 600, color: '#3b82f6', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Aditya Sinha
          </Link>{' '}
          • Coding Profile Scrapper v1.0 • Built with Flask & React
        </Typography>
      </Box>
    </Box>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved !== null ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('themeMode', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = getCustomTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
