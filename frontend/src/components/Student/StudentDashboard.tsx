import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useQuery } from '@apollo/client';
import {
  LOAD_STUDENT_ASSIGNED_BOOKS,
  LOAD_STUDENT_PROGRESS,
  LOAD_READING_GROUPS,
} from '../../GraphQl/Queries';
import { useAuth } from '../../context/AuthContext';
import {
  StudentAssignedBooksQueryData,
  StudentProgressQueryData,
  ReadingGroupsQueryData,
  ReadingStatus,
} from '../../types';
import StudentBookCard from './StudentBookCard';
import { getTierByAge } from '../../utils/ageLevelLadder';

type FilterTab = 'ALL' | ReadingStatus;

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const studentId = currentUser?.id || 'user-student-2';
  const studentAge = currentUser?.age || 5;
  const tier = getTierByAge(studentAge);

  const { data: booksData, loading: booksLoading, error: booksError } =
    useQuery<StudentAssignedBooksQueryData>(LOAD_STUDENT_ASSIGNED_BOOKS, {
      variables: { studentId },
    });

  const { data: progressData } = useQuery<StudentProgressQueryData>(LOAD_STUDENT_PROGRESS, {
    variables: { studentId },
  });

  const { data: groupsData } = useQuery<ReadingGroupsQueryData>(LOAD_READING_GROUPS);

  // Identify student's group
  const studentGroup = useMemo(() => {
    const groups = groupsData?.readingGroups || [];
    if (currentUser?.readingGroupId) {
      return groups.find((g) => g.id === currentUser.readingGroupId);
    }
    // Fallback: match by student ID enrolled in group
    return groups.find((g) => g.students.some((s) => s.id === studentId)) || groups[1];
  }, [groupsData, currentUser, studentId]);

  const assignedBooks = useMemo(() => {
    // If GraphQL studentAssignedBooks returns books, use them;
    // otherwise fallback to books from studentGroup
    if (booksData?.studentAssignedBooks && booksData.studentAssignedBooks.length > 0) {
      return booksData.studentAssignedBooks;
    }
    return studentGroup?.books || [];
  }, [booksData, studentGroup]);

  const progressMap = useMemo(() => {
    const map = new Map<string, ReadingStatus>();
    for (const record of progressData?.studentProgress || []) {
      map.set(record.bookId, record.status);
    }
    return map;
  }, [progressData]);

  // Statistics
  const completedCount = useMemo(() => {
    return assignedBooks.filter((b) => progressMap.get(b.id) === 'COMPLETED').length;
  }, [assignedBooks, progressMap]);

  const readingNowCount = useMemo(() => {
    return assignedBooks.filter((b) => progressMap.get(b.id) === 'READING').length;
  }, [assignedBooks, progressMap]);

  const wantToReadCount = useMemo(() => {
    return assignedBooks.filter((b) => {
      const status = progressMap.get(b.id);
      return !status || status === 'WANT_TO_READ';
    }).length;
  }, [assignedBooks, progressMap]);

  // Filtered books based on tab
  const displayedBooks = useMemo(() => {
    if (activeTab === 'ALL') return assignedBooks;
    if (activeTab === 'WANT_TO_READ') {
      return assignedBooks.filter((b) => {
        const s = progressMap.get(b.id);
        return !s || s === 'WANT_TO_READ';
      });
    }
    return assignedBooks.filter((b) => progressMap.get(b.id) === activeTab);
  }, [assignedBooks, progressMap, activeTab]);

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
      {/* Student Profile Hero Banner */}
      <Card
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f2fcfb 100%)',
          border: '2px solid #5ACCCC',
          boxShadow: '0 8px 24px rgba(90, 204, 204, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
          <Avatar
            src={currentUser?.avatarUrl}
            alt={currentUser?.name}
            sx={{
              width: 72,
              height: 72,
              border: '3px solid #5ACCCC',
              boxShadow: '0 4px 12px rgba(90, 204, 204, 0.25)',
            }}
          />

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#335C6E' }}>
                Welcome back, {currentUser?.name || 'Student'}!
              </Typography>
              <Chip
                label={`Age ${studentAge}`}
                size="small"
                sx={{
                  backgroundColor: '#fff0eb',
                  color: '#F76434',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                }}
              />
              <Chip
                label={`Reading Level ${tier.readingLevel}`}
                size="small"
                sx={{
                  backgroundColor: '#e6f7f7',
                  color: '#28B8B8',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: '#567d8d', mt: 0.8, fontWeight: 600 }}>
              Reading Group:{' '}
              <strong style={{ color: '#335C6E' }}>
                {studentGroup?.name || `${tier.ageRangeLabel} Cohort`}
              </strong>{' '}
              &bull; Stage: <em>{tier.stageName}</em>
            </Typography>

            <Typography variant="caption" sx={{ color: '#7b95a2', display: 'block', mt: 0.5 }}>
              Here are your teacher-assigned reading books tailored to age {studentAge} and reading Level {tier.readingLevel}.
            </Typography>
          </Box>
        </Box>

        {/* Milestone Stats Bar */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 3,
            pt: 2.5,
            borderTop: '1px solid #dff2f0',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #dceceb',
            }}
          >
            <MenuBookIcon sx={{ color: '#5ACCCC', fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: '#335C6E', fontWeight: 700 }}>
              Assigned Books: <strong>{assignedBooks.length}</strong>
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #dceceb',
            }}
          >
            <AutoStoriesIcon sx={{ color: '#FAAD00', fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: '#335C6E', fontWeight: 700 }}>
              Currently Reading: <strong>{readingNowCount}</strong>
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #dceceb',
            }}
          >
            <CheckCircleOutlineIcon sx={{ color: '#28B8B8', fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: '#335C6E', fontWeight: 700 }}>
              Completed: <strong>{completedCount}</strong>
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Filter Tabs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label={`All Books (${assignedBooks.length})`}
          clickable
          onClick={() => setActiveTab('ALL')}
          sx={{
            fontWeight: 700,
            fontSize: '0.8rem',
            backgroundColor: activeTab === 'ALL' ? '#335C6E' : '#ffffff',
            color: activeTab === 'ALL' ? '#ffffff' : '#335C6E',
            border: activeTab === 'ALL' ? '1px solid #335C6E' : '1px solid #d0dfe5',
          }}
        />
        <Chip
          icon={<AutoStoriesIcon sx={{ fontSize: '0.9rem !important', color: activeTab === 'READING' ? '#ffffff !important' : '#FAAD00 !important' }} />}
          label={`Reading Now (${readingNowCount})`}
          clickable
          onClick={() => setActiveTab('READING')}
          sx={{
            fontWeight: 700,
            fontSize: '0.8rem',
            backgroundColor: activeTab === 'READING' ? '#FAAD00' : '#ffffff',
            color: activeTab === 'READING' ? '#ffffff' : '#335C6E',
            border: activeTab === 'READING' ? '1px solid #FAAD00' : '1px solid #d0dfe5',
          }}
        />
        <Chip
          icon={<CheckCircleOutlineIcon sx={{ fontSize: '0.9rem !important', color: activeTab === 'COMPLETED' ? '#ffffff !important' : '#28B8B8 !important' }} />}
          label={`Finished (${completedCount})`}
          clickable
          onClick={() => setActiveTab('COMPLETED')}
          sx={{
            fontWeight: 700,
            fontSize: '0.8rem',
            backgroundColor: activeTab === 'COMPLETED' ? '#28B8B8' : '#ffffff',
            color: activeTab === 'COMPLETED' ? '#ffffff' : '#335C6E',
            border: activeTab === 'COMPLETED' ? '1px solid #28B8B8' : '1px solid #d0dfe5',
          }}
        />
        <Chip
          icon={<BookmarkBorderIcon sx={{ fontSize: '0.9rem !important', color: activeTab === 'WANT_TO_READ' ? '#ffffff !important' : '#7b95a2 !important' }} />}
          label={`Want to Read (${wantToReadCount})`}
          clickable
          onClick={() => setActiveTab('WANT_TO_READ')}
          sx={{
            fontWeight: 700,
            fontSize: '0.8rem',
            backgroundColor: activeTab === 'WANT_TO_READ' ? '#7b95a2' : '#ffffff',
            color: activeTab === 'WANT_TO_READ' ? '#ffffff' : '#335C6E',
            border: activeTab === 'WANT_TO_READ' ? '1px solid #7b95a2' : '1px solid #d0dfe5',
          }}
        />
      </Box>

      {/* Book Grid */}
      {booksLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#5ACCCC' }} />
        </Box>
      ) : booksError ? (
        <Alert severity="error">Failed to load assigned books: {booksError.message}</Alert>
      ) : displayedBooks.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1.5px dashed #dbe6ec',
          }}
        >
          <MenuBookIcon sx={{ fontSize: 60, color: '#d0eaeb', mb: 1.5 }} />
          <Typography variant="h6" sx={{ color: '#335C6E', fontWeight: 700 }}>
            No books found in this view
          </Typography>
          <Typography variant="body2" sx={{ color: '#7b95a2', mt: 0.5 }}>
            {activeTab === 'ALL'
              ? 'Your teacher has not assigned any books to your reading group yet.'
              : 'Try selecting another status tab above to see your other books.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {displayedBooks.map((book) => {
            const status = progressMap.get(book.id) || 'WANT_TO_READ';
            return (
              <Grid item key={book.id}>
                <StudentBookCard
                  book={book}
                  studentId={studentId}
                  currentStatus={status}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default StudentDashboard;
