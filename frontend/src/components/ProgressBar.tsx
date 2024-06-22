import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ProgressBar = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress 
        sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#5ACCCC' : '#CFFAFA'),
        }}
      />
    </Box>
  );
}

export default ProgressBar
