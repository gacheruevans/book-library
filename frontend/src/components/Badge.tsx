import * as React from 'react';
import Badge from '@mui/material/Badge';
import LibraryBooks from '@mui/icons-material/LibraryBooks';

interface ReadingListProps {
  count: string;
}

const ReadingListBadge: React.FC<ReadingListProps> = ({count}) => {
  return (
    <Badge 
      badgeContent={count}
      sx={{color: "#335C6E", }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <LibraryBooks  sx={{color: "#335C6E"}} />
    </Badge>
  );
}

export default ReadingListBadge