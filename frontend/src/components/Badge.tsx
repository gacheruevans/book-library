import * as React from 'react';
import Badge from '@mui/material/Badge';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

interface ReadingListProps {
  count: number | string;
}

const ReadingListBadge: React.FC<ReadingListProps> = ({ count }) => {
  return (
    <Badge
      badgeContent={count}
      color="secondary"
      sx={{
        mr: 1,
        '& .MuiBadge-badge': {
          backgroundColor: '#F76434',
          color: '#ffffff',
          fontWeight: 700,
        },
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <LibraryBooksIcon sx={{ color: '#335C6E' }} />
    </Badge>
  );
};

export default ReadingListBadge;