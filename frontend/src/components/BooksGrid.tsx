import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import {v4 as uuidv4 } from 'uuid';
import BookCard from './BookCard';
import Typography from '@mui/material/Typography';
import ProgressBar from './ProgressBar';
import { Divider } from '@mui/material';

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
                setVisible((prevValue) => prevValue + 8);
            },800)
            
        }
        return () => window.removeEventListener("scroll", handleScroll);
    };

    useEffect(() => {
        if(filteredData) {
            setFiltered(filteredData);
            setLoading(false);  
        }
        if(unfilteredData) {
            setUnfiltered(unfilteredData);
            setLoading(false);  
        }

        window.addEventListener("scroll", handleScroll);
        
    }, [filteredData, unfilteredData]);
   
    return(   
        <div className="search_compoonent-grid">
            {
            filtered.length == 0 ? 
            (
                <>
                    <Typography variant="h5" sx={{color: '#28B8B8'}}>All books</Typography>
                </>
            ) 
            :
            (
                <>
                    <Typography variant="h5" sx={{color: '#FAAD00'}}>Filtered books</Typography>
                </>
            )
            }
            <Divider />
            <Grid sx={{ flexGrow: 1 }} container spacing={2} >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={1}>
                    { 
                    filtered.length == 0 ?
                        unfiltered.slice(0, visible).map((book) => (
                            <Grid key={ uuidv4()} item>
                                <BookCard 
                                    key={book.id} 
                                    title={book.title} 
                                    author={book.author} 
                                    image={book.coverPhotoURL}
                                    readingLevel={book.readingLevel}
                                />
                            </Grid>
                        ))
                        :
                        filtered.slice(0, visible).map((book) => (
                            <Grid key={ uuidv4()} item>
                                <BookCard 
                                    key={uuidv4()} 
                                    title={book.title} 
                                    author={book.author} 
                                    image={book.coverPhotoURL}
                                    readingLevel={book.readingLevel}
                                />
                            </Grid>
                        ))
                    }
                    </Grid>
                </Grid>
            </Grid>
            <div className='loadmore'>
                {loading && <ProgressBar/>}
            </div>
            
        </div> 
    );    
}

export default BooksGrid
