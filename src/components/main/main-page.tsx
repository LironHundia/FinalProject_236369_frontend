import React, { useState } from 'react';
import './main-page.css'; 
import { AuthApi } from '../../api/authApi';
import { APIStatus, PageProps } from '../../types';
import { useEffect } from 'react';
import { UserRoute } from '../route-user/route-user';
import { BackofficeRoute } from '../route-backoffice/route-backoffice';

export const MainPage: React.FC<PageProps> = (pageProps) => {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [currentRoute, setCurrentRoute] = useState<'user'|'backoffice'>('user');

  useEffect(() => {
    const fetchUsername = async () => {
      setIsLoading(true);
      try {
        const res = await AuthApi.getUserName();
        setUsername(res as string);
      } catch (error) {
        setErrorMessage('Failed to fetch username');
        pageProps.navigateToLoginPage();
      }
      setIsLoading(false);
    };
  
    fetchUsername();
  }, []);


  const onLogout = async () => {
    setIsLoading(true);
    const res = await AuthApi.logout();
    setIsLoading(false);
    if(res === APIStatus.Success) {
      pageProps.navigateToLoginPage();
        return;
    }
    setErrorMessage('Failed to logout, please try again');
  }

  if(currentRoute === 'user') {
    return (
      <UserRoute {...pageProps}/>
    )
  }
  
  return (
      <BackofficeRoute {...pageProps}/>
    )
};
