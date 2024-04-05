import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CatalogEvent } from './catalog-event/catalog-event';
import {EventApi} from '../../api/eventApi';
import { Loader } from '../loader/loader';
import { Event } from '../../types';
import { GeneralContext } from '../main/main-page';
import {UserBar} from '../user-bar/user-bar';
import './catalog.css'; 

interface CatalogProps {
  navigateToCatalogPage: () => void;
}

export const Catalog: React.FC<CatalogProps> = ({navigateToCatalogPage}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = React.useState(1);

  const generalContext = React.useContext(GeneralContext);
  const isManager = generalContext?.route == 'backoffice' ? true : false;

  const fetchMoreEvents = async (): Promise<void> => {
        let data:Event[] = [];
        try {
            if (isManager)
               data = await EventApi.getAllEvents(undefined, page);
            else
               data = await EventApi.getAvailableEvents(undefined, page);
            setPage(prevPage => prevPage + 1);
            setEvents(prevEvents => [...prevEvents, ...data]);
            if ( data.length === 0) {
                setHasMore(false);
            }
        } catch (e) {
            console.error(e);
            setHasMore(false);
        }
    };

    useEffect(() => {
        const fetchInitialEvents = async () => {
          let data:Event[] = [];
          try {
              if (isManager)
                 data = await EventApi.getAllEvents(undefined, page);
              else
                 data = await EventApi.getAvailableEvents(undefined, page);
              if ( data.length === 0) {
                  setHasMore(false);
              }
            const result = data.flatMap(element => Array(4).fill(element));
            setEvents(result);
          } catch (error) {
            console.error('Error fetching initial events:', error);
          }
        };
    
        fetchInitialEvents(); 
      }, []);

  return (
    //TODO: centre the bar
        <div className="page">
        <UserBar onGoBack={navigateToCatalogPage}/>
        <div className="catalog">
        <InfiniteScroll
        dataLength={events.length}
        next={fetchMoreEvents}
        hasMore={hasMore}
        loader= {<Loader />}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>There are no more events...</b>
          </p>
        }
        className="events-grid">
        {events.map((event, index) => (
        <CatalogEvent key={index + 1} event={event} />
        ))}
      </InfiniteScroll>
      </div>
      </div>
  );
};