import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserContext } from '../../route-user/route-user';
import './payment-details.scss';

export const PaymentDetails: React.FC = () => {
    const userContext = React.useContext(UserContext);

    return (
        <Box className="payment-summary">
            <Typography className="payment-summary-header" gutterBottom>
                Order Summary:
            </Typography>
            <Box className="payment-summary-container">

                <Typography className="payment-summary-field" gutterBottom>
                    {userContext?.userEvent!.name}
                </Typography>

                <Typography className="payment-summary-field" gutterBottom>
                    {userContext?.reservation!.quantity} x {userContext?.reservation!.type} Seats
                </Typography>

                <Typography className="payment-summary-field" gutterBottom>
                    Total: {userContext?.reservation!.totalPrice} $
                </Typography>

            </Box>
        </Box>
    );
}