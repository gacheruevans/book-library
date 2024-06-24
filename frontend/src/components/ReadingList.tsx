import React, { useEffect, useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import {useQuery, gql} from '@apollo/client';
import {LOAD_READING_LIST} from '../GraphQl/Queries';

import {DELETE_FROM_READING_LIST} from '../GraphQl/Mutations';
import { useMutation } from '@apollo/client';

import ReadingListBadge from './Badge';
import { Grow } from '@mui/material';

const ReadingList = () => {
    const {loading, data, refetch } = useQuery(LOAD_READING_LIST, {pollInterval: 500,});
    const [deleteFromReadingList, {error}] = useMutation(DELETE_FROM_READING_LIST);
    const [readingList,setReadingList] = useState([]);
  
    const deleteBook = (value: number) => {
        deleteFromReadingList ({
            variables: {
                id: value
            }
        });
        refetch()

        if(error) {
            console.log(error);
        }
        
    };
    
    useEffect(() => {
        if(data) {
            setReadingList(data.readinglistbooks);
        }
    }, [data]);

    if(loading) return null;
    if(error) return `Error! ${error}`;

    return (
        <div>
         {
            readingList.length > 0 && 
                (
                    <Accordion sx={{zIndex: 2}}>
                        <AccordionSummary
                            sx={{border:"2px solid #5ACCCC"}}
                            expandIcon={readingList.length > 0 && <ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                        <Typography sx={{color: '#335C6E'}}>
                            <ReadingListBadge count={readingList.length}/> {readingList.length > 0 && 'Your Reading List'}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List sx={{ width: '100%', maxWidth: 340, bgcolor: 'background.paper', overflow: 'auto', maxHeight: 300}}>
                            {readingList.map((book, index) => (
                                <>
                                <Grow
                                    in={true}
                                    style={{ 
                                        transformOrigin: '0 0 0', 
                                        timeout: 1000, 
                                        transitionTimingFunction: 'ease-in-out' 
                                    }}
                                >
                                    <ListItem 
                                        key={book.title}

                                        alignItems="flex-start"
                                        secondaryAction={
                                            <IconButton 
                                                onClick={()=> deleteBook(book?.id)}
                                                color='error'
                                                edge="end" 
                                                aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            sx={{ color: "#335C6E" }}
                                            primary={book?.title}
                                            secondary= {
                                                <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline', padding: '4px' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"   
                                                >
                                                by    
                                                </Typography>
                                                <Typography
                                                    sx={{ display: 'inline', padding: '4px' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="#F76434"   
                                                >
                                                    {book?.author}
                                                </Typography>
                                                
                                                </React.Fragment>
                                            }
                                        />
                                    
                                    </ListItem>
                                </Grow>
                                    <Divider aria-hidden="true" key={book.id} component="li" sx={{border: '1px solid #5ACCCC'}} />
                                </>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )
        }
        
        </div>
    )
}

export default ReadingList
