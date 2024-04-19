import React, { useState } from 'react';
import { BackofficePageProps } from '../../types';
import { BOEventPage } from '../route-backoffice/BO-event-page/BO-event-page';
import { BOCreateEvent } from '../route-backoffice/BO-create-event/BO-create-event';
import { Catalog } from '../catalog/catalog';
import { Event } from '../../types';

interface BackofficeContext {
  setBackofficePage: (value: 'catalog' | 'eventPage' | 'createEvent') => void;
  backofficeEvent: Event | null;
  setBackofficeEvent: (value: Event | null) => void;
  navigateToBOCreateEventPage: () => void;
}

export const BOContext = React.createContext<BackofficeContext | null>(null)

export const BackofficeRoute: React.FC = () => {

  /////////////////////////////////////////////////////////////////////////////////
   const [backofficePage, setBackofficePage] = useState<'catalog' | 'eventPage' | 'createEvent'>(() => {
    // Get the current page from session storage when the component is mounted
    const savedBOpage = sessionStorage.getItem('currentBOpage');
    return savedBOpage ? JSON.parse(savedBOpage) : 'catalog';
  });
  
  React.useEffect(() => {
    // Save the current page to session storage whenever it changes
    sessionStorage.setItem('currentBOpage', JSON.stringify(backofficePage));
  }, [backofficePage]);

    /////////////////////////////////////////////////////////////////////////////////
    const [backofficeEvent, setBackofficeEvent] = useState<Event | null>(null);
    // Load event from localStorage or fetch new event
    React.useEffect(() => {
      const storedCurrBOEvent = localStorage.getItem('backofficeEvent');
  
      if (storedCurrBOEvent != null) {
        setBackofficeEvent(JSON.parse(storedCurrBOEvent));
      } else {
        setBackofficeEvent(null);
      }
    }, [backofficePage]);
  
    // Save event to localStorage whenever it changes
    React.useEffect(() => {
      localStorage.setItem('backofficeEvent', JSON.stringify(backofficeEvent));
    }, [backofficeEvent]);
    
    /////////////////////////////////////////////////////////////////////////////////

  const backofficePageProps: BackofficePageProps = {
    navigateToBOCatalogPage: () => setBackofficePage('catalog'),
    navigateToBOEventPage: () => {setBackofficePage('eventPage'); window.scrollTo(0, 0);},
    navigateToBOCreateEventPage: () => setBackofficePage('createEvent'),
  }

  if (backofficePage === 'catalog') {
    return (
      <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent, navigateToBOCreateEventPage: backofficePageProps.navigateToBOCreateEventPage }}>
        <Catalog navigateToCatalogPage={backofficePageProps.navigateToBOCatalogPage} navigateToEventPage={backofficePageProps.navigateToBOEventPage}/>
      </BOContext.Provider>
    )
  }
  if (backofficePage === 'eventPage') {
    return (
      <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent, navigateToBOCreateEventPage: backofficePageProps.navigateToBOCreateEventPage  }}>
        <BOEventPage {...backofficePageProps}/>
      </BOContext.Provider>
    )
  }
  //createEvent
  return (
    <BOContext.Provider value={{ setBackofficePage, backofficeEvent, setBackofficeEvent, navigateToBOCreateEventPage: backofficePageProps.navigateToBOCreateEventPage }}>
      <BOCreateEvent navigateToBOCatalogPage={backofficePageProps.navigateToBOCatalogPage}/>
    </BOContext.Provider>
  )
};
