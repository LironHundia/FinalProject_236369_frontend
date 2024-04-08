import React, { useState } from 'react';
import { PaymentDetails } from '../../payment/payment-details/payment-details';
import { validatePaymentForm } from '../../../utilities'
import { UserBar } from '../../user-bar/user-bar';
import { UserPageProps, PaymentFormError } from '../../../types';
import { TextField, Button, Typography } from '@mui/material';
import './payment.scss';
import Box from '@mui/material/Box';

export const Payment: React.FC<UserPageProps> = (navigation) => {
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState<PaymentFormError>({
        cardHolder: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    });

    const validateForm = () => {
        const newErrors = validatePaymentForm(cardHolder, cardNumber, expDate, cvv);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (validateForm()) {
            // Save data if validation passes
            console.log('Data saved:', { cardHolder, cardNumber, expDate, cvv });
        }
    };

    //userSpace
    return (
        <Box>
            <Box className='payment-page'>
                <UserBar />
                <form className="payment-form" onSubmit={handleSubmit}>
                    <Box className="payment-form-container">
                        <Typography className="payment-form-header" gutterBottom>
                            Insert Credit Card details:
                        </Typography>
                        <TextField
                            className='payment-form-input'
                            label="Card Holder Name"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            fullWidth
                            required
                            error={!!errors.cardHolder}
                            helperText={errors.cardHolder}
                        />
                        <TextField
                            className='payment-form-input'
                            label="Credit Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 16 }}
                            error={!!errors.cardNumber}
                            helperText={errors?.cardNumber}
                        />
                        <Box className="cvv_exp">
                        <TextField
                            className='payment-form-input-cvv_exp'
                            label="Expiration Date (MM/YY)"
                            value={expDate}
                            onChange={(e) => setExpDate(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 5 }}
                            error={!!errors.expDate}
                            helperText={errors?.expDate}
                        />
                        <TextField
                            className='payment-form-input-cvv_exp'
                            label="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 3 }}
                            error={!!errors.cvv}
                            helperText={errors?.cvv}
                        />
                        </Box>
                    </Box>
                    <Box className="payment-details">
                        <Typography className="payment-summary-header" gutterBottom>
                            Order Summary:
                        </Typography>
                        <Box className="payment-summary-container">
                            <PaymentDetails />
                            <Button className="form-submit-button" type="submit" variant="contained" color="primary">
                                Buy Now!
                            </Button>
                        </Box>
                    </Box>
                </form>

            </Box>
        </Box>
    )
};
