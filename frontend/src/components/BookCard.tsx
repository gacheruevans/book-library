import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignBookDialog from './Teacher/AssignBookDialog';
import { useAuth } from '../context/AuthContext';
import { Book } from '../types';

interface BookCardProps {
  id?: string;
  author: string;
  title: string;
  image: string;
  readingLevel: string;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  author,
  title,
  image,
  readingLevel,
}) => {
  const { isTeacher } = useAuth();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);

  const currentBookObject: Book = {
    id: id || '1',
    title,
    author,
    readingLevel,
    coverPhotoURL: image,
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
            backgroundColor: 'rgba(51, 92, 110, 0.92)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.75rem',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Teacher Action: Assign to Reading Group */}
        {isTeacher && (
          <Tooltip title="Assign to Reading Group" placement="top" arrow>
            <IconButton
              onClick={() => setIsAssignDialogOpen(true)}
              aria-label={`Assign "${title}" to reading group`}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: '#5ACCCC',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(90, 204, 204, 0.4)',
                '&:hover': {
                  backgroundColor: '#28B8B8',
                },
              }}
            >
              <GroupAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

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

      {/* Assign to Reading Group Dialog */}
      <AssignBookDialog
        open={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        book={currentBookObject}
      />
    </>
  );
};

export default BookCard;
