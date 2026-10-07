import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';
import { TrendingUp as TrendingUpIcon, Code as CodeIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeetCode = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profiles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const leetcodeProfile = response.data.find(p => p.Platform === 'LeetCode');
        if (leetcodeProfile) {
          setProfile(leetcodeProfile);
        } else {
          setError('LeetCode profile not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching LeetCode profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch LeetCode profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="info" sx={{ maxWidth: 600 }}>
          No LeetCode profile found
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        LeetCode Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                @{profile.Username}
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Rating: {profile.Rating}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <CodeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Solved: {profile.Solved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <TrophyIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Rank: {profile.Rank}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeetCode; 