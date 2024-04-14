import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Event } from '../../../types';
import { UserContext } from '../../route-user/route-user';
import { BOContext } from '../../route-backoffice/route-backoffice';
import { GeneralContext } from '../../main/main-page';
import defaultEventImage from '../../../additionals/image-not-found.jpg';
import {dateToString, timeToLocalString} from '../../../utilities';

import './catalog-event.css';

interface CatalogEventProps {
  className?: string;
  event: Event;
  navigateToEventPage: () => void;
}

export const CatalogEvent: React.FC<CatalogEventProps> = ({ className, event, navigateToEventPage }) => {
  const userContext = React.useContext(UserContext);
  const BOcontext = React.useContext(BOContext);
  const generalContext = React.useContext(GeneralContext);
  const isManager = generalContext?.route == 'backoffice' ? true : false;

  const showStartDate = new Date(event.startDate);
  const startDate_date = dateToString(showStartDate);
  const startDate_time = timeToLocalString(showStartDate);

  //Handle click on event card (whether it is a manager or a user)
  const handleClick = async () => {
    try {
      if (isManager) {
        await BOcontext?.setBackofficeEvent(event);
        navigateToEventPage();
      }
      else {
        await userContext?.setUserEvent(event);
        navigateToEventPage();
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  const image = event.imageUrl ? event.imageUrl : defaultEventImage;

  return (
    <div className={className}>
      <Card className="card" onClick={handleClick}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={event.name}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {event.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {startDate_date} {startDate_time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.category}
          </Typography>
          {isManager ? (<span>&nbsp;</span>) :
            (<Typography variant="body2" color="text.secondary">
              from {event.lowestPrice}$
            </Typography>
            )}
          <Typography variant="body2" color="text.secondary">
            {event.totalAvailableTickets} Tickets available
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
