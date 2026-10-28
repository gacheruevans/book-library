import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SearchBar from './components/SearchBar';
import ReadingList from './components/ReadingList';
import Footer from './components/Footer';
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
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        {/* Sticky App Header */}
        <header className="app-header">
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
                  Teacher Reading List Assignment Platform
                </Typography>
              </Box>
            </Box>

            {/* Reading List Widget */}
            <Box sx={{ ml: 'auto' }}>
              <ReadingList />
            </Box>
          </div>
        </header>

        {/* Main Content: Search and Catalog */}
        <main className="app-main">
          <SearchBar />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
