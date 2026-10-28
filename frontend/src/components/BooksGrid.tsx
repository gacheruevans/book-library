import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookCard from './BookCard';
import ProgressBar from './ProgressBar';
import { Book } from '../types';

interface BooksGridProps {
  books: Book[];
  isFilterActive: boolean;
  onResetFilter?: () => void;
}

const PAGE_SIZE = 12;

const BooksGrid: React.FC<BooksGridProps> = ({
  books,
  isFilterActive,
  onResetFilter,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Reset pagination count whenever the filtered book list changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [books]);

  // Clean scroll handler with proper debounce and cleanup
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setShowBackToTop(scrollY > 400);

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isBottom = windowHeight + scrollY >= documentHeight - 200;

    if (isBottom && !isLoadingMore && visibleCount < books.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 8, books.length));
        setIsLoadingMore(false);
      }, 350);
    }
  }, [isLoadingMore, visibleCount, books.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const visibleBooks = books.slice(0, visibleCount);
  const hasMore = visibleCount < books.length;

  if (books.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          px: 2,
          textAlign: 'center',
          maxWidth: 480,
          mx: 'auto',
        }}
      >
        <MenuBookIcon sx={{ fontSize: 64, color: '#CFFAFA', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#335C6E', fontWeight: 700, mb: 1 }}>
          No books found
        </Typography>
        <Typography variant="body2" sx={{ color: '#7b95a2', mb: 3 }}>
          {isFilterActive
            ? 'We could not find any books matching your search or level criteria.'
            : 'No books available at the moment.'}
        </Typography>
        {isFilterActive && onResetFilter && (
          <Button
            variant="contained"
            onClick={onResetFilter}
            sx={{
              backgroundColor: '#5ACCCC',
              color: '#ffffff',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#28B8B8' },
            }}
          >
            Clear Filters & Show All
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 3, position: 'relative' }}>
      {/* Catalog Status Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: '#335C6E', fontWeight: 700 }}>
          {isFilterActive ? 'Filtered Results' : 'Explore Books'}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: '#7b95a2', ml: 1, fontWeight: 500 }}
          >
            ({books.length} {books.length === 1 ? 'book' : 'books'})
          </Typography>
        </Typography>

        <Typography variant="caption" sx={{ color: '#7b95a2' }}>
          Showing {visibleBooks.length} of {books.length}
        </Typography>
      </Box>

      {/* Book Grid */}
      <Grid container spacing={3} justifyContent="center">
        {visibleBooks.map((book) => {
          return (
            <Grid item key={book.id}>
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                image={book.coverPhotoURL}
                readingLevel={book.readingLevel}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Infinite Scroll Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {isLoadingMore ? (
          <ProgressBar />
        ) : hasMore ? (
          <Typography variant="caption" sx={{ color: '#7b95a2' }}>
            Scroll down to load more books...
          </Typography>
        ) : (
          <Typography variant="caption" sx={{ color: '#a0b3bd' }}>
            You have reached the end of the catalog
          </Typography>
        )}
      </Box>

      {/* Responsive Floating Back-to-Top Button */}
      <Zoom in={showBackToTop}>
        <Tooltip title="Back to top" placement="left">
          <Fab
            onClick={scrollToTop}
            size="medium"
            aria-label="Scroll back to top"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
              backgroundColor: '#FAAD00',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(250, 173, 0, 0.4)',
              '&:hover': {
                backgroundColor: '#28B8B8',
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Tooltip>
      </Zoom>
    </Box>
  );
};

export default BooksGrid;
