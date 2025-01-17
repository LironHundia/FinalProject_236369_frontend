import React from 'react';
import { PaymentDetails } from '../../../payment/payment-details/payment-details';
import { Typography, Box } from '@mui/material';
import './success-page.scss';

interface SuccessPageProps {
    navigateToCatalogPage: () => void;
    orderId: string;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ navigateToCatalogPage, orderId }) => {

    return (
        <Box className="SuccessMsgContainer">
            <Typography variant="h4">Congratulations! Enjoy!</Typography>
            <br />
            <Typography color="red" variant="h5">Order-Id:</Typography>
            <Typography color="red" variant="h5">{orderId}</Typography>
            <br />
            <PaymentDetails />
            <button className="BackToCatalog" onClick={navigateToCatalogPage}>Back to Events Catalog</button>
        </Box>
    );
}