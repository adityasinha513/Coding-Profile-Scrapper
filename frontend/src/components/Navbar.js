import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Code as CodeIcon,
  Leaderboard as LeaderboardIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ darkMode, setDarkMode, onOpenEditHandles }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { label: 'Friends & Leaderboard', path: '/leaderboard', icon: <LeaderboardIcon sx={{ fontSize: 20 }} /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: darkMode ? 'rgba(22, 27, 34, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        color: darkMode ? '#ffffff' : '#1e293b',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64, px: { xs: 1, sm: 2 } }}>
          {/* Logo / Brand */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 3 }}
            onClick={() => navigate('/dashboard')}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                mr: 1.5,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              }}
            >
              <CodeIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                background: darkMode
                  ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
                  : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              DevProfile<span style={{ color: '#3b82f6', WebkitTextFillColor: '#3b82f6' }}>.hub</span>
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          {user && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      px: 2,
                      py: 0.8,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive
                        ? '#3b82f6'
                        : darkMode ? '#94a3b8' : '#64748b',
                      backgroundColor: isActive
                        ? darkMode ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.08)'
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        color: darkMode ? '#ffffff' : '#0f172a',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Right Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Dark / Light Toggle */}
            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                size="small"
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  color: darkMode ? '#fbbf24' : '#64748b',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                {darkMode ? <LightIcon fontSize="small" /> : <DarkIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* User Profile & Actions */}
            {user ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onOpenEditHandles}
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                    color: darkMode ? '#e2e8f0' : '#1e293b',
                    '&:hover': {
                      borderColor: '#3b82f6',
                      backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.04)',
                    },
                  }}
                >
                  Edit Handles
                </Button>

                <Tooltip title="Account Settings">
                  <Box
                    onClick={handleMenuOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: '24px',
                      '&:hover': { backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: '#3b82f6',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </Box>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {user.email}
                    </Typography>
                  </Box>
                  <MenuItem onClick={() => { handleMenuClose(); onOpenEditHandles(); }}>
                    <PersonIcon sx={{ fontSize: 18, mr: 1.5, color: '#3b82f6' }} />
                    Manage Coding Handles
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                    <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Hamburger */}
            {user && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: 'flex', md: 'none' }, color: darkMode ? '#e2e8f0' : '#1e293b' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            color: darkMode ? '#ffffff' : '#0f172a',
            p: 2,
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          DevProfile
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{ borderRadius: '8px', mb: 1 }}
              >
                {item.icon}
                <ListItemText primary={item.label} sx={{ ml: 2 }} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                onOpenEditHandles();
                setMobileOpen(false);
              }}
              sx={{ borderRadius: '8px', mb: 1 }}
            >
              <PersonIcon sx={{ fontSize: 20 }} />
              <ListItemText primary="Edit Handles" sx={{ ml: 2 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px', color: '#ef4444' }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
              <ListItemText primary="Sign Out" sx={{ ml: 2 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;