import React, { useState } from 'react';
import { UserPageProps, Event, TicketToPurchase, NextEvent } from '../../types';
import { Catalog } from '../catalog/catalog';
import { Loader } from '../loader/loader';
import { EventPage } from './event-page/event-page';
import { Payment } from './payment/payment';
import { UserSpace } from './user-space/user-space';

interface UserContext {
  setUserPage: (value: 'catalog' | 'eventPage' | 'payment' | 'userSpace') => void;
  userEvent: Event | null;
  setUserEvent: (value: Event | null) => void;
  reservation: TicketToPurchase | null;
  setReservation: (value: TicketToPurchase | null) => void;
  nextEvent: NextEvent | null;
  setNextEvent: (event: NextEvent | null) => void;
}

export const UserContext = React.createContext<UserContext | null>(null)

export const UserRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  /////////////////////////////// Reservation /////////////////////////////////
  const [reservation, setReservation] = useState<TicketToPurchase | null>(()=> {
    // Get the current page from session storage when the component is mounted
    const savedReservation = sessionStorage.getItem('currentReservation');
    return savedReservation ? JSON.parse(savedReservation) : null;
  });

  React.useEffect(() => {
    // Save the current page to session storage whenever it changes
    sessionStorage.setItem('currentReservation', JSON.stringify(reservation));
  }, [reservation]);
  //////////////////////////// End Reservation ////////////////////////////////

  /////////////////////////////// User Page ///////////////////////////////////
  const [userPage, setUserPage] = useState<'catalog' | 'eventPage' | 'payment' | 'userSpace'>(() => {
    // Get the current page from session storage when the component is mounted
    const savedUserpage = sessionStorage.getItem('currentUserpage');
    return savedUserpage ? JSON.parse(savedUserpage) : 'catalog';
  });

  React.useEffect(() => {
    // Save the current page to session storage whenever it changes
    sessionStorage.setItem('currentUserpage', JSON.stringify(userPage));
  }, [userPage]);
  //////////////////////////// End User Page ////////////////////////////////

  ///////////////////////////// User Event ///////////////////////////////////
  const [userEvent, setUserEvent] = useState<Event | null>(null);

  // Load event from localStorage or fetch new event
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
  //////////////////////////// End User Event ////////////////////////////////

  ////////////////////////////// Next Event //////////////////////////////////
  const [nextEvent, setNextEvent] = useState<NextEvent | null>(() => {
    // Get the current nextEvent from session storage when the component is mounted
    const savedNextEvent = sessionStorage.getItem('currentNextEvent');
    return savedNextEvent ? JSON.parse(savedNextEvent) : null;
  });
  
  React.useEffect(() => {
    // Save the current nextEvent to session storage whenever it changes
    sessionStorage.setItem('currentNextEvent', JSON.stringify(nextEvent));
  }, [nextEvent]);
//////////////////////////// End Next Event ////////////////////////////////


/* User Page navigation */
const userPageProps: UserPageProps = {
  navigateToCatalogPage: () => setUserPage('catalog'),
  navigateToEventPage: () => { setUserPage('eventPage'); window.scrollTo(0, 0); },
  navigateToPaymentPage: () => setUserPage('payment'),
  navigateToUserSpace: () => setUserPage('userSpace'),
}


if (userPage === 'catalog') {
  return (
    <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation, nextEvent, setNextEvent }}>
      <Catalog navigateToCatalogPage={userPageProps.navigateToCatalogPage} navigateToEventPage={userPageProps.navigateToEventPage} />
    </UserContext.Provider>
  )
}
if (userPage === 'eventPage') {
  return (
    <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation, nextEvent, setNextEvent }}>
      {userEvent !== null && <EventPage {...userPageProps} />}
      {userEvent === null && <Loader />}
      {isLoading && <h2>Loading event in route-user...</h2>}
    </UserContext.Provider>
  )
}
if (userPage === 'payment') {
  return (
    <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation, nextEvent, setNextEvent }}>
      {userEvent !== null && <Payment {...userPageProps} />}
      {userEvent === null && <Loader />}
    </UserContext.Provider>
  )
}
//userSpace
return (
  <UserSpace />
)
};
