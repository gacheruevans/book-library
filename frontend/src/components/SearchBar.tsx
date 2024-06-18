import React, { useEffect, useMemo, useState } from 'react'
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { v4 as uuidv4 } from 'uuid';

import {useQuery} from '@apollo/client';
import {LOAD_BOOKS} from '../GraphQl/Queries';

import BooksGrid from './BooksGrid';

const SearchBar = () => {
  const [focus, setFocus] = useState(500);
  const [filteredData, setFilteredData] = useState([]);
  const { loading, error, data } = useQuery(LOAD_BOOKS);
  const [books, setBooks] = useState([]);

  const options = books.map((option) => {
    const firstLetter = option.readingLevel.toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  const handleFilter = (e) => {
    const searchWord = e.target.value;

    if(searchWord === '') setFilteredData([]);
    
    const newFilter = books.filter(({ title }) => 
      title.toLowerCase().includes(searchWord.toLowerCase())
    );
    setFilteredData(newFilter);
  };

  useEffect(() => {

    if(data) {
      setBooks(data.books);
    }
  }, [data]);
  
  return (
    <>
      <div className='search_component'>
        <Autocomplete
          id="book-search"
          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          autoHighlight
          groupBy={(option) => option.readingLevel}
          getOptionLabel={(option) => option.title}
          sx={{ width:`${focus}px`, border: 'none'}}
          renderOption={(props, option) => (
            <Box key={uuidv4()} component="li" sx={{ '& > img': { mr: 1, flexShrink: 0 }}} {...props}>
              <img  
                loading="lazy"
                width="60"
                srcSet={`${option.coverPhotoURL}`}
                src={`${option.coverPhotoURL}`}
                alt=""
              />
              {option.title}
              <Divider sx={{ height: 28, m: 0.5 }} orientation="horizontal" />
            </Box>
          )}
          renderInput={(params) => (
            <>
              <Paper
                component="form"
                sx={{ p: '6px 14px', display: 'flex', alignItems: 'center', border: '2px solid #5ACCCC'}}
              >
                <TextField
                  {...params}
                  label="What are we reading today?"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                  variant="standard"
                  onChange={handleFilter}
                  onKeyDown={handleFilter}
                  onFocus={handleFilter}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon sx={{ color: '#FAAD00' }}/>
                </IconButton>
              </Paper>
            </>
          )}
        />
      </div>
      <div className="books_component">
        { 
          !loading && ( <BooksGrid filteredData={filteredData} unfilteredData={books}/> )
        }
      </div>
    </>
  )
}

export default SearchBar
