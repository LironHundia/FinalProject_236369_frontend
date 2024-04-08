import React, { useState } from 'react';
import { PaymentForm } from '../../payment/pament-form/payment-form';
import { PaymentDetails } from '../../payment/payment-details/payment-details';
import { UserBar } from '../../user-bar/user-bar';
import { UserPageProps } from '../../../types';
import './payment.scss';
import Box from '@mui/material/Box';

export const Payment: React.FC<UserPageProps> = (navigation) => {

    //userSpace
    return (
        <Box>
            <Box className='payment-page'>
                <UserBar />
                <Box className='payment-container'>
                    <PaymentForm />
                    <PaymentDetails />
                </Box>
            </Box>
        </Box>
    )
};
