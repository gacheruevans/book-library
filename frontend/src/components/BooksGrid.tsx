import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import {v4 as uuidv4 } from 'uuid';
import BookCard from './BookCard';
import Typography from '@mui/material/Typography';
import ProgressBar from './ProgressBar';
import { Divider, IconButton, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import { KeyboardControlKeyRounded } from '@mui/icons-material';
import Grow from '@mui/material/Grow';

interface BookGridProps {
    filteredData : object[] | undefined; 
    unfilteredData: object[] | undefined;
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#28B8B8",
    color: '#FFFFFF',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#28B8B8",
  },
}));

const BooksGrid: React.FC<BookGridProps> = ({ filteredData, unfilteredData}) => {
    const [filtered, setFiltered] = useState([]);
    const [unfiltered, setUnfiltered] = useState([]);
    const [visible, setVisible] = useState(12);
    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const scrollBackTop = (event: React.MouseEvent<HTMLDivElement>) => {
        const anchor = (
            (event.target as HTMLDivElement).ownerDocument || document
        ).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({
                block: 'center',
            });
        }
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight) {
            setLoading(true);
            setTimeout( () => {
                setVisible((prevValue:number) => prevValue + 4);
                setTrigger(true);
            },500)
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
                filtered.length == 0 ? (<Typography variant="h5" sx={{color: '#28B8B8'}}>All books</Typography>) :
                (<Typography variant="h5" sx={{color: '#FAAD00'}}>Filtered books</Typography>)
            }
            <Divider id="back-to-top-anchor" />
            <Grid sx={{ flexGrow: 1 }} container spacing={2} >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={1}>
                    { 
                    filtered.length == 0 ?
                        unfiltered.slice(0, visible).map((book) => (
                            <Grow
                                in={true}
                                style={{ 
                                    transformOrigin: '0 0 0', 
                                    timeout: 1000, 
                                    transitionTimingFunction: 'ease-in-out' 
                                }}
                            >
                                <Grid key={ uuidv4()} item>
                                    <BookCard 
                                        key={book.id} 
                                        title={book.title} 
                                        author={book.author} 
                                        image={book.coverPhotoURL}
                                        readingLevel={book.readingLevel}
                                    />
                                </Grid>
                            </Grow>
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
            {trigger && 
                <div className="backtop">
                    <CustomTooltip title="Back Top" placement='top' arrow>
                        <IconButton 
                            onClick={scrollBackTop}
                            sx={{ 
                                backgroundColor:"#FAAD00",
                                buttonFocus: { border: "none"},
                                border:"1px solid #FABD33",
                                borderRadius:'10%',
                                color: '#FFFFFF',
                                ":hover": {
                                    border:"1px solid #4AA088",
                                    backgroundColor: "#28B8B8",
                                }
                            }} 
                            size="small"
                            edge="end"
                            aria-label='add to reading list'
                        >
                            <KeyboardControlKeyRounded />
                        </IconButton>
                    </CustomTooltip>
                </div>
            }
            <div className="infiniteScroll">
                {loading && <ProgressBar/>}
            </div>
            <Divider sx={{ margin:'40px 0 20px 0'}}/>
        </div> 
    );    
}

export default BooksGrid
