import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Link, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Login from './pages/Login/loginpage';
import Profile from './pages/Profile/profile';
import LeetCode from './pages/LeetCode/leetcode';
import CodeChef from './pages/CodeChef/codechef';
import GFG from './pages/GFG/gfg';
import GitHub from './pages/GitHub/github';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          paddingRight: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          paddingRight: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1,
              py: isMobile ? 2 : 3,
              px: isMobile ? 1 : 2,
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leetcode" 
                element={
                  <ProtectedRoute>
                    <LeetCode />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/codechef" 
                element={
                  <ProtectedRoute>
                    <CodeChef />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gfg" 
                element={
                  <ProtectedRoute>
                    <GFG />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/github" 
                element={
                  <ProtectedRoute>
                    <GitHub />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/profile" />} />
            </Routes>
          </Box>
          <Box 
            component="footer" 
            sx={{ 
              py: isMobile ? 2 : 3,
              px: isMobile ? 1 : 2,
              mt: 'auto',
              backgroundColor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{
                fontSize: isMobile ? '0.875rem' : '1rem',
              }}
            >
              {'© '}
              {new Date().getFullYear()}
              {' '}
              <Link 
                color="inherit" 
                href="https://github.com/adityasinha513"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Aditya Sinha
              </Link>
              {' - All rights reserved'}
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
