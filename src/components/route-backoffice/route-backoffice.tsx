import React, { useState } from 'react';
import { AuthApi } from '../../api/authApi';
import { APIStatus, BackofficePageProps, PageProps } from '../../types';
import { BOEventPage } from '../route-backoffice/BO-event-page/BO-event-page';
import { BOCreateEvent } from '../route-backoffice/BO-create-event/BO-create-event';
import { Catalog } from '../catalog/catalog';
import { Event } from '../../types';
import { Typography } from '@mui/material';

interface BackofficeContext {
  setBackofficePage: (value: 'catalog' | 'eventPage' | 'createEvent') => void;
  backofficeEvent: Event | null;
  setBackofficeEvent: (value: Event | null) => void;
}

export const BOContext = React.createContext<BackofficeContext | null>(null)

export const BackofficeRoute: React.FC = () => {
  const [backofficeEvent, setBackofficeEvent] = useState<Event | null>(null);
  const [backofficePage, setBackofficePage] = useState<'catalog' | 'eventPage' | 'createEvent'>('createEvent');

  const backofficePageProps: BackofficePageProps = {
    navigateToBOCatalogPage: () => setBackofficePage('catalog'),
    navigateToBOEventPage: () => setBackofficePage('eventPage'),
    navigateToBOCreateEventPage: () => setBackofficePage('createEvent'),
  }

  if (backofficePage === 'catalog') {
    return (
      <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent }}>
        <Catalog navigateToCatalogPage={backofficePageProps.navigateToBOCatalogPage}/>
      </BOContext.Provider>
    )
  }
  if (backofficePage === 'eventPage') {
    return (
      <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent }}>
        <BOEventPage {...backofficePageProps}/>
      </BOContext.Provider>
    )
  }
  //createEvent
  return (
    <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent }}>
      <BOCreateEvent navigateToBOCatalogPage={backofficePageProps.navigateToBOCatalogPage}/>
    </BOContext.Provider>
  )
};
