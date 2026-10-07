import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  PersonAdd as AddFriendIcon,
  Leaderboard as LeaderboardIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { leaderboardAPI, friendsAPI } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import LeaderboardTable from '../components/LeaderboardTable';
import AddFriendModal from '../components/AddFriendModal';
import HeadToHeadModal from '../components/HeadToHeadModal';

const LeaderboardPage = ({ darkMode }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [openCompare, setOpenCompare] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await leaderboardAPI.getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      if (user?.is_guest) {
        setLeaderboard([
          {
            id: 1,
            name: 'Aditya Sinha',
            is_current_user: true,
            leetcode_handle: 'adityasinha513',
            codeforces_handle: 'tourist',
            github_handle: 'adityasinha513',
            codechef_handle: 'chandravo',
            gfg_handle: 'adityasinha513',
            total_solved: 842,
            codeforces_rating: 1945,
            github_stars: 128,
            score: 984,
            platforms_connected: 4,
          },
          {
            id: 2,
            name: 'Aarya Gupta',
            is_current_user: false,
            leetcode_handle: 'Aarya135',
            codeforces_handle: 'petr',
            github_handle: 'aaryaa135',
            codechef_handle: 'aarya135',
            gfg_handle: 'aaryagt7b',
            total_solved: 780,
            codeforces_rating: 1720,
            github_stars: 45,
            score: 865,
            platforms_connected: 4,
          },
          {
            id: 3,
            name: 'Guest Reviewer',
            is_current_user: false,
            leetcode_handle: 'tourist',
            codeforces_handle: 'tourist',
            github_handle: 'torvalds',
            codechef_handle: 'chandravo',
            gfg_handle: 'geeksforgeeks',
            total_solved: 650,
            codeforces_rating: 1650,
            github_stars: 32,
            score: 720,
            platforms_connected: 3,
          },
        ]);
      } else {
        setError(err.response?.data?.message || 'Failed to load leaderboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompare = (friendRow) => {
    setSelectedFriend(friendRow);
    setOpenCompare(true);
  };

  const handleDeleteFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    try {
      await friendsAPI.deleteFriend(friendId);
      fetchLeaderboard();
    } catch (err) {
      alert('Failed to delete friend');
    }
  };

  const currentUserEntry = leaderboard.find((item) => item.is_current_user);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <LeaderboardIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              Friends & Peer Leaderboard
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Compare your live problem counts and contest performance against friends.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchLeaderboard}
            disabled={loading}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              color: darkMode ? '#e2e8f0' : '#1e293b',
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddFriendIcon />}
            onClick={() => setOpenAddFriend(true)}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            Add Friend
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      {/* Leaderboard Table */}
      {loading ? (
        <Skeleton variant="rounded" height={340} sx={{ borderRadius: '16px' }} />
      ) : (
        <LeaderboardTable
          entries={leaderboard}
          onCompare={handleCompare}
          onDeleteFriend={handleDeleteFriend}
          darkMode={darkMode}
        />
      )}

      {/* Add Friend Dialog */}
      <AddFriendModal
        open={openAddFriend}
        onClose={() => setOpenAddFriend(false)}
        onFriendAdded={fetchLeaderboard}
        darkMode={darkMode}
      />

      {/* Head-to-Head Comparison Dialog */}
      <HeadToHeadModal
        open={openCompare}
        onClose={() => setOpenCompare(false)}
        currentUserData={currentUserEntry}
        friendData={selectedFriend}
        darkMode={darkMode}
      />
    </Container>
  );
};

export default LeaderboardPage;
