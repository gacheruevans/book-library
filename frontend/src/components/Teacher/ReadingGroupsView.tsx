import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useQuery, useMutation } from '@apollo/client';
import { LOAD_READING_GROUPS, LOAD_USERS } from '../../GraphQl/Queries';
import {
  DELETE_READING_GROUP,
  REMOVE_BOOK_FROM_GROUP,
  ASSIGN_STUDENT_TO_GROUP,
} from '../../GraphQl/Mutations';
import { ReadingGroupsQueryData, UsersQueryData } from '../../types';
import CreateGroupModal from './CreateGroupModal';
import { getTierByLevel } from '../../utils/ageLevelLadder';

const ReadingGroupsView: React.FC = () => {
  const [selectedFilterLevel, setSelectedFilterLevel] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const { data, loading, error } = useQuery<ReadingGroupsQueryData>(LOAD_READING_GROUPS);
  const { data: usersData } = useQuery<UsersQueryData>(LOAD_USERS);

  const [deleteGroup] = useMutation(DELETE_READING_GROUP, {
    refetchQueries: [{ query: LOAD_READING_GROUPS }],
  });

  const [removeBookFromGroup] = useMutation(REMOVE_BOOK_FROM_GROUP, {
    refetchQueries: [{ query: LOAD_READING_GROUPS }],
  });

  const [assignStudent] = useMutation(ASSIGN_STUDENT_TO_GROUP, {
    refetchQueries: [{ query: LOAD_READING_GROUPS }, { query: LOAD_USERS }],
  });

  const groups = useMemo(() => data?.readingGroups || [], [data]);
  const students = useMemo(() => {
    return (usersData?.users || []).filter((u) => u.role === 'STUDENT');
  }, [usersData]);

  const filteredGroups = useMemo(() => {
    if (selectedFilterLevel === 'ALL') return groups;
    return groups.filter(
      (g) => g.readingLevel.toUpperCase() === selectedFilterLevel.toUpperCase()
    );
  }, [groups, selectedFilterLevel]);

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (window.confirm(`Are you sure you want to delete reading group "${groupName}"?`)) {
      await deleteGroup({ variables: { id: groupId } });
      setSuccessBanner(`Group "${groupName}" has been deleted.`);
    }
  };

  const handleRemoveBook = async (groupId: string, bookId: string) => {
    await removeBookFromGroup({ variables: { groupId, bookId } });
  };

  const handleEnrollStudent = async (groupId: string, studentId: string) => {
    await assignStudent({ variables: { groupId, studentId } });
    setSuccessBanner('Student assigned to reading group successfully.');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
      {/* Header & CTA */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GroupsIcon sx={{ color: '#5ACCCC', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#335C6E' }}>
              Reading Groups
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#7b95a2', mt: 0.5 }}>
            Organize students into reading tiers where <strong>age brackets and reading levels coincide</strong> (e.g. 2–3 yrs ➔ Level A, 4–5 yrs ➔ Level B).
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
          sx={{
            backgroundColor: '#5ACCCC',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2.5,
            px: 2.5,
            py: 1,
            boxShadow: '0 4px 12px rgba(90, 204, 204, 0.3)',
            '&:hover': { backgroundColor: '#28B8B8' },
          }}
        >
          Create Reading Group
        </Button>
      </Box>

      {successBanner && (
        <Alert severity="success" onClose={() => setSuccessBanner(null)} sx={{ mb: 3 }}>
          {successBanner}
        </Alert>
      )}

      {/* Filter by Level Chips */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#335C6E' }}>
          Filter by Level:
        </Typography>
        {['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((level) => {
          const isSelected = selectedFilterLevel === level;
          const tier = level !== 'ALL' ? getTierByLevel(level) : null;
          return (
            <Chip
              key={level}
              label={tier ? `${tier.ageRangeLabel} (Level ${level})` : 'All Groups'}
              clickable
              size="small"
              onClick={() => setSelectedFilterLevel(level)}
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: isSelected ? '#335C6E' : '#ffffff',
                color: isSelected ? '#ffffff' : '#335C6E',
                border: isSelected ? '1px solid #335C6E' : '1px solid #d0dfe5',
                '&:hover': {
                  backgroundColor: isSelected ? '#254452' : '#eef5f8',
                },
              }}
            />
          );
        })}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#5ACCCC' }} />
        </Box>
      ) : error ? (
        <Alert severity="error">Failed to load reading groups: {error.message}</Alert>
      ) : filteredGroups.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <MenuBookIcon sx={{ fontSize: 56, color: '#cfe8e8', mb: 1.5 }} />
          <Typography variant="h6" sx={{ color: '#335C6E', fontWeight: 700 }}>
            No reading groups found
          </Typography>
          <Typography variant="body2" sx={{ color: '#7b95a2', mb: 2 }}>
            Click &quot;Create Reading Group&quot; above to add an age-and-level aligned cohort.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredGroups.map((group) => {
            const tier = getTierByLevel(group.readingLevel);

            return (
              <Grid item xs={12} md={6} key={group.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1.5px solid #e5edf1',
                    boxShadow: '0 4px 16px rgba(51, 92, 110, 0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#5ACCCC',
                      boxShadow: '0 8px 24px rgba(90, 204, 204, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                    {/* Top Row: Group Title & Level Badges */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#335C6E' }}>
                          {group.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip
                            label={group.ageRangeLabel}
                            size="small"
                            sx={{
                              backgroundColor: '#fff0eb',
                              color: '#F76434',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                            }}
                          />
                          <Chip
                            label={`Level ${group.readingLevel}`}
                            size="small"
                            sx={{
                              backgroundColor: '#e6f7f7',
                              color: '#28B8B8',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                            }}
                          />
                          {tier && (
                            <Typography variant="caption" sx={{ color: '#7b95a2', fontWeight: 600 }}>
                              ({tier.stageName})
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Tooltip title="Delete Group" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteGroup(group.id, group.name)}
                          sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Description */}
                    {group.description && (
                      <Typography variant="body2" sx={{ color: '#5a7885', my: 1.5, fontSize: '0.88rem' }}>
                        {group.description}
                      </Typography>
                    )}

                    {/* Enrolled Students Row */}
                    <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #f0f4f6' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#335C6E' }}>
                          Enrolled Students ({group.students.length})
                        </Typography>

                        {/* Quick Enroll dropdown if unassigned students exist */}
                        {students.some((s) => !group.students.some((gs) => gs.id === s.id)) && (
                          <Tooltip title="Enroll an eligible student" arrow>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PersonAddAlt1Icon sx={{ fontSize: 16, color: '#5ACCCC' }} />
                              <select
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleEnrollStudent(group.id, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  border: '1px solid #cfe0e6',
                                  color: '#335C6E',
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="" disabled>
                                  + Enroll student...
                                </option>
                                {students
                                  .filter((s) => !group.students.some((gs) => gs.id === s.id))
                                  .map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.name} (Age {s.age})
                                    </option>
                                  ))}
                              </select>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      {group.students.length === 0 ? (
                        <Typography variant="caption" sx={{ color: '#a0b3bd' }}>
                          No students currently enrolled.
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.75rem' } }}>
                            {group.students.map((st) => (
                              <Tooltip key={st.id} title={`${st.name} (Age ${st.age})`}>
                                <Avatar src={st.avatarUrl} alt={st.name} />
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                          <Typography variant="caption" sx={{ color: '#7b95a2' }}>
                            {group.students.map((s) => s.name).join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Assigned Books Accordion */}
                    <Box sx={{ mt: 2 }}>
                      <Accordion
                        elevation={0}
                        sx={{
                          backgroundColor: '#f7fafb',
                          borderRadius: '8px !important',
                          border: '1px solid #edf2f5',
                          '&:before': { display: 'none' },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={{ minHeight: 40, px: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <MenuBookIcon sx={{ fontSize: 18, color: '#5ACCCC' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#335C6E' }}>
                              Assigned Reading Books ({group.books.length})
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 1, pt: 0 }}>
                          {group.books.length === 0 ? (
                            <Typography variant="caption" sx={{ color: '#a0b3bd', display: 'block', p: 1 }}>
                              No books assigned yet. Switch to the <strong>Books Catalog</strong> view to assign Level {group.readingLevel} titles.
                            </Typography>
                          ) : (
                            <List dense disablePadding>
                              {group.books.map((b, idx) => (
                                <React.Fragment key={b.id}>
                                  {idx > 0 && <Divider component="li" />}
                                  <ListItem
                                    secondaryAction={
                                      <Tooltip title="Remove book from group" arrow>
                                        <IconButton
                                          edge="end"
                                          size="small"
                                          onClick={() => handleRemoveBook(group.id, b.id)}
                                          sx={{ color: '#F76434' }}
                                        >
                                          <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    }
                                  >
                                    <ListItemAvatar sx={{ minWidth: 36 }}>
                                      <Avatar
                                        variant="rounded"
                                        src={b.coverPhotoURL}
                                        alt={b.title}
                                        sx={{ width: 26, height: 36, borderRadius: 1 }}
                                      />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#335C6E' }} noWrap>
                                          {b.title}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                          <Typography component="span" variant="caption" sx={{ color: '#7b95a2' }}>
                                            {b.author}
                                          </Typography>
                                          <Chip
                                            label={`Level ${b.readingLevel}`}
                                            size="small"
                                            sx={{
                                              height: 16,
                                              fontSize: '0.6rem',
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
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(groupName) => {
          setSuccessBanner(`Reading group "${groupName}" created successfully!`);
        }}
      />
    </Box>
  );
};

export default ReadingGroupsView;
