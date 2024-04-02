import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { TicketStruct, TicketToPurchase } from '../../../types';
import { TicketSelector } from '../ticket-amount-selector/ticket-amount-selector';
import { GeneralContext } from '../../main/main-page';
import './ticket.scss';

export interface TicketProps {
    ticket: TicketStruct;
    eventId: string;
    setChosenTicket?: (value: TicketToPurchase | null) => void;
}

export const Ticket: React.FC<TicketProps> = ({ ticket, eventId, setChosenTicket }) => {
    const generalContext = React.useContext(GeneralContext);

    const [chosenTicketAmount, setChosenTicketAmount] = React.useState<number>(1);
    const { type, price, initial_quantity, available_quantity } = ticket;

    const handleBuyNow = () => {
        if (setChosenTicket) {
            setChosenTicket({ type, total_price: chosenTicketAmount * price, quantity: chosenTicketAmount, eventId });
        }
    }

    return (
        <Box className="ticketDetailsContainer">
            <Box className="header">
                <h3 className="ticketType">{type} Seats</h3>
                <Box className="ticketPrice">Price: {price}$</Box>
                {generalContext?.route === "user" && <Box className="quantity">{available_quantity} tickets left!</Box>}
                {generalContext?.route === "backoffice" && <Box className="quantity_backoffice">{available_quantity}/{initial_quantity}</Box>}
            </Box>
            {generalContext?.route === "user" &&
                <Box className="chooseTickets">
                    <Box className="chooseTicketAmount">
                        <TicketSelector availableAmount={available_quantity} chosenTicketAmount={chosenTicketAmount} setChosenTicketAmount={setChosenTicketAmount} />
                        <Button className="buyNowButton" onClick={handleBuyNow}>Buy Now!</Button>
                    </Box>
                    <Typography className="totalPrice">Total Price: {chosenTicketAmount * price}$</Typography>
                </Box>
            }
        </Box>
    );
};