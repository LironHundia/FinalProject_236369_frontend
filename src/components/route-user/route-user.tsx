import React, { useState } from 'react';
import { UserPageProps, Event, TicketToPurchase } from '../../types';
import { Catalog } from '../catalog/catalog';
import { Loader } from '../loader/loader';
import { EventPage } from './event-page/event-page';
import { Payment } from './payment/payment';

interface UserContext {
  setUserPage: (value: 'catalog' | 'eventPage' | 'payment') => void;
  userEvent: Event | null;
  setUserEvent: (value: Event | null) => void;
  reservation: TicketToPurchase | null;
  setReservation: (value: TicketToPurchase | null) => void;
}

export const UserContext = React.createContext<UserContext | null>(null)

export const UserRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /////////////////////////////// Reservation /////////////////////////////////
  const [reservation, setReservation] = useState<TicketToPurchase | null>(() => {
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
  const [userPage, setUserPage] = useState<'catalog' | 'eventPage' | 'payment'>(() => {
    // Get the current page from session storage when the component is mounted
    const savedUserpage = sessionStorage.getItem('currentUserpage');
    return savedUserpage ? JSON.parse(savedUserpage) : 'catalog';
  });

  React.useEffect(() => {
    // Save the current page to session storage whenever it changes
    if (userPage === 'payment') {
      sessionStorage.setItem('currentUserpage', JSON.stringify(userPage));
    }
    else{
      sessionStorage.removeItem('currentUserpage');
    }
  }, [userPage]);
  //////////////////////////// End User Page ////////////////////////////////

  ///////////////////////////// User Event ///////////////////////////////////
  const [userEvent, setUserEvent] = useState<Event | null>(null);

  // Load event from localStorage or fetch new event
  React.useEffect(() => {
    setIsLoading(true);
    const storedCurrUserEvent = localStorage.getItem('userEvent');
    if (storedCurrUserEvent != null) {
      setUserEvent(JSON.parse(storedCurrUserEvent));
    } else {
      setUserEvent(null);
    }
    setIsLoading(false);
  }, [userPage]);

  // Save event to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('userEvent', JSON.stringify(userEvent));
  }, [userEvent]);
  //////////////////////////// End User Event ////////////////////////////////

  /* User Page navigation */
  const userPageProps: UserPageProps = {
    navigateToCatalogPage: () => setUserPage('catalog'),
    navigateToEventPage: () => { setUserPage('eventPage'); window.scrollTo(0, 0); },
    navigateToPaymentPage: () => setUserPage('payment'),
  }

  if (userPage === 'catalog') {
    return (
      <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation }}>
        <Catalog navigateToCatalogPage={userPageProps.navigateToCatalogPage} navigateToEventPage={userPageProps.navigateToEventPage} />
      </UserContext.Provider>
    )
  }
  if (userPage === 'eventPage') {
    return (
      <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation }}>
        {userEvent !== null && <EventPage {...userPageProps} />}
        {userEvent === null && <Loader />}
        {isLoading && <h2>Loading event in route-user...</h2>}
      </UserContext.Provider>
    )
  }
  if (userPage === 'payment') {
    return (
      <UserContext.Provider value={{ setUserPage, userEvent, setUserEvent, reservation, setReservation }}>
        {userEvent !== null && <Payment {...userPageProps} />}
        {userEvent === null && <Loader />}
      </UserContext.Provider>
    )
  }
};
