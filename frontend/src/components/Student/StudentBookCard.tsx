import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useMutation } from '@apollo/client';
import { UPDATE_STUDENT_BOOK_STATUS } from '../../GraphQl/Mutations';
import { LOAD_STUDENT_PROGRESS } from '../../GraphQl/Queries';
import { Book, ReadingStatus } from '../../types';

interface StudentBookCardProps {
  book: Book;
  studentId: string;
  currentStatus?: ReadingStatus;
}

const StudentBookCard: React.FC<StudentBookCardProps> = ({
  book,
  studentId,
  currentStatus = 'WANT_TO_READ',
}) => {
  const [updateStatus, { loading }] = useMutation(UPDATE_STUDENT_BOOK_STATUS, {
    refetchQueries: [{ query: LOAD_STUDENT_PROGRESS, variables: { studentId } }],
  });

  const handleStatusChange = (status: ReadingStatus) => {
    updateStatus({
      variables: {
        studentId,
        bookId: book.id,
        status,
      },
    });
  };

  const getStatusChip = () => {
    switch (currentStatus) {
      case 'COMPLETED':
        return (
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: '0.85rem !important', color: '#ffffff !important' }} />}
            label="Finished!"
            size="small"
            sx={{
              backgroundColor: '#28B8B8',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.72rem',
            }}
          />
        );
      case 'READING':
        return (
          <Chip
            icon={<AutoStoriesIcon sx={{ fontSize: '0.85rem !important', color: '#ffffff !important' }} />}
            label="Reading Now"
            size="small"
            sx={{
              backgroundColor: '#FAAD00',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.72rem',
            }}
          />
        );
      case 'WANT_TO_READ':
      default:
        return (
          <Chip
            icon={<BookmarkBorderIcon sx={{ fontSize: '0.85rem !important', color: '#335C6E !important' }} />}
            label="Want to Read"
            size="small"
            sx={{
              backgroundColor: '#edf2f5',
              color: '#335C6E',
              fontWeight: 700,
              fontSize: '0.72rem',
            }}
          />
        );
    }
  };

  return (
    <Card
      sx={{
        width: 240,
        height: 380,
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
        label={`Level ${book.readingLevel}`}
        size="small"
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 2,
          backgroundColor: 'rgba(51, 92, 110, 0.92)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '0.75rem',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Book Cover Image */}
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', backgroundColor: '#f0f4f6' }}>
        <CardMedia
          component="img"
          height="200"
          image={book.coverPhotoURL}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          sx={{ objectFit: 'cover', width: '100%' }}
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
        <Box>
          <Tooltip title={book.title} placement="top">
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
              {book.title}
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
              display: 'block',
              mt: 0.5,
            }}
          >
            by {book.author}
          </Typography>
        </Box>

        {/* Reading Status Pill & Quick Action Bar */}
        <Box sx={{ mt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>{getStatusChip()}</Box>

          <ButtonGroup
            size="small"
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: 2,
              '& .MuiButton-root': {
                fontSize: '0.65rem',
                fontWeight: 700,
                py: 0.4,
                textTransform: 'none',
              },
            }}
          >
            <Button
              variant={currentStatus === 'WANT_TO_READ' ? 'contained' : 'outlined'}
              onClick={() => handleStatusChange('WANT_TO_READ')}
              sx={{
                backgroundColor: currentStatus === 'WANT_TO_READ' ? '#edf2f5' : undefined,
                color: currentStatus === 'WANT_TO_READ' ? '#335C6E' : '#7b95a2',
                borderColor: '#dbe4ea',
              }}
            >
              Want
            </Button>
            <Button
              variant={currentStatus === 'READING' ? 'contained' : 'outlined'}
              onClick={() => handleStatusChange('READING')}
              sx={{
                backgroundColor: currentStatus === 'READING' ? '#FAAD00' : undefined,
                color: currentStatus === 'READING' ? '#ffffff' : '#FAAD00',
                borderColor: '#FAAD00',
                '&:hover': { backgroundColor: '#e09b00' },
              }}
            >
              Reading
            </Button>
            <Button
              variant={currentStatus === 'COMPLETED' ? 'contained' : 'outlined'}
              onClick={() => handleStatusChange('COMPLETED')}
              sx={{
                backgroundColor: currentStatus === 'COMPLETED' ? '#28B8B8' : undefined,
                color: currentStatus === 'COMPLETED' ? '#ffffff' : '#28B8B8',
                borderColor: '#28B8B8',
                '&:hover': { backgroundColor: '#1f9494' },
              }}
            >
              Done!
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentBookCard;
