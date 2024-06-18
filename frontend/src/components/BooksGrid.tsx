import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import {v4 as uuidv4 } from 'uuid';
import BookCard from './BookCard';
import Typography from '@mui/material/Typography';
import ProgressBar from './ProgressBar';

interface BookGridProps {
    filteredData : object[] | undefined; 
    unfilteredData: object[] | undefined;
}

const BooksGrid: React.FC<BookGridProps> = ({ filteredData, unfilteredData}) => {
    const [filtered, setFiltered] = useState([]);
    const [unfiltered, setUnfiltered] = useState([]);
    const [visible, setVisible] = useState(12);
    const [loading, setLoading] = useState(false);
    
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight) {
            setLoading(true);
            setTimeout( () => {
                setVisible((prevValue) => prevValue + 12);
            },600)
            
        }
        return () => window.removeEventListener("scroll", handleScroll);
    };

    useEffect(() => {
        if(filteredData){
            setFiltered(filteredData);
            setLoading(false);  
        }

        if(unfilteredData) {
            setUnfiltered(unfilteredData);
            setLoading(false);
        }

        window.addEventListener("scroll", handleScroll);
        
    }, [filteredData, unfilteredData]);
    
    return (
        <div className="search_compoonent-grid">
        { filtered.length > 0 ?
            (   <>
                    <Typography variant="h5" sx={{color: '#FAAD00'}}>Filtered results...</Typography>
                    <Grid sx={{ flexGrow: 1 }} container spacing={2} >
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={1}>
                            {filtered.slice(0, visible).map((book) => (
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
                            {unfiltered.slice(0, visible).map((book) => (
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
                    <div className='loadMore'>
                        { loading && <ProgressBar /> }
                    </div>
                </> 
            )
        }
        </div>
    ); 
}

export default BooksGrid
