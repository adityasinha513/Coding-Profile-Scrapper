import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
  },
}));

const ProfileCard = ({ profile }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={profile.Photo}
            alt={profile.Name}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" component="div">
              {profile.Name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{profile.Username}
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Chip
            label={`Rank: ${profile.Rank}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`${profile['Number of Questions']} Solved`}
            color="success"
            variant="outlined"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Last Solved: {profile['Last Solved']}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default ProfileCard; 