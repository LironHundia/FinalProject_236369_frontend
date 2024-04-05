import React, { useState } from 'react';
import './main-page.css';
import { AuthApi } from '../../api/authApi';
import { APIStatus, PageProps } from '../../types';
import { useEffect } from 'react';
import { UserRoute } from '../route-user/route-user';
import { BackofficeRoute } from '../route-backoffice/route-backoffice';

interface GeneralContext {
  route: 'user' | 'backoffice';
  setRoute: (route: 'user' | 'backoffice') => void;
  username: string;
  setUsername: (username: string) => void;
  userPermission: 'A' | 'M' | 'W';
  onLogout: () => void;
}

export const GeneralContext = React.createContext<GeneralContext | null>(null);

export const MainPage: React.FC<PageProps> = (pageProps) => {
  const [username, setUsername] = useState<string>('');
  const [userPermission, setUserPermission] = useState<'A'|'M'|'W'>('W');

  //const [currentRoute, setCurrentRoute] = useState<'user' | 'backoffice'>('user');
  const [currentRoute, setCurrentRoute] = useState<'user' | 'backoffice'>(() => {
    // Get the current page from session storage when the component is mounted
    const savedRoute = sessionStorage.getItem('currentRoute');
    return savedRoute ? JSON.parse(savedRoute) : 'user';
  });
  
  useEffect(() => {
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
    const fetchUserPermission = async () => {
      try {
        const permission = await AuthApi.getUserPermission();
        setUserPermission(permission as 'A' | 'M' | 'W');
      }
      catch (e) {
        pageProps.navigateToLoginPage();}
    };

    fetchUserPermission();
  }, [currentRoute]);


  const onLogout = async () => {
    const res = await AuthApi.logout();
    if (res === APIStatus.Success) {
      pageProps.navigateToLoginPage();
      return;
    }
  }

  if (currentRoute === 'user') {
    return (
      <GeneralContext.Provider value={{ route: currentRoute, setRoute: setCurrentRoute, username, setUsername, userPermission, onLogout }}>
        <UserRoute/>
      </GeneralContext.Provider>
    )
  }

  return (
    <GeneralContext.Provider value={{ route: currentRoute, setRoute: setCurrentRoute, username, setUsername, userPermission, onLogout }}>
      <BackofficeRoute/>
    </GeneralContext.Provider>
  )
};
