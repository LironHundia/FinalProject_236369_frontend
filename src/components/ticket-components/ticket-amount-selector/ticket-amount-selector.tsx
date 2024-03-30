import React from 'react';
import { Box, Button } from '@mui/material';
import './ticket-amount-selector.scss';

export interface TicketSelectorProps {
    availableAmount: number;
    chosenTicketAmount: number;
    setChosenTicketAmount: (value: number) => void;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({ availableAmount, chosenTicketAmount, setChosenTicketAmount }) => {

    const incrementTickets = () => {
        if (chosenTicketAmount < availableAmount) {
            setChosenTicketAmount(chosenTicketAmount + 1);
        }
    };

    const decrementTickets = () => {
        if (chosenTicketAmount > 1) {
            setChosenTicketAmount(chosenTicketAmount - 1);
        }
    };

    return (
        <Box className="chooseTicketAmountContainer">
            <Box className="chooseTicketAmountButtons">
                <Button className="amount-button" onClick={incrementTickets} disabled={chosenTicketAmount === availableAmount}>+</Button>
                <Button className="amount-button" onClick={decrementTickets} disabled={chosenTicketAmount === 1}>-</Button>
            </Box>
            <Box className="chosenAmount">{chosenTicketAmount}</Box>
        </Box>
    );
};