import { Box, Divider,Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton href="https://github.com/gacheruevans/ello-takehome-assessment">
                <GitHubIcon />
            </IconButton>
            <Divider orientation="vertical" />
            <Typography variant="subtitle2">@{new Date().getFullYear()} gacheruEvans. All rights reserved.</Typography>
        </Box>
      <Divider sx={{ my: 2 }} />
    </>
  )
}

export default Footer