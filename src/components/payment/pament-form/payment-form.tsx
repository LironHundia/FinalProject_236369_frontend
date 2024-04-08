import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
} from '@mui/material';
import './payment-form.scss';
import { Box } from '@mui/system';

interface FormError {
    cardHolder: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
}

export const PaymentForm: React.FC = () => {
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState<FormError>({
        cardHolder: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    });

    const validateForm = () => {
        const newErrors: FormError = {
            cardHolder: '',
            cardNumber: '',
            expDate: '',
            cvv: ''
        };

        // Validate card holder name (letters only)
        if (!/^[a-zA-Z\s]+$/.test(cardHolder)) {
            newErrors.cardHolder = 'Card holder name must contain letters only';
        }

        // Validate card number (exactly 16 digits)
        if (!/^\d{16}$/.test(cardNumber)) {
            newErrors.cardNumber = 'Card number must be exactly 16 digits';
        }

        // Validate expiration date (format MM/YY and later than today)
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate)) {
            newErrors.expDate = 'Expiration date must be in the format MM/YY, with valid MM';
        }
        else {
            const currentDate = new Date();
            const [month, year] = expDate.split('/');
            const expDateObj = new Date(+`20${year}`, parseInt(month) - 1); // Subtract 1 from month (zero-based)
            if (expDateObj <= currentDate) {
                newErrors.expDate = 'Expiration date must be later than today';
            }
        }

        // Validate CVV (3 digits)
        if (!/^\d{3}$/.test(cvv)) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

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

    return (
        <Box className="payment-form">
            <form className="payment-form-container" onSubmit={handleSubmit}>
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
                <TextField
                    className='payment-form-input'
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
                    className='payment-form-input'
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    fullWidth
                    required
                    inputProps={{ maxLength: 3 }}
                    error={!!errors.cvv}
                    helperText={errors?.cvv}
                />
                <Button className="form-submit-button" type="submit" variant="contained" color="primary">
                    Buy Now!
                </Button>
            </form>
        </Box>
    );
};