import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useQuery, useMutation } from '@apollo/client';
import { LOAD_READING_GROUPS } from '../../GraphQl/Queries';
import { ASSIGN_BOOK_TO_GROUP, REMOVE_BOOK_FROM_GROUP } from '../../GraphQl/Mutations';
import { Book, ReadingGroupsQueryData } from '../../types';

interface AssignBookDialogProps {
  open: boolean;
  onClose: () => void;
  book: Book | null;
}

const AssignBookDialog: React.FC<AssignBookDialogProps> = ({ open, onClose, book }) => {
  const { data, loading, error } = useQuery<ReadingGroupsQueryData>(LOAD_READING_GROUPS);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const [assignBook, { loading: assigning }] = useMutation(ASSIGN_BOOK_TO_GROUP, {
    refetchQueries: [{ query: LOAD_READING_GROUPS }],
  });

  const [removeBook, { loading: removing }] = useMutation(REMOVE_BOOK_FROM_GROUP, {
    refetchQueries: [{ query: LOAD_READING_GROUPS }],
  });

  if (!book) return null;

  const readingGroups = data?.readingGroups || [];

  const handleAssign = async (groupId: string, groupName: string) => {
    try {
      await assignBook({
        variables: { groupId, bookId: book.id },
      });
      setFeedback({
        message: `Assigned "${book.title}" to ${groupName}.`,
        severity: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to assign book.';
      setFeedback({ message: msg, severity: 'error' });
    }
  };

  const handleRemove = async (groupId: string, groupName: string) => {
    try {
      await removeBook({
        variables: { groupId, bookId: book.id },
      });
      setFeedback({
        message: `Removed "${book.title}" from ${groupName}.`,
        severity: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove book.';
      setFeedback({ message: msg, severity: 'error' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            variant="rounded"
            src={book.coverPhotoURL}
            alt={book.title}
            sx={{ width: 44, height: 60, borderRadius: 1.5 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#335C6E', lineHeight: 1.2 }}>
              {book.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#F76434', fontWeight: 600 }}>
                by {book.author}
              </Typography>
              <Chip
                label={`Level ${book.readingLevel}`}
                size="small"
                sx={{
                  backgroundColor: '#e6f7f7',
                  color: '#28B8B8',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="caption" sx={{ color: '#7b95a2', display: 'block', mb: 2 }}>
          Assign this book to reading groups. Groups matching <strong>Level {book.readingLevel}</strong> coincide with this book's reading stage.
        </Typography>

        {feedback && (
          <Alert severity={feedback.severity} sx={{ mb: 2 }}>
            {feedback.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#5ACCCC' }} />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load groups: {error.message}</Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {readingGroups.map((group) => {
              const isAssigned = group.books.some((b) => b.id === book.id);
              const isLevelMatch = group.readingLevel.toUpperCase() === book.readingLevel.toUpperCase();

              return (
                <Box
                  key={group.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 2,
                    border: isLevelMatch ? '1.5px solid #28B8B8' : '1px solid #e2ecf0',
                    backgroundColor: isLevelMatch ? '#f8fdfd' : '#ffffff',
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ flexGrow: 1, pr: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#335C6E' }}>
                        {group.name}
                      </Typography>
                      <Chip
                        label={`${group.ageRangeLabel}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: '#fff0eb',
                          color: '#F76434',
                        }}
                      />
                      <Chip
                        label={`Level ${group.readingLevel}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: '#e6f7f7',
                          color: '#28B8B8',
                        }}
                      />
                      {isLevelMatch && (
                        <Chip
                          icon={<AutoAwesomeIcon sx={{ fontSize: '0.8rem !important', color: '#28B8B8 !important' }} />}
                          label="Coinciding Level Match"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            backgroundColor: '#ddf7f5',
                            color: '#1e8888',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#7b95a2' }}>
                      {group.students.length} students enrolled • {group.books.length} books assigned
                    </Typography>
                  </Box>

                  {isAssigned ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled={assigning || removing}
                      onClick={() => handleRemove(group.id, group.name)}
                      startIcon={<CheckCircleIcon sx={{ color: '#28B8B8' }} />}
                      sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                    >
                      Assigned (Remove)
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      disabled={assigning || removing}
                      onClick={() => handleAssign(group.id, group.name)}
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{
                        backgroundColor: isLevelMatch ? '#28B8B8' : '#5ACCCC',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: isLevelMatch ? '#1f9494' : '#28B8B8',
                        },
                      }}
                    >
                      Assign
                    </Button>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#335C6E', fontWeight: 700, textTransform: 'none' }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignBookDialog;
