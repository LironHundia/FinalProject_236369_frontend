import React, { useState } from 'react';
import { EventApi } from '../../../api/eventApi';
import { BackofficePageProps, Event } from '../../../types';
import { BOContext } from '../route-backoffice';
import { Button } from '@mui/material';

export const BOCatalog: React.FC<BackofficePageProps> = (boPageProps) => {

    const BOcontext = React.useContext(BOContext);

    const [catalogEvent, setCatalogEvent] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');


    // Rest of the code...
    // TODO: Temp code - will get this data from catalog page
    //////////////////////////////////////////////////////////////////////
    const eventId = "6601f7238776db7c7a23974e";
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
    }, [eventId]);
    //////////////////////////////////////////////////////////////////////

    const onChooseEvent = async (index: number) => {
        if (catalogEvent.length === 0) {
            setErrorMessage('event not loaded yet in ROUTE-USER, please try again');
            return;
        }
        await BOcontext?.setBackofficeEvent(catalogEvent[index]);
        boPageProps.navigateToBOEventPage();
    }

    return (
        <div>
            <h1>Backoffice Catalog</h1>
            {isLoading && <p>Loading...</p>}
            <Button onClick={() => onChooseEvent(0)}>Choose Event</Button>
        </div>
    )
};
