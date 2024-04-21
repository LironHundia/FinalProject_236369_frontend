import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SortFilter } from './sort-filter/sort-filter';
import { SelectChangeEvent } from '@mui/material/Select';
import { CatalogEvent } from './catalog-event/catalog-event';
import { EventApi } from '../../api/eventApi';
import { AuthApi } from '../../api/authApi';
import { Loader } from '../loader/loader';
import { Event } from '../../types';
import { getUserNextEvent } from '../../utilities';
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
  const [sliderValue, setSliderValue] = useState(0); // State to keep track of the slider value
  const [sortOption, setSortOption] = useState<string | undefined>(undefined); // State to keep track of the sort option


  const generalContext = React.useContext(GeneralContext);
  const isManager = generalContext?.route == 'backoffice' ? true : false;


  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSortOption(value === "Clear" ? undefined : value);
    setEvents([]);
    setPage(1);
  };

  const handleFilterChange = (filter: number) => {
    setSliderValue(filter);
    setEvents([]);
    setPage(1);
  }

  //TODO: how many events to fetch at a time?
  const fetchMoreEvents = async (): Promise<void> => {
    let data: Event[] = [];
    try {
      if (isManager)
        data = await EventApi.getAllEvents(undefined, page);
      else
        data = await EventApi.getAvailableEvents(undefined, page, sortOption, sliderValue);
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
      await setEvents([]);
      await setPage(1);
      let data: Event[] = [];
      try {
        if (isManager)
          data = await EventApi.getAllEvents(undefined, page);
        else
          data = await EventApi.getAvailableEvents(undefined, page, sortOption, sliderValue);
        setPage(prevPage => prevPage + 1);
        if (data.length === 0) {
          setHasMore(false);
        }
        setEvents(data);
      } catch (error) {
        console.error('Error fetching initial events:', error);
      }
    };

    fetchInitialEvents();
  }, [sortOption, sliderValue]);


  //TODO: Add documentation
  React.useEffect(() => {
    const setUserNextEvent = async () => {
      if (generalContext?.username) {
        try {
          const nextEvent = await getUserNextEvent(generalContext?.username!);
          generalContext?.setNextEvent(nextEvent);
          if (nextEvent !== null) {
            const nextEventToSave = { eventId: nextEvent.eventId, eventName: nextEvent.eventName, startDate: nextEvent.startDate }
            sessionStorage.setItem('currentNextEvent', JSON.stringify(nextEventToSave));
          }
          else {
            sessionStorage.setItem('currentNextEvent', JSON.stringify(nextEvent));
          }
        }
        catch (error) {
          console.error('Error fetching next event:', error);
        }
      }
    }
    setUserNextEvent();
  }, [generalContext?.username]);

  useEffect(() => {
    const fetchUserPermission = async () => {
      try {
        const permission = await AuthApi.getUserPermission();
        generalContext?.setUserPermission(permission as 'A' | 'M' | 'W');
      }
      catch (e) {
        generalContext?.onLogout();
      }
    };

    fetchUserPermission();
  }, []);

  return (
    <div className="catalog-page">
      <div className="user-bar">
        <UserBar onGoBack={navigate.navigateToCatalogPage} />
      </div>
      {!isManager && (
        <SortFilter
          sortOption={sortOption}
          handleSortChange={handleSortChange}
          handleFilterChange={handleFilterChange}
        />)}
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
          {events.filter(event => event.lowestPrice! >= sliderValue).map((event, index) => (
            <CatalogEvent key={index + 1} event={event} navigateToEventPage={navigate.navigateToEventPage} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};