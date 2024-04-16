import React, { useState } from 'react';
import './main-page.css';
import { AuthApi } from '../../api/authApi';
import { APIStatus, PageProps } from '../../types';
import { useEffect } from 'react';
import { UserRoute } from '../route-user/route-user';
import { BackofficeRoute } from '../route-backoffice/route-backoffice';
import { UserSpace } from '../user-space/user-space';

interface GeneralContext {
  route: 'user' | 'backoffice';
  setRoute: (route: 'user' | 'backoffice') => void;
  username: string;
  setUsername: (username: string) => void;
  userPermission: 'A' | 'M' | 'W';
  onLogout: () => void;
  changeUserSpace: () => void;
}

export const GeneralContext = React.createContext<GeneralContext | null>(null);

export const MainPage: React.FC<PageProps> = (pageProps) => {
  const [username, setUsername] = useState<string>('');
  const [userPermission, setUserPermission] = useState<'A'|'M'|'W'>('W');
  const [inUserSpace, setInUserSpace] = useState<boolean>(false);

  const changeUserSpace = () => {
    setInUserSpace(!inUserSpace);
  }

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
      sessionStorage.clear();
      return;
    }
  }

    return (
      <GeneralContext.Provider value={{ route: currentRoute, setRoute: setCurrentRoute, username, setUsername, userPermission, onLogout, changeUserSpace}}>
      {inUserSpace === false && currentRoute === "user" && <UserRoute/>}
      {inUserSpace === false && currentRoute === "backoffice" && <BackofficeRoute/>}
      {inUserSpace === true && <UserSpace/>}
  </GeneralContext.Provider>
  )
};
