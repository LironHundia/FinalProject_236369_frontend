import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserContext } from '../../route-user/route-user';
import './payment-details.scss';

export const PaymentDetails: React.FC = () => {
    const userContext = React.useContext(UserContext);

    return (
        <Box className="payment-details-container">

            <Typography className="payment-details-field" gutterBottom>
                {userContext?.userEvent!.name}
            </Typography>

            <Typography className="payment-details-field" gutterBottom>
                {userContext?.reservation!.quantity} x {userContext?.reservation!.type} Seats
            </Typography>

            <Typography className="payment-details-field" gutterBottom>
                Total: {userContext?.reservation!.totalPrice}$
            </Typography>

        </Box>
    );
}