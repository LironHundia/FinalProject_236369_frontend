import React from 'react';
import { useCookies } from 'react-cookie';
import { Box, Typography } from '@mui/material';
import jwt, { JwtPayload } from 'jsonwebtoken';


export const CountdownMsg: React.FC = () => {
    const [timeRemaining, setTimeRemaining] = React.useState(getTimeRemaining());

    const [cookies] = useCookies(['paymentToken']);
    const paymentToken = cookies.paymentToken;

    console.log('Payment token:', paymentToken);

    // Assuming you have the token stored in a variable called 'token'
    const decodedToken = jwt.decode(paymentToken);
    let expirationTime: any;
    if (typeof decodedToken !== 'string') {
        expirationTime = decodedToken?.exp;
    }
    // Now 'expirationTime' contains the timestamp when the token expires

    console.log('Expiration time:', expirationTime);

    // Calculate the time remaining until the token expires
    function getTimeRemaining() {
        const now = new Date();
        const expDate = new Date(expirationTime);
        const diff = expDate.getTime() - now.getTime();
        return Math.max(0, Math.floor(diff / 1000)); // Convert to seconds
    }

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [expirationTime]);

    // Format seconds into MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <Typography variant="h6">Token Expiration Countdown:</Typography>
            <Typography variant="body1">{formatTime(timeRemaining)}</Typography>
        </div>
    );
};
