import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import TeacherDrawer, { TeacherView } from '../Navigation/TeacherDrawer';
import ReadingGroupsView from './ReadingGroupsView';
import SearchBar from '../SearchBar';
import { useQuery } from '@apollo/client';
import { LOAD_READING_GROUPS, LOAD_BOOKS } from '../../GraphQl/Queries';
import { ReadingGroupsQueryData, BooksQueryData } from '../../types';

const TeacherDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<TeacherView>('GROUPS');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const { data: groupsData } = useQuery<ReadingGroupsQueryData>(LOAD_READING_GROUPS);
  const { data: booksData } = useQuery<BooksQueryData>(LOAD_BOOKS);

  const groupsCount = groupsData?.readingGroups?.length || 0;
  const booksCount = booksData?.books?.length || 0;

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* Teacher Navigation Drawer */}
      <TeacherDrawer
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
        groupsCount={groupsCount}
        booksCount={booksCount}
      />

      {/* Main Content Area */}
      <Box component="div" sx={{ flexGrow: 1, p: { xs: 1.5, sm: 3 }, width: { md: `calc(100% - 260px)` } }}>
        {/* Mobile View Switcher Bar */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            p: 1.5,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            border: '1px solid #eef3f5',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setMobileDrawerOpen(true)} size="small" aria-label="Open menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#335C6E' }}>
              {currentView === 'GROUPS' ? 'Reading Groups' : 'Books Catalog'}
            </Typography>
          </Box>
        </Box>

        {/* View Routing */}
        {currentView === 'GROUPS' ? <ReadingGroupsView /> : <SearchBar />}
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
