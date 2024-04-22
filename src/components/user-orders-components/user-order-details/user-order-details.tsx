import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Order } from '../../../types';

export const UserOrderDetails: React.FC<Order> = (order) => {

    return (
        <Box className="order-details-container">

            <Typography className="order-details-field" gutterBottom>
                Location: {order.location}
            </Typography>

            <Typography className="order-details-field" gutterBottom>
                Organizer: {order.organizer}
            </Typography>

            <Typography className="order-details-field" gutterBottom>
                Total price paid: {order.totalPrice}$
            </Typography>

            <Typography className="order-details-field" gutterBottom>
                Event Details: {order.description}
            </Typography>

        </Box>
    );
}