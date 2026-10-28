import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ width: '100%', py: 4, mt: 'auto' }}>
      <Divider sx={{ mb: 3, borderColor: '#eef3f5' }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <IconButton
          href="https://github.com/gacheruevans/book-library"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          sx={{
            color: '#335C6E',
            '&:hover': { color: '#28B8B8', backgroundColor: '#e6f7f7' },
          }}
        >
          <GitHubIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ borderColor: '#d0dfe5' }} />
        <Typography variant="body2" sx={{ color: '#7b95a2' }}>
          &copy; {new Date().getFullYear()} Evans Gacheru Munene. Children&apos;s Book Library.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;