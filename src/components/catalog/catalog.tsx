import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CatalogEvent } from './catalog-event/catalog-event';
import { EventApi } from '../../api/eventApi';
import { Loader } from '../loader/loader';
import { Event } from '../../types';
import { GeneralContext } from '../main/main-page';
import { UserBar } from '../user-bar/user-bar';
import './catalog.css';

interface CatalogProps {
  navigateToCatalogPage: () => void;
  navigateToEventPage: () => void;
}

export const Catalog: React.FC<CatalogProps> = (navigate) => {
  const [events, setEvents] = useState<Event[]>([]); // State to store the events fetched from the API
  const [hasMore, setHasMore] = useState(true); // State to check if there are more events to fetch (for the infinite scroll)
  const [page, setPage] = React.useState(1); // State to keep track of the page number for the infinite scroll

  const generalContext = React.useContext(GeneralContext);
  const isManager = generalContext?.route == 'backoffice' ? true : false;


  //TODO: how many events to fetch at a time?
  const fetchMoreEvents = async (): Promise<void> => {
    let data: Event[] = [];
    try {
      if (isManager)
        data = await EventApi.getAllEvents(undefined, page);
      else
        data = await EventApi.getAvailableEvents(undefined, page);
      setPage(prevPage => prevPage + 1);
      setEvents(prevEvents => [...prevEvents, ...data]);
      if (data.length === 0) {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setHasMore(false);
    }
  };


  // Fetch events for the initial page
  useEffect(() => {
    const fetchInitialEvents = async () => {
      let data: Event[] = [];
      try {
        if (isManager)
          data = await EventApi.getAllEvents(undefined, page);
        else
          data = await EventApi.getAvailableEvents(undefined, page);
        if (data.length === 0) {
          setHasMore(false);
        }
        //TODO: Delete the multiplier
        const result = data.flatMap(element => Array(4).fill(element));
        setEvents(result);
      } catch (error) {
        console.error('Error fetching initial events:', error);
      }
    };

    fetchInitialEvents();
  }, []);

  return (
    <div className="page">
      <div className="user-bar">
        <UserBar onGoBack={navigate.navigateToCatalogPage} />
      </div>
      <div className="catalog">
        <InfiniteScroll
          dataLength={events.length}
          next={fetchMoreEvents}
          hasMore={hasMore}
          loader={<Loader />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>There are no more events...</b>
            </p>
          }
          className="events-grid">
          {events.map((event, index) => (
            <CatalogEvent key={index + 1} event={event} navigateToEventPage={navigate.navigateToEventPage} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};