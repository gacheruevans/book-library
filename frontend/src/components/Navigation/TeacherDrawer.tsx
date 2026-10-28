import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../../context/AuthContext';

export type TeacherView = 'GROUPS' | 'BOOKS';

interface TeacherDrawerProps {
  currentView: TeacherView;
  onSelectView: (view: TeacherView) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  groupsCount?: number;
  booksCount?: number;
}

const DRAWER_WIDTH = 260;

const TeacherDrawer: React.FC<TeacherDrawerProps> = ({
  currentView,
  onSelectView,
  mobileOpen,
  onMobileClose,
  groupsCount = 5,
  booksCount = 100,
}) => {
  const { currentUser } = useAuth();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Teacher Profile Card */}
      <Box sx={{ p: 2.5, backgroundColor: '#f7fafb', borderBottom: '1px solid #eef3f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: '#5ACCCC',
              color: '#ffffff',
            }}
          >
            <SchoolIcon fontSize="small" />
          </Box>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#335C6E', lineHeight: 1.2 }} noWrap>
              {currentUser?.name || 'Teacher Dashboard'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7b95a2' }} noWrap>
              Classroom Literacy Lead
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Teacher Portal"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.68rem',
            backgroundColor: '#e6f7f7',
            color: '#28B8B8',
          }}
        />
      </Box>

      {/* Navigation Links */}
      <Box sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ px: 1.5, fontWeight: 800, color: '#9bb1bd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Navigation
        </Typography>
        <List sx={{ mt: 1 }}>
          {/* Reading Groups Item */}
          <ListItem disablePadding sx={{ mb: 0.8 }}>
            <ListItemButton
              selected={currentView === 'GROUPS'}
              onClick={() => {
                onSelectView('GROUPS');
                onMobileClose();
              }}
              sx={{
                borderRadius: 2.5,
                py: 1.2,
                px: 1.8,
                '&.Mui-selected': {
                  backgroundColor: '#eef9f9',
                  color: '#28B8B8',
                  '&:hover': { backgroundColor: '#e2f5f5' },
                  '& .MuiListItemIcon-root': { color: '#28B8B8' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: currentView === 'GROUPS' ? '#28B8B8' : '#7b95a2' }}>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Reading Groups"
                primaryTypographyProps={{
                  fontWeight: currentView === 'GROUPS' ? 800 : 600,
                  fontSize: '0.92rem',
                }}
              />
              <Chip
                label={groupsCount}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: currentView === 'GROUPS' ? '#5ACCCC' : '#edf2f5',
                  color: currentView === 'GROUPS' ? '#ffffff' : '#7b95a2',
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Books Catalog Item */}
          <ListItem disablePadding>
            <ListItemButton
              selected={currentView === 'BOOKS'}
              onClick={() => {
                onSelectView('BOOKS');
                onMobileClose();
              }}
              sx={{
                borderRadius: 2.5,
                py: 1.2,
                px: 1.8,
                '&.Mui-selected': {
                  backgroundColor: '#eef9f9',
                  color: '#28B8B8',
                  '&:hover': { backgroundColor: '#e2f5f5' },
                  '& .MuiListItemIcon-root': { color: '#28B8B8' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: currentView === 'BOOKS' ? '#28B8B8' : '#7b95a2' }}>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText
                primary="Books Catalog"
                primaryTypographyProps={{
                  fontWeight: currentView === 'BOOKS' ? 800 : 600,
                  fontSize: '0.92rem',
                }}
              />
              <Chip
                label={booksCount}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: currentView === 'BOOKS' ? '#5ACCCC' : '#edf2f5',
                  color: currentView === 'BOOKS' ? '#ffffff' : '#7b95a2',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Footer Info Box */}
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#fafcfc' }}>
        <Typography variant="caption" sx={{ color: '#7b95a2', fontWeight: 600, display: 'block' }}>
          Age-Level Coincidence
        </Typography>
        <Typography variant="caption" sx={{ color: '#9bb1bd', fontSize: '0.68rem', display: 'block', mt: 0.5 }}>
          2–3y ➔ Level A &bull; 4–5y ➔ Level B &bull; 6–7y ➔ Level C
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          zIndex: 1250,
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, zIndex: 1250 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          zIndex: 100,
        }}
      >
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            zIndex: 100,
            '& .MuiDrawer-docked': {
              zIndex: 100,
            },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              position: 'sticky',
              top: 'calc(var(--header-height, 88px) + 20px)',
              height: 'calc(100vh - var(--header-height, 88px) - 40px)',
              borderRadius: 3,
              border: '1px solid #eef3f5',
              zIndex: '100 !important',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default TeacherDrawer;
