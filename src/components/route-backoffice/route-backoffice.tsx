import React, { useState } from 'react';
import { AuthApi } from '../../api/authApi';
import { APIStatus, PageProps } from '../../types';
import {BOCatalog} from '../route-backoffice/BO-catalog/BO-catalog';
import {BOEventPage} from '../route-backoffice/BO-event-page/BO-event-page';
import {BOCreateEvent} from '../route-backoffice/BO-create-event/BO-create-event';

export const BackofficeRoute: React.FC<PageProps> = ({navigateToLoginPage}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [backofficePage, setBackofficePage] = useState<'catalog'|'eventPage'|'createEvent'>('catalog');

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

  if(backofficePage === 'catalog') {
    return (
      <BOCatalog/>
    )
  }
  if(backofficePage === 'eventPage') {
    return (
      <BOEventPage/>
    )
  }
  //createEvent
  return (
      <BOCreateEvent/>
    )
};
