import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMutation } from '@apollo/client';
import { CREATE_READING_LIST } from '../GraphQl/Mutations';
import { LOAD_READING_LIST } from '../GraphQl/Queries';
import SnackBar from './SnackBar';

interface BookCardProps {
  id?: string;
  author: string;
  title: string;
  image: string;
  readingLevel: string;
  isInReadingList?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  author,
  title,
  image,
  readingLevel,
  isInReadingList = false,
}) => {
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [createReadingList, { loading: adding }] = useMutation(CREATE_READING_LIST, {
    refetchQueries: [{ query: LOAD_READING_LIST }],
  });

  const handleAdd = async () => {
    if (isInReadingList) {
      setSnackbarState({
        open: true,
        message: `"${title}" is already on your reading list.`,
        severity: 'warning',
      });
      return;
    }

    try {
      await createReadingList({
        variables: {
          title,
          author,
          readingLevel,
          coverPhotoURL: image,
        },
      });
      setSnackbarState({
        open: true,
        message: `Added "${title}" to your reading list.`,
        severity: 'success',
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add book to reading list.';
      setSnackbarState({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Card
        sx={{
          width: 240,
          height: 340,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 3,
          boxShadow: '0 4px 14px rgba(51, 92, 110, 0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 24px rgba(51, 92, 110, 0.16)',
          },
        }}
      >
        {/* Reading Level Badge Overlay */}
        <Chip
          label={`Level ${readingLevel}`}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            backgroundColor: 'rgba(51, 92, 110, 0.9)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.75rem',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Add/Added Action Button Overlay */}
        <Tooltip
          title={isInReadingList ? 'Already in reading list' : 'Add to reading list'}
          placement="top"
          arrow
        >
          <span>
            <IconButton
              onClick={handleAdd}
              disabled={adding}
              aria-label={
                isInReadingList
                  ? `"${title}" is already in reading list`
                  : `Add "${title}" to reading list`
              }
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: isInReadingList ? '#28B8B8' : '#FAAD00',
                color: '#ffffff',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: isInReadingList ? '#1f9494' : '#e09b00',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(250, 173, 0, 0.5)',
                  color: '#ffffff',
                },
              }}
              size="small"
            >
              {isInReadingList ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <PlaylistAddIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>

        {/* Book Cover Image */}
        <Box sx={{ position: 'relative', height: 210, overflow: 'hidden', backgroundColor: '#f0f4f6' }}>
          <CardMedia
            component="img"
            height="210"
            image={image}
            alt={`Cover of ${title}`}
            loading="lazy"
            sx={{
              objectFit: 'cover',
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.04)',
              },
            }}
          />
        </Box>

        {/* Book Details */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 1.5,
            '&:last-child': { pb: 1.5 },
          }}
        >
          <Tooltip title={title} placement="top">
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{
                fontWeight: 700,
                color: '#335C6E',
                lineHeight: 1.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '2.5em',
              }}
            >
              {title}
            </Typography>
          </Tooltip>

          <Typography
            variant="caption"
            sx={{
              color: '#F76434',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mt: 0.5,
            }}
          >
            by {author}
          </Typography>
        </CardContent>
      </Card>

      <SnackBar
        openstate={snackbarState.open}
        title={title}
        message={snackbarState.message}
        severity={snackbarState.severity}
        onClick={handleCloseSnackbar}
      />
    </>
  );
};

export default BookCard;
