import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Footer from './components/Footer';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import LoginModal from './components/Auth/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getTierByAge } from './utils/ageLevelLadder';
import './App.css';

/**
 * Custom Ello-inspired brand theme.
 * Colors:
 * - Teal: #5ACCCC / #28B8B8
 * - Dark Teal: #335C6E
 * - Orange/Coral: #F76434
 * - Yellow: #FAAD00
 */
const theme = createTheme({
  typography: {
    fontFamily: '"Mulish", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: { fontWeight: 800, color: '#335C6E' },
    h6: { fontWeight: 700, color: '#335C6E' },
    subtitle1: { fontWeight: 600, color: '#335C6E' },
    subtitle2: { fontWeight: 600, color: '#335C6E' },
    body1: { color: '#335C6E' },
    body2: { color: '#4a6f7f' },
  },
  palette: {
    primary: {
      main: '#5ACCCC',
      dark: '#28B8B8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F76434',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FAAD00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7fafb',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  zIndex: {
    drawer: 1100,
    appBar: 1300,
    modal: 1400,
    snackbar: 1500,
    tooltip: 1600,
  },
});

const AppContent: React.FC = () => {
  const { currentUser, isTeacher } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const headerRef = React.useRef<HTMLElement | null>(null);

  const studentTier = currentUser?.age ? getTierByAge(currentUser.age) : null;

  React.useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Fixed App Header - elevated above all content layers */}
      <header ref={headerRef} className="app-header">
        <div className="app-header-inner">
          {/* Brand Logo & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 3,
                backgroundColor: '#5ACCCC',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(90, 204, 204, 0.3)',
              }}
            >
              <AutoStoriesIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h6" component="h1" sx={{ lineHeight: 1.1, fontWeight: 800 }}>
                Children&apos;s Book Library
              </Typography>
              <Typography variant="caption" sx={{ color: '#7b95a2', fontWeight: 600 }}>
                Age & Reading Level Aligned Platform
              </Typography>
            </Box>
          </Box>

          {/* User Persona & Role Switcher */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              ml: 'auto',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {currentUser && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  border: isTeacher ? '1.5px solid #5ACCCC' : '1.5px solid #F76434',
                  boxShadow: '0 2px 8px rgba(51, 92, 110, 0.05)',
                }}
              >
                <Avatar
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#335C6E', display: 'block', lineHeight: 1.2 }}>
                    {currentUser.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#7b95a2', fontSize: '0.68rem', display: 'block' }}>
                    {isTeacher
                      ? 'Teacher'
                      : `Age ${currentUser.age} • Level ${studentTier?.readingLevel}`}
                  </Typography>
                </Box>
                <Chip
                  label={isTeacher ? 'Teacher' : `Level ${studentTier?.readingLevel}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: isTeacher ? '#e6f7f7' : '#fff0eb',
                    color: isTeacher ? '#28B8B8' : '#F76434',
                  }}
                />
              </Box>
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsLoginModalOpen(true)}
              startIcon={<SwapHorizIcon />}
              sx={{
                borderRadius: 2.5,
                borderColor: '#cde1e8',
                color: '#335C6E',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                backgroundColor: '#ffffff',
                '&:hover': {
                  borderColor: '#5ACCCC',
                  backgroundColor: '#f7fafb',
                },
              }}
            >
              Switch Role
            </Button>
          </Box>
        </div>
      </header>

      {/* Main Content: Teacher Dashboard or Student Dashboard */}
      <main className="app-main">
        {isTeacher ? <TeacherDashboard /> : <StudentDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Login & 1-Click Persona Switcher Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
