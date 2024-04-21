import React, { useState } from 'react';
import { EventApi } from '../../../api/eventApi';
import { UserPageProps, TicketToPurchase, APIStatus } from '../../../types';
import { CommentSection } from '../../comment-components/comment-section/comment-section';
import { UserContext } from '../route-user';
import { Box } from '@mui/material';
import { ErrorMessage } from '../../error/error';
import { Loader } from '../../loader/loader';
import { TicketsSection } from '../../ticket-components/tickets-section/tickets-section';
import { EventDetails } from '../../event-components/event-details/event-details';
import { UserBar } from '../../user-bar/user-bar';
import { InvalidActionMsg } from '../../invalid-action-msg/invalid-action-msg';
import './event-page.scss';

export const EventPage: React.FC<UserPageProps> = (navigation) => {
    const userContext = React.useContext(UserContext);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [chosenTicket, setChosenTicket] = useState<TicketToPurchase | null>(null);
    const [invalidActionMsg, setInvalidActionMsg] = useState<string | null>(null);

    React.useEffect(() => {
        const secureTickets = async () => {
            try {
                await EventApi.secureTickets(chosenTicket!);
                //TODO: set 2 min timer
                await userContext?.setReservation(chosenTicket);
                navigation.navigateToPaymentPage();
            }
            catch (e) {
                const error = await e;
                if(error as APIStatus === APIStatus.BadRequest) {
                    setErrorMessage('Bad order: Not enough tickets available in this category');
                    setInvalidActionMsg('Bad order: Not enough tickets available in this category. Please choose a different ticket category or try again later');
                }
                setErrorMessage('Failed to secure tickets, please try again');

            }
        }
        //need to create purchase request, secure tickets and navigate to payment page
        if (chosenTicket) {
            secureTickets();
        }
    }, [chosenTicket]);

    return (
        <Box className='eventPageSection'>
            {invalidActionMsg && <InvalidActionMsg msg={invalidActionMsg} goToCatalog={navigation.navigateToCatalogPage} />}
            <UserBar onGoBack={navigation.navigateToCatalogPage} />
            <Box className="eventSection">
                <Box className="eventDetails">
                    {userContext?.userEvent && <EventDetails event={userContext?.userEvent!} />}
                    {!userContext?.userEvent && <Loader />}
                </Box>
                <Box className="ticketsDetails">
                    <h2 className="subTitel">Buy Tickets:</h2>
                    {errorMessage && <ErrorMessage message={errorMessage} />}
                    {userContext?.userEvent && <TicketsSection tickets={userContext?.userEvent!.tickets!} eventId={userContext?.userEvent!._id!} setChosenTicket={setChosenTicket} />}
                    {!userContext?.userEvent && <Loader />}
                </Box>
                <Box className="commentSection">
                    <h2 className="subTitel">Comments:</h2>
                    <CommentSection eventId={userContext?.userEvent!._id!} />
                </Box>
            </Box>
        </Box>
    )
};