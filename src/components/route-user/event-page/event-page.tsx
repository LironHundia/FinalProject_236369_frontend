import React, { useState } from 'react';
import { EventApi } from '../../../api/eventApi';
import { UserPageProps, TicketToPurchase } from '../../../types';
import { CommentSection } from '../../comment-components/comment-section/comment-section';
import { UserContext} from '../route-user';
import { Box } from '@mui/material';
import { Loader } from '../../loader/loader';
import { TicketsSection } from '../../ticket-components/tickets-section/tickets-section';
import { EventDetails } from '../../event-components/event-details/event-details';
import {UserBar} from '../../user-bar/user-bar';
import './event-page.scss';

export const EventPage: React.FC<UserPageProps> = ({navigateToCatalogPage}) => {
    const userContext = React.useContext(UserContext);
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [chosenTicket, setChosenTicket] = useState<TicketToPurchase | null>(null);

    React.useEffect(() => {
        if (chosenTicket) {
            const secureTickets = async () => {
                try{
                    const res = await EventApi.secureTickets(chosenTicket);
                    //TODO: set 2 min timer
                }
                catch(e){
                    setErrorMessage('Failed to secure tickets, please try again');
                }
        }
    }
        //need to create purchase request, secure tickets and navigate to payment page
    }, [chosenTicket]);

    return (
        <Box className='eventPageSection'>
            <UserBar onGoBack={navigateToCatalogPage}/>
            <Box className="eventSection">
                <Box className="eventDetails">
                    {userContext?.userEvent && <EventDetails event={userContext?.userEvent!} />}
                    {!userContext?.userEvent && isLoading && <Loader/>}
                </Box>
                <Box className="ticketsDetails">
                    <h2 className="subTitel">Buy Tickets:</h2>
                    {userContext?.userEvent && <TicketsSection tickets={userContext?.userEvent!.tickets!} eventId={userContext?.userEvent!._id!} setChosenTicket={setChosenTicket} />}
                    {!userContext?.userEvent && isLoading && <Loader/>}
                </Box>
                <Box className="commentSection">
                    <h2 className="subTitel">Comments:</h2>
                    <CommentSection eventId={userContext?.userEvent!._id!} />
                </Box>
            </Box>
        </Box>
    )
};