import * as React from 'react';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import './event-rating.scss';

interface EventRatingProps {
    rating: number;
    count: number;
}

export const EventRating: React.FC<EventRatingProps> = ({ rating, count }) => {
    const value = rating.toFixed(1);

    if (count === 0) {
        //Rate this event below!
    }

    return (

        <Box className="event-rating-container">
            <Box display="flex" alignItems="center">
                <StarIcon color="action" fontSize="large" style={{ marginBottom: '5px', color: 'orange', stroke: 'black', strokeWidth: 0.5 }} />
                {count > 0 && <Typography variant="body1" style={{ marginLeft: '8px', fontSize: '1.4em' }}>
                    {value}
                </Typography>}
                {count === 0 && <Typography variant="body1" style={{ marginRight: '-5px', marginLeft: '8px',fontStyle: 'italic', fontSize: '1.2em' }}>No rates</Typography>}
            </Box>
            {count > 0 && <Typography variant="body1" style={{ marginLeft: '8px', fontSize: '0.9em' }}>
                By {count} users
            </Typography>}
        </Box>


    );
}