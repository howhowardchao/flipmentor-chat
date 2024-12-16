import React from 'react';
import { Box, Typography } from '@mui/material';
import { config } from '@/config/env';

export const ChatHeader: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundImage: `url(${'/assets/images/assistant_header.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 200,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <img
          src="/assets/images/assistant-large.png"
          alt="Assistant"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid white',
          }}
        />
        <Box sx={{ color: 'white' }}>
          <Typography variant="h5" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {config.course.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {config.course.assistantName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}; 