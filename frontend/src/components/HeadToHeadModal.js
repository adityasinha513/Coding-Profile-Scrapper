import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  LinearProgress,
  IconButton,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ComparisonBar = ({ label, userVal = 0, friendVal = 0, suffix = '', darkMode }) => {
  const max = Math.max(userVal, friendVal, 1);
  const userPct = (userVal / max) * 100;
  const friendPct = (friendVal / max) * 100;
  const userWins = userVal > friendVal;
  const friendWins = friendVal > userVal;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: userWins ? 700 : 500,
            color: userWins ? '#3b82f6' : darkMode ? '#94a3b8' : '#64748b',
          }}
        >
          {userVal} {suffix} {userWins && '🏆'}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600, color: darkMode ? '#cbd5e1' : '#475569' }}>
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: friendWins ? 700 : 500,
            color: friendWins ? '#ec4899' : darkMode ? '#94a3b8' : '#64748b',
          }}
        >
          {friendWins && '🏆 '} {friendVal} {suffix}
        </Typography>
      </Box>

      {/* Dual Comparative Progress Bar */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {/* User bar (right-aligned) */}
        <Box sx={{ flex: 1, transform: 'scaleX(-1)' }}>
          <LinearProgress
            variant="determinate"
            value={userPct}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: darkMode ? 'rgba(59, 130, 246, 0.15)' : '#e2e8f0',
              '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6', borderRadius: 4 },
            }}
          />
        </Box>
        {/* Friend bar */}
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={friendPct}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: darkMode ? 'rgba(236, 72, 153, 0.15)' : '#e2e8f0',
              '& .MuiLinearProgress-bar': { bgcolor: '#ec4899', borderRadius: 4 },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const HeadToHeadModal = ({ open, onClose, currentUserData, friendData, darkMode }) => {
  if (!friendData) return null;

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
          Head-to-Head Comparison
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Opponents Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            p: 2,
            mb: 3,
            borderRadius: '12px',
            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0'}`,
          }}
        >
          {/* User Side */}
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48, mx: 'auto', mb: 1, fontWeight: 700 }}>
              {currentUserData?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {currentUserData?.name || 'You'}
            </Typography>
            <Chip size="small" label="You" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 600, mt: 0.5 }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800, color: darkMode ? '#64748b' : '#94a3b8' }}>
            VS
          </Typography>

          {/* Friend Side */}
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#ec4899', width: 48, height: 48, mx: 'auto', mb: 1, fontWeight: 700 }}>
              {friendData?.name?.charAt(0) || 'F'}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {friendData?.name}
            </Typography>
            <Chip size="small" label="Friend" sx={{ bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', fontWeight: 600, mt: 0.5 }} />
          </Box>
        </Box>

        {/* Metrics Comparison */}
        <ComparisonBar
          label="Total Problems Solved"
          userVal={currentUserData?.total_solved ?? 0}
          friendVal={friendData?.total_solved ?? 0}
          darkMode={darkMode}
        />
        <ComparisonBar
          label="LeetCode Problems"
          userVal={currentUserData?.leetcode_solved ?? 0}
          friendVal={friendData?.leetcode_solved ?? 0}
          darkMode={darkMode}
        />
        <ComparisonBar
          label="Best Contest Rating"
          userVal={currentUserData?.best_rating ?? 0}
          friendVal={friendData?.best_rating ?? 0}
          darkMode={darkMode}
        />
        <ComparisonBar
          label="Codeforces Rating"
          userVal={currentUserData?.codeforces_rating ?? 0}
          friendVal={friendData?.codeforces_rating ?? 0}
          darkMode={darkMode}
        />
        <ComparisonBar
          label="GitHub Public Stars"
          userVal={currentUserData?.github_stars ?? 0}
          friendVal={friendData?.github_stars ?? 0}
          darkMode={darkMode}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HeadToHeadModal;
