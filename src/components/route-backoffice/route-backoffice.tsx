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
  navigateToBOCreateEventPage: () => void;
  setPreviousBOPage: (value: 'catalog' | 'eventPage' | 'createEvent') => void;
}

export const BOContext = React.createContext<BackofficeContext | null>(null)

export const BackofficeRoute: React.FC = () => {
  const [backofficeEvent, setBackofficeEvent] = useState<Event | null>(null);
  const [previousBOPage, setPreviousBOPage] = useState<'catalog' | 'eventPage' | 'createEvent'>('catalog');
  const [backofficePage, setBackofficePage] = useState<'catalog' | 'eventPage' | 'createEvent'>(() => {
    // Get the current page from session storage when the component is mounted
    const savedBOpage = sessionStorage.getItem('currentBOpage');
    return savedBOpage ? JSON.parse(savedBOpage) : 'catalog';
  });
  
  React.useEffect(() => {
    // Save the current page to session storage whenever it changes
    sessionStorage.setItem('currentBOpage', JSON.stringify(backofficePage));
  }, [backofficePage]);

  const backofficePageProps: BackofficePageProps = {
    navigateToBOCatalogPage: () => setBackofficePage('catalog'),
    navigateToBOEventPage: () => {setBackofficePage('eventPage'); window.scrollTo(0, 0);},
    navigateToBOCreateEventPage: () => setBackofficePage('createEvent'),
  }

  if (backofficePage === 'catalog') {
    return (
      <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent, navigateToBOCreateEventPage: backofficePageProps.navigateToBOCreateEventPage, setPreviousBOPage }}>
        <Catalog navigateToCatalogPage={backofficePageProps.navigateToBOCatalogPage} navigateToEventPage={backofficePageProps.navigateToBOEventPage}/>
      </BOContext.Provider>
    )
  }
  if (backofficePage === 'eventPage') {
    return (
      <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent, navigateToBOCreateEventPage: backofficePageProps.navigateToBOCreateEventPage, setPreviousBOPage  }}>
        <BOEventPage {...backofficePageProps}/>
      </BOContext.Provider>
    )
  }
  //createEvent
  return (
    <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent, navigateToBOCreateEventPage: backofficePageProps.navigateToBOCreateEventPage, setPreviousBOPage }}>
      <BOCreateEvent navigateToBOCatalogPage={backofficePageProps.navigateToBOCatalogPage}/>
    </BOContext.Provider>
  )
};
