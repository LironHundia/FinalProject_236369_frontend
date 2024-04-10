import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { TicketStruct, TicketToPurchase } from '../../../types';
import { TicketSelector } from '../ticket-amount-selector/ticket-amount-selector';
import { GeneralContext } from '../../main/main-page';
import SoldOutImg from '../../../additionals/SoldOut_red.png';
import './ticket.scss';

export interface TicketProps {
    ticket: TicketStruct;
    eventId: string;
    setChosenTicket?: (value: TicketToPurchase | null) => void;
}

export const Ticket: React.FC<TicketProps> = ({ ticket, eventId, setChosenTicket }) => {
    const generalContext = React.useContext(GeneralContext);

    const [chosenTicketAmount, setChosenTicketAmount] = React.useState<number>(1);
    const { type, price, initialQuantity, availableQuantity } = ticket;

    const handleBuyNow = async () => {
        if (setChosenTicket) {
            await setChosenTicket({ ticketType: type, totalPrice: chosenTicketAmount * price, quantity: chosenTicketAmount, eventId });
        }
    }

    return (
        <Box className="ticketDetailsContainer">
            <Box className="header">
                <h3 className="ticketType_eventPate">{type} Seats</h3>
                <Box className="ticketPrice">Price: {price}$</Box>
                {generalContext?.route === "user" && <Box className="quantity">{availableQuantity} tickets left!</Box>}
                {generalContext?.route === "backoffice" && <Box className="quantity_backoffice">{availableQuantity}/{initialQuantity}</Box>}
            </Box>
            {generalContext?.route === "user" &&
                <Box className="chooseTickets">
                    <Box className="chooseTicketAmount">
                        <TicketSelector availableAmount={availableQuantity} chosenTicketAmount={chosenTicketAmount} setChosenTicketAmount={setChosenTicketAmount} />
                        <Button className="buyNowButton" onClick={handleBuyNow} disabled={availableQuantity===0}>Buy Now!</Button>
                    </Box>
                    {availableQuantity === 0 && <img className="soldOutImg" src={SoldOutImg} alt="Sold Out" />}
                    {availableQuantity > 0 && <Typography className="totalPrice">Total Price: {chosenTicketAmount * price}$</Typography>}
                </Box>
            }
        </Box>
    );
};