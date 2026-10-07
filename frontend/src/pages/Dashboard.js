import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CheckCircle as SolvedIcon,
  EmojiEvents as TrophyIcon,
  Hub as HubIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { profilesAPI } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import MetricCard from '../components/MetricCard';
import PlatformCard from '../components/PlatformCard';

const PLATFORMS_LIST = ['LeetCode', 'Codeforces', 'GitHub', 'CodeChef', 'GFG'];

const Dashboard = ({ onOpenEditHandles, darkMode }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [summary, setSummary] = useState({ total_solved: 0, best_rating: 0, platforms_connected: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchProfiles = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await profilesAPI.getProfiles(isRefresh);
      setProfiles(data.profiles || []);
      setSummary(data.summary || { total_solved: 0, best_rating: 0, platforms_connected: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load profile statistics. Check backend status.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfiles(false);
  }, [user]);

  // Find profile data by platform name
  const getPlatformData = (name) => {
    return profiles.find((p) => p.platform?.toLowerCase() === name.toLowerCase()) || null;
  };

  const githubData = getPlatformData('GitHub');
  const totalStars = githubData?.stats?.total_stars ?? githubData?.total_stars ?? 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: darkMode ? '#f8fafc' : '#0f172a' }}>
            Welcome back, {user?.name || 'Developer'} 👋
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', mt: 0.5 }}>
            Here is your live multi-platform competitive programming and repository overview.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={() => fetchProfiles(true)}
            disabled={refreshing || loading}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              '&:hover': {
                borderColor: '#3b82f6',
                bgcolor: 'rgba(59, 130, 246, 0.08)',
              },
            }}
          >
            {refreshing ? 'Updating...' : 'Refresh Stats'}
          </Button>

          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={onOpenEditHandles}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
          >
            Manage Handles
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      {/* KPI Metric Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px' }} />
          ) : (
            <MetricCard
              title="Total Solved"
              value={summary.total_solved.toLocaleString()}
              subtitle="Combined LeetCode, CodeChef & GFG"
              icon={<SolvedIcon sx={{ fontSize: 22 }} />}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              darkMode={darkMode}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px' }} />
          ) : (
            <MetricCard
              title="Peak Rating"
              value={summary.best_rating ? summary.best_rating.toLocaleString() : 'Unrated'}
              subtitle="Highest contest ranking rating"
              icon={<TrophyIcon sx={{ fontSize: 22 }} />}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              darkMode={darkMode}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px' }} />
          ) : (
            <MetricCard
              title="Connected Hubs"
              value={`${summary.platforms_connected} / 5`}
              subtitle="Platforms configured"
              icon={<HubIcon sx={{ fontSize: 22 }} />}
              gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
              darkMode={darkMode}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px' }} />
          ) : (
            <MetricCard
              title="GitHub Stars"
              value={totalStars.toLocaleString()}
              subtitle={`${githubData?.public_repos ?? 0} public repositories`}
              icon={<StarIcon sx={{ fontSize: 22 }} />}
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              darkMode={darkMode}
            />
          )}
        </Grid>
      </Grid>

      {/* Platform Cards Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: darkMode ? '#f8fafc' : '#0f172a' }}>
          Platform Drilldown
        </Typography>

        <Grid container spacing={3}>
          {PLATFORMS_LIST.map((platformName) => (
            <Grid item xs={12} sm={6} lg={4} key={platformName}>
              {loading ? (
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: '16px' }} />
              ) : (
                <PlatformCard
                  platform={platformName}
                  data={getPlatformData(platformName)}
                  onConfigure={onOpenEditHandles}
                  darkMode={darkMode}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
