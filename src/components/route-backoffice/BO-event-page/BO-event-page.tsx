import React from 'react';
import { BackofficePageProps } from '../../../types';
import { Box } from '@mui/material';
import { Loader } from '../../loader/loader';
import { TicketsSection } from '../../ticket-components/tickets-section/tickets-section';
import { EventDetails } from '../../event-components/event-details/event-details';
import { UserBar } from '../../user-bar/user-bar';
import { BOContext } from '../route-backoffice';
import './BO-event-page.scss';

export const BOEventPage: React.FC<BackofficePageProps> = ({ navigateToBOCatalogPage }) => {
    const BOcontext = React.useContext(BOContext);

return (
    <Box className='eventPageSection'>
        <UserBar onGoBack={navigateToBOCatalogPage} />
        <Box className="eventSection">
            <Box className="eventDetails">
                {BOcontext?.backofficeEvent && <EventDetails event={BOcontext?.backofficeEvent!} />}
                {!BOcontext?.backofficeEvent && <Loader />}
            </Box>
            <Box className="ticketsDetails">
                <h2 className="subTitel">Categories:</h2>
                {BOcontext?.backofficeEvent && <TicketsSection tickets={BOcontext?.backofficeEvent!.tickets!} eventId={BOcontext?.backofficeEvent!._id!} />}
                {!BOcontext?.backofficeEvent && <Loader />}
            </Box>
        </Box>
    </Box>
)
};