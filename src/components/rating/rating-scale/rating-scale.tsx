import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import './rating-scale.scss';

interface RateProps {
    currRate: number | null;
    changeRate: (value: number | null ) => void;
}

export const RatingScale: React.FC<RateProps> = ({currRate, changeRate}) => {

  return (
    <Box className="rating-scale">
      {currRate === 0 && <Typography component="legend" style={{ marginRight: '8px', fontSize: '1.3em' }}>Rate event:</Typography>}
      {currRate !== 0 && <Typography component="legend" style={{ marginRight: '8px', fontSize: '1.3em' }}>Your rating:</Typography>}
      <Rating
        name="simple-controlled"
        value={currRate}
        onChange={(_, newValue) => {
            changeRate(newValue);
        }}
        size="large"
        precision={1.0}
      />
    </Box>
  );
}