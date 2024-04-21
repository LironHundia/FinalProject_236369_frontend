import React, { useState } from 'react';
import './main-page.css';
import { AuthApi } from '../../api/authApi';
import { EventApi } from '../../api/eventApi';
import { APIStatus, PageProps } from '../../types';
import { useEffect } from 'react';
import { UserRoute } from '../route-user/route-user';
import { BackofficeRoute } from '../route-backoffice/route-backoffice';
import { UserSpace } from '../user-space/user-space';
import { NextEvent } from '../../types';
import { INVALID_VALUE } from '../../consts';

interface GeneralContext {
  route: 'user' | 'backoffice';
  setRoute: (route: 'user' | 'backoffice') => void;
  username: string;
  setUsername: (username: string) => void;
  userPermission: 'A' | 'M' | 'W' | null;
  setUserPermission: (permission: 'A' | 'M' | 'W' | null) => void;
  onLogout: () => void;
  changeUserSpace: () => void;
  eventsRated: number;
  setEventsRated: (eventsRated: number) => void;
  nextEvent: NextEvent | null;
  setNextEvent: (event: NextEvent | null) => void;
}

export const GeneralContext = React.createContext<GeneralContext | null>(null);

export const MainPage: React.FC<PageProps> = (pageProps) => {
  const [username, setUsername] = useState<string>('');
  const [userPermission, setUserPermission] = useState<'A' | 'M' | 'W'| null>(null);
  const [inUserSpace, setInUserSpace] = useState<boolean>(false);

  const [eventsRated, setEventsRated] = useState<number>(() => {
    // Get the current page from session storage when the component is mounted
    const savedEventsRated = sessionStorage.getItem('currentEventsRated');
    return savedEventsRated ? JSON.parse(savedEventsRated) : INVALID_VALUE;
  });

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

  //const [currentRoute, setCurrentRoute] = useState<'user' | 'backoffice'>('user');
  const [currentRoute, setCurrentRoute] = useState<'user' | 'backoffice'>(() => {
    // Get the current page from session storage when the component is mounted
    const savedRoute = sessionStorage.getItem('currentRoute');
    return savedRoute ? JSON.parse(savedRoute) : 'user';
  });

  const changeUserSpace = () => {
    setInUserSpace(!inUserSpace);
  }

  React.useEffect(() => {
    // Save the current page to session storage whenever it changes
    sessionStorage.setItem('currentRoute', JSON.stringify(currentRoute));
  }, [currentRoute]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await AuthApi.getUserName();
        setUsername(res as string);

      } catch (error) {
        pageProps.navigateToLoginPage();
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        if (username && eventsRated === INVALID_VALUE) {
          const res = await EventApi.getUserRating(username);
          setEventsRated(res as number);
          sessionStorage.setItem('currentEventsRated', JSON.stringify(res));
        }
      } catch (error) {
        setEventsRated(INVALID_VALUE);
      }
    };

    fetchUserRating();
  }, [username]);

  useEffect(() => {
    const fetchUserPermission = async () => {
      try {
        const permission = await AuthApi.getUserPermission();
        setUserPermission(permission as 'A' | 'M' | 'W');
      }
      catch (e) {
        pageProps.navigateToLoginPage();
      }
    };

    fetchUserPermission();
  }, [currentRoute]);


  const onLogout = async () => {
    const res = await AuthApi.logout();
    if (res === APIStatus.Success) {
      pageProps.navigateToLoginPage();
      sessionStorage.clear();
      return;
    }
  }

  return (
    <GeneralContext.Provider value={{
      route: currentRoute, setRoute: setCurrentRoute,
      username, setUsername, userPermission, setUserPermission, onLogout,
      changeUserSpace, eventsRated, setEventsRated: setEventsRated, nextEvent, setNextEvent
    }}>
      {inUserSpace === false && currentRoute === "user" && <UserRoute />}
      {inUserSpace === false && currentRoute === "backoffice" && <BackofficeRoute />}
      {inUserSpace === true && <UserSpace />}
    </GeneralContext.Provider>
  )
};
