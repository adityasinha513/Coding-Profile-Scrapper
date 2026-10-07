import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CompareArrows as CompareIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const getRankMedal = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const LeaderboardTable = ({ entries, onCompare, onDeleteFriend, darkMode }) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: darkMode ? 'rgba(30, 41, 59, 0.6)' : '#ffffff',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
            <TableCell sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>Rank</TableCell>
            <TableCell sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>Developer</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>Total Solved</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>LeetCode</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>Codeforces</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>CodeChef</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>GitHub Stars</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: darkMode ? '#94a3b8' : '#64748b' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                  No participants on the leaderboard yet. Add friends to compare stats!
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            entries.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: row.is_current_user
                    ? darkMode
                      ? 'rgba(59, 130, 246, 0.08)'
                      : 'rgba(59, 130, 246, 0.04)'
                    : 'inherit',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                {/* Rank Medal */}
                <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }}>
                  {getRankMedal(row.rank)}
                </TableCell>

                {/* Developer */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: row.is_current_user ? '#3b82f6' : '#ec4899',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                      }}
                    >
                      {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: row.is_current_user ? 700 : 600 }}>
                          {row.name}
                        </Typography>
                        {row.is_current_user && (
                          <Chip label="You" size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700, bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                {/* Total Solved */}
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981' }}>
                    {row.total_solved}
                  </Typography>
                </TableCell>

                {/* LeetCode */}
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.leetcode_solved || 0}
                  </Typography>
                </TableCell>

                {/* Codeforces */}
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: row.codeforces_rating ? '#3b82f6' : 'inherit' }}>
                    {row.codeforces_rating || '-'}
                  </Typography>
                </TableCell>

                {/* CodeChef */}
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: row.codechef_rating ? '#ec4899' : 'inherit' }}>
                    {row.codechef_rating || '-'}
                  </Typography>
                </TableCell>

                {/* GitHub Stars */}
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b' }}>
                    ⭐ {row.github_stars || 0}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                  {!row.is_current_user ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CompareIcon />}
                        onClick={() => onCompare(row)}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          py: 0.3,
                        }}
                      >
                        Compare
                      </Button>
                      {onDeleteFriend && (
                        <Tooltip title="Remove friend">
                          <IconButton
                            size="small"
                            onClick={() => onDeleteFriend(row.id.replace('friend-', ''))}
                            sx={{ color: '#ef4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      (Primary)
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;
