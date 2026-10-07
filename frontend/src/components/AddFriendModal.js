import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { friendsAPI } from '../api/client';

const AddFriendModal = ({ open, onClose, onFriendAdded, darkMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handles, setHandles] = useState({
    leetcode: '',
    github: '',
    codeforces: '',
    codechef: '',
    gfg: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleHandleChange = (platform, val) => {
    setHandles((prev) => ({ ...prev, [platform]: val }));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please provide a friend name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await friendsAPI.addFriend({
        name: name.trim(),
        email: email.trim(),
        handles,
      });
      // Reset form
      setName('');
      setEmail('');
      setHandles({ leetcode: '', github: '', codeforces: '', codechef: '', gfg: '' });
      if (onFriendAdded) onFriendAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add friend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: darkMode ? '#1e293b' : '#ffffff',
          color: darkMode ? '#f8fafc' : '#0f172a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Add Friend to Compare
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', mb: 2 }}>
          Track and compare problem statistics and contest ratings with your peers.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <TextField
            fullWidth
            required
            label="Friend Name"
            placeholder="e.g. Aarya Gupta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            margin="dense"
          />
          <TextField
            fullWidth
            label="Email (optional)"
            placeholder="e.g. friend@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            margin="dense"
          />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
          Coding Platform Handles
        </Typography>

        <TextField
          fullWidth
          label="LeetCode Username"
          placeholder="e.g. Aarya135"
          value={handles.leetcode}
          onChange={(e) => handleHandleChange('leetcode', e.target.value)}
          size="small"
          margin="dense"
        />
        <TextField
          fullWidth
          label="Codeforces Handle"
          placeholder="e.g. petr"
          value={handles.codeforces}
          onChange={(e) => handleHandleChange('codeforces', e.target.value)}
          size="small"
          margin="dense"
        />
        <TextField
          fullWidth
          label="GitHub Username"
          placeholder="e.g. aaryaa135"
          value={handles.github}
          onChange={(e) => handleHandleChange('github', e.target.value)}
          size="small"
          margin="dense"
        />
        <TextField
          fullWidth
          label="CodeChef Username"
          placeholder="e.g. aarya135"
          value={handles.codechef}
          onChange={(e) => handleHandleChange('codechef', e.target.value)}
          size="small"
          margin="dense"
        />
        <TextField
          fullWidth
          label="GeeksforGeeks Username"
          placeholder="e.g. aaryagt7b"
          value={handles.gfg}
          onChange={(e) => handleHandleChange('gfg', e.target.value)}
          size="small"
          margin="dense"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: darkMode ? '#94a3b8' : '#64748b', textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Add Friend'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendModal;
