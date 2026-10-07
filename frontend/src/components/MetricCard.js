import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({ title, value, subtitle, icon, gradient, darkMode }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        background: darkMode
          ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: darkMode
            ? '0 12px 28px rgba(0, 0, 0, 0.4)'
            : '0 12px 28px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {/* Background glow circle */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: gradient || 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          opacity: darkMode ? 0.15 : 0.1,
          filter: 'blur(20px)',
        }}
      />

      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode ? '#94a3b8' : '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: gradient || 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: darkMode ? '#f8fafc' : '#0f172a',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? '#64748b' : '#94a3b8',
              fontWeight: 500,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
