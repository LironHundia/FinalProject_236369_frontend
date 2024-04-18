import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Event } from '../../../types';
import { UpdateEventTime } from '../date-event-form/date-event-form';
import { EventApi } from '../../../api/eventApi';
import defaultEventImage from '../../../additionals/image-not-found.jpg';
import { dateToString, timeToString, timeToLocalString } from '../../../utilities';
import { GeneralContext } from '../../main/main-page';
import { UserContext } from '../../route-user/route-user';
import { Loader } from '../../loader/loader';
import { RatingScale } from '../../rating/rating-scale/rating-scale';
import { EventRating } from '../../rating/event-rating/event-rating';
import './event-details.scss';

export interface EventProps {
    event: Event;
}

export const EventDetails: React.FC<EventProps> = ({ event }) => {
    const generalContext = React.useContext(GeneralContext);
    const userContext = React.useContext(UserContext);

    const [commentCount, setCommentCount] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [updateEvent, setUpdateEvent] = React.useState<boolean>(false);

    const [eventRate, setEventRate] = React.useState<number>(0);
    const [eventRateCount, setEventRateCount] = React.useState<number>(0);
    const [userRateForEvent, setUserRateForEvent] = React.useState<number>(0);

    React.useEffect(() => {
        const fetchRatingData = async () => {
            if (!generalContext?.username) {
                return;
            }
            try {
                const result = await EventApi.getEventRating(userContext?.userEvent!._id!);
                setEventRate(result.avg);
                setEventRateCount(result.total);

            } catch (e) {
                setErrorMessage('Failed to load event rating, please try again');
            }

            try {
                const rate = await EventApi.getUserRatingForEvent(userContext?.userEvent!._id!, generalContext?.username!);
                setUserRateForEvent(rate);

            } catch (e) {
                setErrorMessage('Failed to load user rating for event, please try again');
            }
        }

        fetchRatingData();

    }, [generalContext?.username]);

    const changeRating = async (newRate: number | null) => {
        if (newRate === null) {
            console.log("rate is null");
            return;
        }
        await EventApi.rateEvent(userContext?.userEvent!._id!, newRate);
        if (userRateForEvent === 0) {
            setEventRateCount(eventRateCount + 1);
            setEventRate(((eventRate * eventRateCount) + newRate) / (eventRateCount + 1));
            setUserRateForEvent(newRate);
        }
        else {
            setEventRate(((eventRate * eventRateCount) -userRateForEvent  + newRate) / (eventRateCount));
            setUserRateForEvent(newRate);
        }
    }

    const { _id, name, category, description, location, totalAvailableTickets, startDate, endDate, imageUrl, lowestPrice } = event;

    const image = imageUrl ? imageUrl : defaultEventImage;
    const eventLocation = location ? location : "not specified";

    const timeNow = new Date();

    const showStartDate = new Date(startDate);
    const formattedStartDate = dateToString(showStartDate);
    const formattedStartTime = timeToLocalString(showStartDate);

    const showEndDate = new Date(endDate);
    const formattedEndDate = dateToString(showEndDate);
    const formattedEndTime = timeToLocalString(showEndDate);

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
        if (generalContext?.route! === "backoffice") {
            fetchEvent();
        }
    }, [event]);

    //{generalContext?.route! === "user" && <RatingScale currRate={eventRate} currUserRate={userRateForEvent} changeRate={changeRating} />}

    return (
        <Box className="eventContainer">
            <Box className="eventDetailsContainer">
                <Box className="eventHeader">
                    <Box className="eventName-rating">
                        <Typography className="eventTitle">{name}</Typography>
                        {generalContext?.route! === "user" && <EventRating rating={eventRate} count={eventRateCount} />}
                    </Box>
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
                        <Typography className="eventInfo_price">From {lowestPrice}$</Typography>
                        <Typography className="eventInfo_quantity">{totalAvailableTickets} tickets left!</Typography>
                    </Box>

                    {generalContext?.route! === "backoffice" && !isLoading && !errorMessage &&
                        <Typography className="eventInfo_comments">Comments: {commentCount}</Typography>}
                    {generalContext?.route! === "backoffice" && isLoading && <Loader />}
                </Box>
            </Box>
            <Box className="rating-scale-section">
                {generalContext?.route! === "user" && <RatingScale currRate={userRateForEvent} changeRate={changeRating} />}
            </Box>
            <Box>
                <Typography className="eventDescription">{description}</Typography>
            </Box>
            {generalContext?.route! === "backoffice" &&
                <Button variant="contained" color="primary"
                    disabled={showStartDate < timeNow || showEndDate < timeNow}
                    onClick={() => setUpdateEvent(!updateEvent)}> Update Event</Button>}
            {updateEvent && <UpdateEventTime startDate={showStartDate} endDate={showEndDate} />}
        </Box>
    );
};