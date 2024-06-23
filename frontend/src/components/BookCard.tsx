import  React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import {CardActions, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
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
      <CustomTooltip 
        title="Add to reading list" 
        placement="top"
        arrow
      >
        <IconButton 
            onClick={addToReadingList}
            sx={{ 
              backgroundColor:"#FAAD00",
              buttonFocus: { border: "none"},
              border:"1px solid #FABD33",
              position: "relative",
              left:'240px',
              top:'40px',
              zIndex: '1',
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
            <PlaylistAddRounded />
        </IconButton>
      </CustomTooltip>
      <Card sx={{ maxWidth: 250, maxHeight:300, margin:'1rem', position:"relative" }}>
      <CardActions sx={{
        position:"absolute", 
        right: "10px",
       }}>
      </CardActions>
      <CardMedia
        loading="lazy"
        component="img"
        height="194"
        image={image}
        alt="book image"
      />
      <CardContent sx={{backgroundColor: 'transparent'}}>
        <Typography gutterBottom variant="subtitle3" color="#28B8B8" component="div">
          {title}
        </Typography>
        <Typography variant="subtitle3" color="#F76434">
          by {author}
        </Typography>
      </CardContent>
    </Card>
    <SnackBar openstate={state} title={title} onClick={handleClose}/>
    </>
  );
}

export default BookCard
