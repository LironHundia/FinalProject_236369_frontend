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
  setUserPage: (value: 'catalog' | 'eventPage' | 'payment' | 'userSpace') => void;
  userEvent: Event | null;
  setUserEvent: (value: Event | null) => void;
  reservation: TicketToPurchase | null;
  setReservation: (value: TicketToPurchase | null) => void;
}

export const UserContext = React.createContext<UserContext | null>(null)

export const UserRoute: React.FC<PageProps> = ({ navigateToLoginPage }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [userPage, setUserPage] = useState<'catalog' | 'eventPage' | 'payment' | 'userSpace'>('catalog');
  const [reservation, setReservation] = useState<TicketToPurchase | null>(null);
  const [userEvent, setUserEvent] = useState<Event | null>(null);

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

  // Load teams from localStorage or fetch new event
  React.useEffect(() => {
    const storedCurrUserEvent = localStorage.getItem('userEvent');

    if (storedCurrUserEvent != null && userPage !== 'catalog') {
      setUserEvent(JSON.parse(storedCurrUserEvent));
    } else {
      setUserEvent(null);
    }
  }, [userPage]);

  // Save event to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('userEvent', JSON.stringify(userEvent));
  }, [userEvent]);

  if (userPage === 'catalog') {
    return (
      <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation: reservation, setReservation: setReservation }}>
      <Catalog />
      </UserContext.Provider>
    )
  }
  if (userPage === 'eventPage') {
    return (
      <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation: reservation, setReservation: setReservation }}>
        {userEvent !== null && <EventPage/>}
        {userEvent === null && <Typography variant="h2" color="error">{"ERROR: " + errorMessage}</Typography>}
        {isLoading && <h2>Loading event in route-user...</h2>}
      </UserContext.Provider>
    )
  }
  if (userPage === 'payment') {
    return (
      <UserContext.Provider value={{setUserPage, userEvent, setUserEvent, reservation: reservation, setReservation: setReservation }}>
        <Payment />
      </UserContext.Provider>
    )
  }
  //userSpace
  return (
    <UserSpace />
  )
};
