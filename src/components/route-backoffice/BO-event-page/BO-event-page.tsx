import React, { useState } from 'react';
import { EventApi } from '../../../api/eventApi';
import { BackofficePageProps, TicketToPurchase } from '../../../types';
import { CommentSection } from '../../comment-components/comment-section/comment-section';
import { Box } from '@mui/material';
import { Loader } from '../../loader/loader';
import { TicketsSection } from '../../ticket-components/tickets-section/tickets-section';
import { EventDetails } from '../../event-components/event-details/event-details';
import {UserBar} from '../../user-bar/user-bar';
import { BOContext } from '../route-backoffice';
import './BO-event-page.scss';

export const BOEventPage: React.FC<BackofficePageProps> = ({navigateToBOCatalogPage}) => {
    const BOcontext = React.useContext(BOContext);

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
            <UserBar onGoBack={navigateToBOCatalogPage}/>
            <Box className="eventSection">
                <Box className="eventDetails">
                    {BOcontext?.backofficeEvent && <EventDetails event={BOcontext?.backofficeEvent!} />}
                    {!BOcontext?.backofficeEvent && isLoading && <Loader/>}
                </Box>
                <Box className="ticketsDetails">
                    <h2 className="subTitel">Categories:</h2>
                    {BOcontext?.backofficeEvent && <TicketsSection tickets={BOcontext?.backofficeEvent!.tickets!} eventId={BOcontext?.backofficeEvent!._id!} setChosenTicket={setChosenTicket} />}
                    {!BOcontext?.backofficeEvent && isLoading && <Loader/>}
                </Box>
            </Box>
        </Box>
    )
};