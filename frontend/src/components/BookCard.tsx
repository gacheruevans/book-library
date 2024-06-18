import  React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import {CardActions } from '@mui/material';
import { PlaylistAddRounded } from '@mui/icons-material';


import {CREATE_READING_LIST} from '../GraphQl/Mutations';
import { useMutation } from '@apollo/client';
import SnackBar from './SnackBar';

interface BookCardProps {
  author: string;
  title: string; 
  image: string;
  readingLevel: string;
}

const BookCard: React.FC<BookCardProps> = ({ author, title, image, readingLevel }) => {
  const[createReadingList, {error}] = useMutation(CREATE_READING_LIST);
  
  const [state, setState]= useState(false);
  
  const addToReadingList = () => {
    setState(true);
    createReadingList({
      variables: {
        title: title,
        author: author,
        readingLevel: readingLevel
      }
    });
    if(error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setState(false);
  };

  return (
    <>
      <Card sx={{ maxWidth: 250, margin:'1rem', position:"relative" }}>
      <CardActions sx={{
        position:"absolute", 
        right: "10px", 
       }}>
        <IconButton 
          onClick={addToReadingList}
          sx={{ 
            backgroundColor:"#4AA088", 
            color: '#FFFFFF',  
            p: 1.5,
            ":hover": {
              backgroundColor: "#28B8B8",
            }
          }} 
          edge='end' 
          aria-label='add to reading list'
          >
          <PlaylistAddRounded />
        </IconButton>
      </CardActions>
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt="book image"
      />
      <CardContent>
        <Typography gutterBottom variant="subtitle1" color="#28B8B8" component="div">
          {title}
        </Typography>
        <Typography variant="subtitle2" color="#F76434">
          by {author}
        </Typography>
      </CardContent>
    </Card>
    <SnackBar openstate={state} title={title} onClick={handleClose}/>
    </>
  );
}

export default BookCard
