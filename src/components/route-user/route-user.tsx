import React, { useState } from 'react';
import { AuthApi } from '../../api/authApi';
import { APIStatus, PageProps } from '../../types';
import { Catalog } from './catalog/catalog';
import { EventPage } from './event-page/event-page';
import { Payment } from './payment/payment';
import { UserSpace } from './user-space/user-space';

export const UserRoute: React.FC<PageProps> = ({navigateToLoginPage}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [userPage, setUserPage] = useState<'catalog'|'eventPage'|'payment'|'userSpace'>('catalog');

  const onLogout = async () => {
    setIsLoading(true);
    const res = await AuthApi.logout();
    setIsLoading(false);
    if(res === APIStatus.Success) {
        navigateToLoginPage();
        return;
    }
    setErrorMessage('Failed to logout, please try again');
  }

  if(userPage === 'catalog') {
    return (
      <Catalog/>
    )
  }
  if(userPage === 'eventPage') {
    return (
      <EventPage/>
    )
  }
  if(userPage === 'payment') {
    return (
      <Payment/>
    )
  }
  //userSpace
  return (
      <UserSpace/>
    )
};
