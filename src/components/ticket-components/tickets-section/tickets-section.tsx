import React from 'react';
import { Box } from '@mui/material';
import { TicketStruct, TicketToPurchase } from '../../../types';
import {Ticket} from '../ticket/ticket';
import './tickets-section.scss';

interface Props {
    tickets: TicketStruct[];
    eventId: string;
    route: "user" | "backoffice";
    setChosenTicket?: (value: TicketToPurchase | null) => void;
}

export const TicketsSection: React.FC<Props> = ({ tickets, eventId, route, setChosenTicket }) => {

    return (
        <Box className="ticketsCollectionContainer">
            {(tickets || []).map((ticket, index) => <Ticket key={index} ticket={ticket} eventId={eventId} route={route} setChosenTicket={setChosenTicket} />)}
        </Box>
    );
};
