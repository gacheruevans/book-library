import React from 'react'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';

interface SnackBarProps {
    openstate: boolean;
    title: string;
    onClick: () => void;
}

const SnackBar: React.FC<SnackBarProps> = ({ openstate, title, onClick }) => {
  return (
    <>
        <Snackbar
            anchorOrigin={{vertical:'top', horizontal:'center'}} 
            open={openstate} 
            autoHideDuration={2000} 
            onClose={onClick}
        >   
            <Alert
                onClose={onClick}
                variant="filled"
                sx={{  backgroundColor: "#53C2C2", width: '100%' }}
            >
            <AlertTitle>Success</AlertTitle>
            You have added `{title}` to your reading list.
            </Alert>
        </Snackbar>
    </>
  )
}

export default SnackBar