import React from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { Event } from '../../../types';
import { UpdateEventTime } from '../date-event-form/date-event-form';
import { EventApi } from '../../../api/eventApi';
import { defaultEventImage } from '../../../consts';
import { dateToString, timeToString } from '../../../utilities';
import { Loader } from '../../loader/loader';
import './event-details.scss';

export interface EventProps {
    event: Event;
    route: "user" | "backoffice";
}

export const EventDetails: React.FC<EventProps> = ({ event, route }) => {
    const [commentCount, setCommentCount] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [updateEvent, setUpdateEvent] = React.useState<boolean>(false);

    const { _id, name, category, description, organizer, location, total_available_tickets, start_date, end_date, image_url } = event;

    const image = image_url ? image_url : defaultEventImage;
    const eventLocation = location ? location : "not specified";

    const timeNow = new Date();

    const startDate = new Date(start_date);
    const formattedStartDate = dateToString(startDate);
    const formattedStartTime = timeToString(startDate);

    const endDate = new Date(end_date);
    const formattedEndDate = dateToString(endDate);
    const formattedEndTime = timeToString(endDate);

    React.useEffect(() => {
        const fetchEvent = async () => {
            try {
                const count = await EventApi.getEventCommentsCount(_id);
                setCommentCount(count);
            } catch (e) {
                setErrorMessage('Failed to load event comments, please try again');
            } finally {
                setIsLoading(false);
            }
        }
        if (route === "backoffice") {
            fetchEvent();
        }
    }, [event]);

    return (
        <Box className="eventContainer">
            <Box className="eventDetailsContainer">
                <Box className="eventHeader">
                    <Typography className="eventTitle">{name}</Typography>
                    <img className="eventImage" src={image} alt="event" />
                </Box>
                <Box className="eventBody">
                    <Box className="eventTime_place">
                        <Typography className="eventInfo bold">{category}</Typography>
                        <Typography className="eventInfo">from: {formattedStartDate} at {formattedStartTime}</Typography>
                        <Typography className="eventInfo">To:   {formattedEndDate} at {formattedEndTime}</Typography>
                        <Typography className="eventInfo">Location: {eventLocation}</Typography>
                    </Box>
                    <Box className="eventTickets">
                        <Typography className="eventInfo_price">From *TODO* $</Typography>
                        <Typography className="eventInfo_quantity">{total_available_tickets} tickets left!</Typography>
                    </Box>

                    {route === "backoffice" && !isLoading && !errorMessage &&
                        <Typography className="eventInfo_comments">Comments: {commentCount}</Typography>}
                    {route === "backoffice" && isLoading && <Loader />}
                </Box>
            </Box>
            <Box>
                <Typography className="eventDescription">{description}</Typography>
            </Box>
            {route === "backoffice" &&
                <Button variant="contained" color="primary"
                    disabled={startDate < timeNow || endDate < timeNow}
                    onClick={() => setUpdateEvent(!updateEvent)}> Update Event</Button>}
            {updateEvent && <UpdateEventTime startDate={startDate} endDate={endDate} />}
        </Box>
    );
};