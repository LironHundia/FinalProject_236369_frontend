import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

interface RateProps {
    currRate: number | null;
    changeRate: (value: number | null ) => void;
}

export const RatingScale: React.FC<RateProps> = ({currRate, changeRate}) => {

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography component="legend">Controlled</Typography>
      <Rating
        name="simple-controlled"
        value={currRate}
        onChange={(event, newValue) => {
            changeRate(newValue);
        }}
        precision={0.5}
      />
    </Box>
  );
}