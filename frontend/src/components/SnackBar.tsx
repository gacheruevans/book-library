import React from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';

interface SnackBarProps {
  openstate: boolean;
  title: string;
  message?: string;
  severity?: AlertColor;
  onClick: () => void;
}

const SnackBar: React.FC<SnackBarProps> = ({
  openstate,
  title,
  message,
  severity = 'success',
  onClick,
}) => {
  const alertTitle =
    severity === 'success'
      ? 'Success'
      : severity === 'error'
        ? 'Error'
        : severity === 'warning'
          ? 'Notice'
          : 'Info';

  const defaultMessage =
    severity === 'success'
      ? `You added "${title}" to your reading list.`
      : title;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={openstate}
      autoHideDuration={3000}
      onClose={onClick}
    >
      <Alert
        onClose={onClick}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          boxShadow: 3,
          backgroundColor:
            severity === 'success'
              ? '#335C6E'
              : severity === 'warning'
                ? '#FAAD00'
                : undefined,
          color: '#ffffff',
        }}
      >
        <AlertTitle>{alertTitle}</AlertTitle>
        {message || defaultMessage}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;