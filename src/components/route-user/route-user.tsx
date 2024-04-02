import React, { useState } from 'react';
import { UserPageProps, Event, TicketToPurchase } from '../../types';
import { Catalog } from './catalog/catalog';
import { Loader } from '../loader/loader';
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
  nextEvent: Event | null;
}

export const UserContext = React.createContext<UserContext | null>(null)

export const UserRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [userPage, setUserPage] = useState<'catalog' | 'eventPage' | 'payment' | 'userSpace'>('catalog');
  const [reservation, setReservation] = useState<TicketToPurchase | null>(null);
  const [userEvent, setUserEvent] = useState<Event | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  const userPageProps: UserPageProps = {
    navigateToCatalogPage: () => setUserPage('catalog'),
    navigateToEventPage: () => setUserPage('eventPage'),
    navigateToPaymentPage: () => setUserPage('payment'),
    navigateToUserSpace: () => setUserPage('userSpace'),
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
      <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation, nextEvent }}>
      <Catalog {...userPageProps}/>
      </UserContext.Provider>
    )
  }
  if (userPage === 'eventPage') {
    return (
      <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation, nextEvent}}>
        {userEvent !== null && <EventPage {...userPageProps}/>}
        {userEvent === null && <Loader/>}
        {isLoading && <h2>Loading event in route-user...</h2>}
      </UserContext.Provider>
    )
  }
  if (userPage === 'payment') {
    return (
      <UserContext.Provider value={{setUserPage, userEvent, setUserEvent, reservation, setReservation, nextEvent }}>
        <Payment />
      </UserContext.Provider>
    )
  }
  //userSpace
  return (
    <UserSpace />
  )
};
