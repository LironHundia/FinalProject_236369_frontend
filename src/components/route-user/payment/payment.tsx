import React, { useState } from 'react';
import { EventApi } from '../../../api/eventApi';
import { PaymentDetails } from '../../payment/payment-details/payment-details';
import { SuccessPage } from './success-page/success-page';
import { UserPageProps, PaymentFormError, PaymentReq, APIStatus } from '../../../types';
import { TextField, Button, Typography } from '@mui/material';
import { validatePaymentForm } from '../../../utilities'
import { UserBar } from '../../user-bar/user-bar';
import { ErrorMessage } from '../../error/error';
import { UserContext } from '../route-user';
import Box from '@mui/material/Box';
import './payment.scss';

export const Payment: React.FC<UserPageProps> = (navigation) => {
    const userContext = React.useContext(UserContext);

    const [orderId, setOrderId] = useState<string>(''); // OrderId from the payment api call [TODO: get from response]
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [backToCatalogButton, setBackToCatalogButton] = useState<boolean>(false); // Show back to catalog button after payment [TODO: get from response
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentError, setPaymentError] = useState<string>(''); // Error message for the payment apicall
    const [errors, setErrors] = useState<PaymentFormError>({
        cardHolder: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    });

    const validateForm = () => {
        const newErrors = validatePaymentForm(cardHolder, cardNumber, expDate, cvv);
        setErrors(newErrors);
        return Object.values(newErrors).every(value => value === ''); // Return true if no errors
    };

    const purchaseTickets = async (paymentReq: PaymentReq) => {
        setIsLoading(true);
        try {
            const res = await EventApi.purchaseTickets(paymentReq);
            setOrderId(res);
        }
        catch (e) {
            const error = await e;
            if (error === APIStatus.BadRequest) {
                setPaymentError('This error shouldn\'t happen. Check eventServer');
            }
            else if (error === APIStatus.Unauthorized) {
                setPaymentError('Tickets reservasion expired! please go back to Catalog and try again');
                setBackToCatalogButton(true);
            }
            else {
                setPaymentError('Payment failed due to server error. please try again');
            }

        }
        finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("made req")

        if (validateForm()) {
            // Save data if validation passes
            const paymentReq: PaymentReq = {
                eventId: userContext?.userEvent?._id!,
                ticketType: userContext?.reservation?.ticketType!,
                quantity: userContext?.reservation?.quantity!,
                cc: cardNumber,
                holder: cardHolder,
                cvv: cvv,
                exp: expDate,
                charge: userContext?.reservation?.totalPrice!
            };

            purchaseTickets(paymentReq);
        }
    };

    //userSpace
    return (
        <Box className='payment-page'>
            <UserBar />
            {orderId && <SuccessPage navigateToCatalogPage={navigation.navigateToCatalogPage} orderId={orderId} />}
            {!orderId &&
                <form className="payment-form" onSubmit={handleSubmit}>
                    <Box className="left-col">
                        <Box className="payment-form-container">
                            <Typography className="payment-form-header" gutterBottom>
                                Insert Credit Card details:
                            </Typography>
                            <TextField
                                className='payment-form-input'
                                label="Card Holder Name"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                disabled={backToCatalogButton}
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
                                disabled={backToCatalogButton}
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
                                    disabled={backToCatalogButton}
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
                                    disabled={backToCatalogButton}
                                    fullWidth
                                    required
                                    inputProps={{ maxLength: 3 }}
                                    error={!!errors.cvv}
                                    helperText={errors?.cvv}
                                />
                            </Box>
                        </Box>
                        <Box className="payment-processing-msg">
                            {isLoading && <Typography>Processing your payment...</Typography>}
                        </Box>
                        <Box className="error-message">
                            {paymentError && <ErrorMessage message={paymentError} />}
                        </Box>
                        <Box className="back-to-catalog">
                            {backToCatalogButton && <Button variant="contained" onClick={navigation.navigateToCatalogPage}>Back to Catalog</Button>}
                        </Box>
                    </Box>
                    <Box className="payment-details">
                        <Typography className="payment-summary-header" gutterBottom>
                            Order Summary:
                        </Typography>
                        <Box className="payment-summary-container">
                            <PaymentDetails />
                            <Button className="form-submit-button" type="submit" disabled={backToCatalogButton} variant="contained" color="primary">
                                Buy Now!
                            </Button>
                        </Box>
                    </Box>
                </form>
            }
        </Box>
    )
};
