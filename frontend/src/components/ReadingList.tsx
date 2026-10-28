import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, useMutation } from '@apollo/client';
import { LOAD_READING_LIST } from '../GraphQl/Queries';
import { DELETE_FROM_READING_LIST } from '../GraphQl/Mutations';
import ReadingListBadge from './Badge';
import { ReadingListQueryData } from '../types';

const ReadingList: React.FC = () => {
  const { loading, error, data } = useQuery<ReadingListQueryData>(LOAD_READING_LIST);
  const [deleteFromReadingList, { loading: deleting }] = useMutation(DELETE_FROM_READING_LIST, {
    refetchQueries: [{ query: LOAD_READING_LIST }],
  });

  const readingList = data?.readinglistbooks || [];

  const handleDelete = (id: string) => {
    deleteFromReadingList({
      variables: { id },
    });
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <CircularProgress size={20} sx={{ color: '#5ACCCC', mr: 1 }} />
        <Typography variant="body2" sx={{ color: '#335C6E' }}>
          Loading reading list...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="caption" sx={{ color: '#F76434' }}>
        Unable to load reading list: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 420 }}>
      <Accordion
        defaultExpanded={readingList.length > 0}
        sx={{
          borderRadius: '12px !important',
          border: '2px solid #5ACCCC',
          boxShadow: '0 4px 16px rgba(90, 204, 204, 0.15)',
          overflow: 'hidden',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#335C6E' }} />}
          aria-controls="reading-list-content"
          id="reading-list-header"
          sx={{
            backgroundColor: '#ffffff',
            minHeight: 56,
            px: 2,
            '&.Mui-expanded': { minHeight: 56 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ReadingListBadge count={readingList.length} />
            <Typography sx={{ color: '#335C6E', fontWeight: 700, fontSize: '0.95rem' }}>
              Reading List
            </Typography>
            <Chip
              label={`${readingList.length} ${readingList.length === 1 ? 'book' : 'books'}`}
              size="small"
              sx={{
                ml: 'auto',
                mr: 1,
                backgroundColor: '#e6f7f7',
                color: '#28B8B8',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0, maxHeight: 380, overflowY: 'auto' }}>
          {readingList.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7b95a2' }}>
                Your reading list is empty.
              </Typography>
              <Typography variant="caption" sx={{ color: '#a0b3bd' }}>
                Click the + icon on any book below to assign it.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {readingList.map((book, index) => (
                <React.Fragment key={book.id}>
                  {index > 0 && <Divider component="li" sx={{ borderColor: '#eef3f5' }} />}
                  <ListItem
                    alignItems="center"
                    sx={{
                      py: 1,
                      px: 2,
                      transition: 'background-color 0.2s',
                      '&:hover': { backgroundColor: '#f7fafb' },
                    }}
                    secondaryAction={
                      <Tooltip title="Remove from list" placement="left" arrow>
                        <span>
                          <IconButton
                            onClick={() => handleDelete(book.id)}
                            disabled={deleting}
                            edge="end"
                            aria-label={`Remove "${book.title}" from reading list`}
                            size="small"
                            sx={{
                              color: '#F76434',
                              '&:hover': { backgroundColor: 'rgba(247, 100, 52, 0.1)' },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    }
                  >
                    {book.coverPhotoURL && (
                      <ListItemAvatar sx={{ minWidth: 46 }}>
                        <Avatar
                          variant="rounded"
                          src={book.coverPhotoURL}
                          alt={book.title}
                          sx={{ width: 36, height: 48, borderRadius: 1, mr: 1 }}
                        />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      sx={{ my: 0, pr: 2 }}
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: '#335C6E',
                            lineHeight: 1.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {book.title}
                        </Typography>
                      }
                      secondary={
                        <Box
                          component="span"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}
                        >
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ color: '#F76434', fontWeight: 600 }}
                          >
                            by {book.author}
                          </Typography>
                          <Chip
                            label={`Level ${book.readingLevel}`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              backgroundColor: '#e6f7f7',
                              color: '#28B8B8',
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ReadingList;
