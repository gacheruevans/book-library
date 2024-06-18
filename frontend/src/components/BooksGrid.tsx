import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import {v4 as uuidv4 } from 'uuid';
import BookCard from './BookCard';
import Typography from '@mui/material/Typography';

interface BookGridProps {
    filteredData : object[] | undefined; 
    unfilteredData: object[] | undefined;
}

const BooksGrid: React.FC<BookGridProps> = ({ filteredData, unfilteredData}) => {
    const [filtered, setFiltered] = useState([]);
    const [unfiltered, setUnfiltered] = useState([]);
    
    useEffect(() => {
        if(filteredData){
            setFiltered(filteredData);  
        }

        if(unfilteredData) {
            setUnfiltered(unfilteredData);
        }
        
    }, [filteredData, unfilteredData]);
    
    return (
        <div>
        { filtered.length > 0 ?
            (   <>
                    <Typography variant="h5" sx={{color: '#FAAD00'}}>Filtered results...</Typography>
                    <Grid sx={{ flexGrow: 1 }} container spacing={2} >
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={1}>
                            {filtered.map((book) => (
                                <Grid key={ uuidv4()} item>
                                    <BookCard 
                                        key={uuidv4()} 
                                        title={book.title} 
                                        author={book.author} 
                                        image={book.coverPhotoURL}
                                        readingLevel={book.readingLevel}
                                    />
                                </Grid>
                            ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </> 
            )
           :
           (   <>
                    <Typography variant="h5" sx={{color: '#28B8B8'}}>All Books</Typography>
                    <Grid sx={{ flexGrow: 1 }} container spacing={2} >
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={1}>
                            {unfiltered.map((book) => (
                                <Grid key={ uuidv4()} item>
                                    <BookCard 
                                        key={uuidv4()} 
                                        title={book.title} 
                                        author={book.author} 
                                        image={book.coverPhotoURL}
                                        readingLevel={book.readingLevel}
                                    />
                                </Grid>
                            ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </> 
            )
        }
        </div>
    ); 
}

export default BooksGrid
