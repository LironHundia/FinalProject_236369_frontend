import React, { useState } from 'react';
import { EventApi } from '../../../api/eventApi';
import {UserPageProps, Event } from '../../../types';
import { UserContext } from '../route-user';
import { Button } from '@mui/material';

export const Catalog: React.FC<UserPageProps> = (userPageProps) => {

    const userContext = React.useContext(UserContext);

    const [catalogEvent, setCatalogEvent] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');


    // Rest of the code...
    // TODO: Temp code - will get this data from catalog page
    //////////////////////////////////////////////////////////////////////
    /*const eventId = "6601f7238776db7c7a23974e";
    React.useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await EventApi.getEventById(eventId);
                setCatalogEvent([res]);
            } catch (e) {
                setErrorMessage('Failed to load event in ROUTE-USER, please try again');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);*/
    //////////////////////////////////////////////////////////////////////

    React.useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await EventApi.getAvailableEvents();
                console.log(res);
                //setCatalogEvent();
            } catch (e) {
                console.log(e);
                setErrorMessage('Failed to load event in ROUTE-USER, please try again');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [catalogEvent]);

    const onChooseEvent = async (index: number) => {
        if (catalogEvent.length === 0) {
            setErrorMessage('event not loaded yet in ROUTE-USER, please try again');
            return;
        }
        await userContext?.setUserEvent(catalogEvent[index]);
        userPageProps.navigateToEventPage();
    }

    return (
        <div>
            <h1>User Catalog</h1>
            {isLoading && <p>Loading...</p>}
            <Button onClick={() => onChooseEvent(0)}>Choose Event</Button>
        </div>
    )
};
