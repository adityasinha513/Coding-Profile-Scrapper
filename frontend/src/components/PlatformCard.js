import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  OpenInNew as ExternalLinkIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';

// Platform branding colors & badges
const PLATFORM_CONFIG = {
  LeetCode: {
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgBadge: 'rgba(245, 158, 11, 0.1)',
  },
  Codeforces: {
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bgBadge: 'rgba(59, 130, 246, 0.1)',
  },
  GitHub: {
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    bgBadge: 'rgba(139, 92, 246, 0.1)',
  },
  CodeChef: {
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    bgBadge: 'rgba(236, 72, 153, 0.1)',
  },
  GFG: {
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    bgBadge: 'rgba(16, 185, 129, 0.1)',
  },
};

const PlatformCard = ({ platform, data, onConfigure, darkMode }) => {
  const config = PLATFORM_CONFIG[platform] || {
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bgBadge: 'rgba(59, 130, 246, 0.1)',
  };

  const isConfigured = Boolean(data && data.username);
  const isAvailable = Boolean(data && data.available && data.stats);
  const stats = isAvailable ? data.stats : {};

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.6)' : '#ffffff',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode
            ? '0 12px 28px rgba(0, 0, 0, 0.35)'
            : '0 12px 28px rgba(0, 0, 0, 0.07)',
          borderColor: config.color,
        },
      }}
    >
      {/* Top accent border */}
      <Box
        sx={{
          height: 4,
          background: config.gradient,
          width: '100%',
        }}
      />

      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header: Platform title & badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: config.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              {platform.slice(0, 2).toUpperCase()}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>
                {platform}
              </Typography>
              {isConfigured && (
                <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  @{data.username}
                </Typography>
              )}
            </Box>
          </Box>

          {isAvailable && stats.profile_url && (
            <Tooltip title="View Public Profile">
              <IconButton
                component="a"
                href={stats.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: darkMode ? '#94a3b8' : '#64748b',
                  '&:hover': { color: config.color },
                }}
              >
                <ExternalLinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* State 1: Not configured */}
        {!isConfigured ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: darkMode ? '#64748b' : '#94a3b8', mb: 2 }}>
              No {platform} handle connected.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={onConfigure}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                color: darkMode ? '#e2e8f0' : '#1e293b',
                '&:hover': {
                  borderColor: config.color,
                  color: config.color,
                },
              }}
            >
              Connect Username
            </Button>
          </Box>
        ) : !isAvailable ? (
          /* State 2: Configured but Unavailable (graceful fallback) */
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 28, mb: 1, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#f87171' : '#dc2626', fontWeight: 600, mb: 0.5 }}>
              Data Unavailable
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b', mb: 2, maxWidth: 220 }}>
              {data.error || 'Profile could not be reached.'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={onConfigure}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.75rem',
                borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                color: darkMode ? '#94a3b8' : '#64748b',
              }}
            >
              Change Username
            </Button>
          </Box>
        ) : (
          /* State 3: Available data */
          <Box sx={{ flexGrow: 1 }}>
            {/* LeetCode Details */}
            {platform === 'LeetCode' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    Problems Solved
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    {stats.solved ?? 0}
                  </Typography>
                </Box>

                {/* Difficulty breakdown */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, mb: 2.5 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Easy</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{stats.solved_easy ?? 0}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, ((stats.solved_easy || 0) / 300) * 100)}
                      sx={{ height: 6, borderRadius: 3, bgcolor: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 3 } }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>Medium</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{stats.solved_medium ?? 0}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, ((stats.solved_medium || 0) / 300) * 100)}
                      sx={{ height: 6, borderRadius: 3, bgcolor: darkMode ? 'rgba(245, 158, 11, 0.15)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b', borderRadius: 3 } }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Hard</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{stats.solved_hard ?? 0}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, ((stats.solved_hard || 0) / 100) * 100)}
                      sx={{ height: 6, borderRadius: 3, bgcolor: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444', borderRadius: 3 } }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1, borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  {stats.rating ? (
                    <Chip size="small" icon={<TrendingUpIcon />} label={`Rating: ${stats.rating}`} sx={{ fontWeight: 600, bgcolor: config.bgBadge, color: config.color }} />
                  ) : null}
                  {stats.global_rank ? (
                    <Chip size="small" label={`Rank: #${Number(stats.global_rank).toLocaleString()}`} variant="outlined" />
                  ) : null}
                </Box>
              </Box>
            )}

            {/* Codeforces Details */}
            {platform === 'Codeforces' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    Contest Rating
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: config.color }}>
                    {stats.rating || 'Unrated'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip
                    label={stats.rank || 'Unrated'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: config.bgBadge,
                      color: config.color,
                      fontSize: '0.8125rem',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                    Peak: {stats.max_rating || stats.rating || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8', display: 'block' }}>Contribution</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.contribution ?? 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8', display: 'block' }}>Peak Rank</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.max_rank || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* GitHub Details */}
            {platform === 'GitHub' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    Public Repositories
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    {stats.public_repos ?? 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#f59e0b', mb: 0.5 }}>
                      <StarIcon sx={{ fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Total Stars</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{stats.total_stars ?? 0}</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#3b82f6', mb: 0.5 }}>
                      <PeopleIcon sx={{ fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Followers</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{stats.followers ?? 0}</Typography>
                  </Box>
                </Box>

                {stats.bio && (
                  <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{stats.bio}"
                  </Typography>
                )}
              </Box>
            )}

            {/* CodeChef Details */}
            {platform === 'CodeChef' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    Rating
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: config.color }}>
                    {stats.rating || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={stats.stars || '1 Star'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: config.bgBadge,
                      color: config.color,
                    }}
                  />
                  {stats.solved > 0 && (
                    <Chip
                      label={`${stats.solved} Solved`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, pt: 1.5, borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8', display: 'block' }}>Global Rank</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.global_rank || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8', display: 'block' }}>Country Rank</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.country_rank || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* GFG Details */}
            {platform === 'GFG' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    Coding Score
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: config.color }}>
                    {stats.rating || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1, p: 1.5, borderRadius: '10px', bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8', display: 'block' }}>Problems Solved</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{stats.solved ?? 0}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 1.5, borderRadius: '10px', bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#64748b' : '#94a3b8', display: 'block' }}>Institute Rank</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{stats.rank || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformCard;
