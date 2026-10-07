import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  EmojiEvents as EmojiEventsIcon,
  GitHub as GitHubIcon,
  Folder as FolderIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem('friends');
    return savedFriends ? JSON.parse(savedFriends) : [
      {
        id: 1,
        name: 'Aditya Sinha',
        leetcode: { username: 'adityasinha513', rating: 1500, solved: 250, rank: 5000 },
        codechef: { username: 'adityasinha513', rating: 1800, solved: 200, rank: 3000 },
        gfg: { username: 'adityasinha513', rating: 850, solved: 150, rank: 2000 },
        github: { username: 'adityasinha513', repos: 50, contributions: 1000, stars: 100 }
      },
      {
        id: 2,
        name: 'Aarya Gupta',
        email: 'aaryax135@gmail.com',
        leetcode: { username: 'Aarya135', rating: 0, solved: 0, rank: 'N/A' },
        codechef: { username: 'aarya135', rating: 0, solved: 0, rank: 'N/A' },
        gfg: { username: 'aaryagt7b', rating: 0, solved: 0, rank: 'N/A' },
        github: { username: 'aaryaa135', repos: 0, contributions: 0, stars: 0 }
      }
    ];
  });
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({
    name: '',
    email: '',
    leetcode: '',
    codechef: '',
    gfg: '',
    github: ''
  });

  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profiles. Please try again later.');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = () => {
    setOpenAddFriend(true);
  };

  const handleCloseAddFriend = () => {
    setOpenAddFriend(false);
    setNewFriend({
      name: '',
      email: '',
      leetcode: '',
      codechef: '',
      gfg: '',
      github: ''
    });
  };

  const handleNewFriendChange = (e) => {
    const { name, value } = e.target;
    setNewFriend(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewFriend = () => {
    if (!newFriend.name || !newFriend.email) {
      setError('Name and email are required');
      return;
    }

    const newFriendData = {
      id: friends.length + 1,
      name: newFriend.name,
      email: newFriend.email,
      leetcode: { username: newFriend.leetcode, rating: 0, solved: 0, rank: 'N/A' },
      codechef: { username: newFriend.codechef, rating: 0, solved: 0, rank: 'N/A' },
      gfg: { username: newFriend.gfg, rating: 0, solved: 0, rank: 'N/A' },
      github: { username: newFriend.github, repos: 0, contributions: 0, stars: 0 }
    };

    setFriends(prev => [...prev, newFriendData]);
    handleCloseAddFriend();
  };

  const handleRemoveFriend = (friendId) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
  };

  const renderProfileStats = (profile) => {
    if (!profile) return null;
    
    switch (profile.Platform) {
      case 'GitHub':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FolderIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Repositories: {profile.Repositories || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GitHubIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Contributions: {profile.Contributions || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarBorderIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Stars: {profile.Stars || 0}
              </Typography>
            </Box>
          </>
        );
      default:
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Rating: {profile.Rating || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Solved: {profile.Solved || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiEventsIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Rank: {profile.Rank || 'N/A'}
              </Typography>
            </Box>
          </>
        );
    }
  };

  const renderFriendsRanking = () => (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Friends Ranking
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFriend}
        >
          Add Friend
        </Button>
      </Box>
      <Grid container spacing={2}>
        {friends.map((friend) => (
          <Grid item xs={12} sm={6} md={4} key={friend.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {friend.name}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleRemoveFriend(friend.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {friend.email && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {friend.email}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    LeetCode
                  </Typography>
                  <Typography variant="body2">
                    Username: {friend.leetcode?.username || 'N/A'} | Solved: {friend.leetcode?.solved || 0} | Rank: {friend.leetcode?.rank || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    CodeChef
                  </Typography>
                  <Typography variant="body2">
                    Username: {friend.codechef?.username || 'N/A'} | Solved: {friend.codechef?.solved || 0} | Rank: {friend.codechef?.rank || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    GFG
                  </Typography>
                  <Typography variant="body2">
                    Username: {friend.gfg?.username || 'N/A'} | Solved: {friend.gfg?.solved || 0} | Rank: {friend.gfg?.rank || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    GitHub
                  </Typography>
                  <Typography variant="body2">
                    Username: {friend.github?.username || 'N/A'} | Repos: {friend.github?.repos || 0} | Stars: {friend.github?.stars || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Coding Profiles
      </Typography>

      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.Platform}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {profile.Platform}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Username: {profile.Username}
                </Typography>
                {renderProfileStats(profile)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {renderFriendsRanking()}

      <Dialog open={openAddFriend} onClose={handleCloseAddFriend}>
        <DialogTitle>Add New Friend</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newFriend.name}
            onChange={handleNewFriendChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={newFriend.email}
            onChange={handleNewFriendChange}
            required
          />
          <TextField
            margin="dense"
            name="leetcode"
            label="LeetCode Username"
            type="text"
            fullWidth
            value={newFriend.leetcode}
            onChange={handleNewFriendChange}
          />
          <TextField
            margin="dense"
            name="codechef"
            label="CodeChef Username"
            type="text"
            fullWidth
            value={newFriend.codechef}
            onChange={handleNewFriendChange}
          />
          <TextField
            margin="dense"
            name="gfg"
            label="GFG Username"
            type="text"
            fullWidth
            value={newFriend.gfg}
            onChange={handleNewFriendChange}
          />
          <TextField
            margin="dense"
            name="github"
            label="GitHub Username"
            type="text"
            fullWidth
            value={newFriend.github}
            onChange={handleNewFriendChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddFriend}>Cancel</Button>
          <Button onClick={handleSubmitNewFriend} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Profile; 