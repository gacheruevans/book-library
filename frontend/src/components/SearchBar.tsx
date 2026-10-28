import React, { useState, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useQuery } from '@apollo/client';
import { LOAD_BOOKS, LOAD_READING_LIST } from '../GraphQl/Queries';
import BooksGrid from './BooksGrid';
import { Book, BooksQueryData, ReadingListQueryData } from '../types';

const READING_LEVELS = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery<BooksQueryData>(LOAD_BOOKS);

  const { data: readingListData } = useQuery<ReadingListQueryData>(LOAD_READING_LIST);

  const books: Book[] = useMemo(() => booksData?.books || [], [booksData]);

  // Set of titles currently on the reading list for O(1) lookup
  const readingListTitles = useMemo(() => {
    const list = readingListData?.readinglistbooks || [];
    return new Set(list.map((item) => item.title.trim().toLowerCase()));
  }, [readingListData]);

  // Autocomplete options grouped and ordered by reading level
  const autocompleteOptions = useMemo(() => {
    return [...books].sort((a, b) => a.readingLevel.localeCompare(b.readingLevel));
  }, [books]);

  // Filtered books based on search term and selected reading level
  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      const matchesLevel =
        selectedLevel === 'ALL' ||
        book.readingLevel.toUpperCase() === selectedLevel.toUpperCase();

      return matchesSearch && matchesLevel;
    });
  }, [books, searchTerm, selectedLevel]);

  const isFilterActive = searchTerm.trim().length > 0 || selectedLevel !== 'ALL';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLevel('ALL');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2 }}>
      {/* Search Header Bar */}
      <Box sx={{ maxWidth: 640, mx: 'auto', mt: 2, mb: 3 }}>
        <Autocomplete
          id="book-search-autocomplete"
          freeSolo
          options={autocompleteOptions}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
          groupBy={(option) => `Reading Level ${option.readingLevel}`}
          inputValue={searchTerm}
          onInputChange={(_, newInputValue) => {
            setSearchTerm(newInputValue);
          }}
          onChange={(_, value) => {
            if (typeof value === 'object' && value !== null) {
              setSearchTerm(value.title);
            }
          }}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1,
                borderBottom: '1px solid #f0f4f6',
              }}
            >
              <Avatar
                variant="rounded"
                src={option.coverPhotoURL}
                alt={option.title}
                sx={{ width: 36, height: 48, borderRadius: 1 }}
              />
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#335C6E' }} noWrap>
                  {option.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#F76434' }} noWrap>
                  by {option.author}
                </Typography>
              </Box>
              <Chip
                label={`Level ${option.readingLevel}`}
                size="small"
                sx={{
                  backgroundColor: '#e6f7f7',
                  color: '#28B8B8',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          )}
          renderInput={(params) => (
            <Paper
              elevation={2}
              sx={{
                p: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 3,
                border: '2px solid #5ACCCC',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                '&:focus-within': {
                  borderColor: '#28B8B8',
                  boxShadow: '0 4px 16px rgba(90, 204, 204, 0.25)',
                },
              }}
            >
              <SearchIcon sx={{ color: '#FAAD00', mr: 1 }} />
              <TextField
                {...params}
                variant="standard"
                placeholder="Search books by title or author..."
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
                sx={{ flexGrow: 1 }}
              />
              {searchTerm && (
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search input"
                  sx={{ color: '#7b95a2' }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Paper>
          )}
        />

        {/* Reading Level Filter Chips */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            mt: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#335C6E', fontWeight: 700, mr: 0.5 }}>
            Filter by Level:
          </Typography>
          {READING_LEVELS.map((level) => {
            const isSelected = selectedLevel === level;
            return (
              <Chip
                key={level}
                label={level === 'ALL' ? 'All Levels' : `Level ${level}`}
                clickable
                size="small"
                onClick={() => setSelectedLevel(level)}
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
      </Box>

      {/* Main Content Area */}
      <Divider sx={{ my: 2, borderColor: '#eef3f5' }} />

      {booksLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#5ACCCC', mb: 2 }} />
          <Typography variant="body2" sx={{ color: '#335C6E', fontWeight: 600 }}>
            Loading children's book library...
          </Typography>
        </Box>
      ) : booksError ? (
        <Box
          sx={{
            p: 4,
            my: 4,
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: '#fff4f1',
            border: '1px solid #fcdad1',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <Typography variant="h6" sx={{ color: '#F76434', fontWeight: 700, mb: 1 }}>
            Backend Server Connection Error
          </Typography>
          <Typography variant="body2" sx={{ color: '#335C6E', mb: 2 }}>
            Unable to fetch book data from GraphQL server: {booksError.message}.
          </Typography>
          <Typography variant="caption" sx={{ color: '#7b95a2' }}>
            Please ensure the backend server is running on port 4000 (<code>npm run start</code> in
            the backend directory).
          </Typography>
        </Box>
      ) : (
        <BooksGrid
          books={filteredBooks}
          readingListTitles={readingListTitles}
          isFilterActive={isFilterActive}
          onResetFilter={handleResetFilters}
        />
      )}
    </Box>
  );
};

export default SearchBar;
