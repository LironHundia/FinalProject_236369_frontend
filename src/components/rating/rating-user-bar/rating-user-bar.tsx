import * as React from 'react';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import './rating-user-bar.scss';

interface RatingUserBarProps {
  value: number;
}

export const RatingUserBar: React.FC<RatingUserBarProps> = ({ value }) => {

  return (
    <Box className="rating-user-bar-part" display="flex" alignItems="center">
      <StarIcon color="action" style={{ color: 'orange',  stroke: 'black', strokeWidth: 0.5 }} />
      <Typography variant="body1" style={{ marginLeft: '8px', fontSize: '1.2em', minWidth: 100 }}>
        {value} events rated
      </Typography>
    </Box>
  );
}