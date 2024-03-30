import React, { useState } from 'react';
import { AuthApi } from '../../api/authApi';
import { EventApi } from '../../api/eventApi';
import { APIStatus, PageProps, Event, TicketToPurchase } from '../../types';
import { Catalog } from './catalog/catalog';
import { EventPage } from './event-page/event-page';
import { Payment } from './payment/payment';
import { UserSpace } from './user-space/user-space';
import { Typography } from '@mui/material';

interface UserContext {
  reservation: TicketToPurchase | null;
  setReservation: (value: TicketToPurchase | null) => void;
}

export const UserContext = React.createContext<UserContext | null > (null)

export const UserRoute: React.FC<PageProps> = ({ navigateToLoginPage }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [userPage, setUserPage] = useState<'catalog' | 'eventPage' | 'payment' | 'userSpace'>('eventPage');
  const [reservation, setReservation] = useState<TicketToPurchase | null>(null);
  const [tempEvent, setEvent] = useState<Event | null>(null);

  const onLogout = async () => {
    setIsLoading(true);
    const res = await AuthApi.logout();
    setIsLoading(false);
    if (res === APIStatus.Success) {
      navigateToLoginPage();
      return;
    }
    setErrorMessage('Failed to logout, please try again');
  }

  const eventId = "6601f7238776db7c7a23974e";
    // TODO: Temp code - will get this data from catalog page
    React.useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            try {
                const res = await EventApi.getEventById(eventId);
                setEvent(res as Event);
            } catch (e) {
                setErrorMessage('Failed to load event in ROUTE-USER, please try again');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

  if (userPage === 'catalog') {
    return (
      <Catalog />
    )
  }
  if (userPage === 'eventPage') {
    //TODO: delete the tempEvent and the checks of if it's not null :)
    return (
      <UserContext.Provider value={{ reservation: reservation, setReservation: setReservation }}>
        {tempEvent!==null && <EventPage {...tempEvent} />}
        {tempEvent===null && <Typography variant="h2" color="error">{errorMessage}</Typography>}
        {isLoading && <h2>Loading event in route-user...</h2>}
      </UserContext.Provider>
    )
  }
  if (userPage === 'payment') {
    return (
      <UserContext.Provider value={{reservation: reservation, setReservation: setReservation}}>
        <Payment/>
      </UserContext.Provider> 
    )
  }
//userSpace
return (
  <UserSpace />
)
};
