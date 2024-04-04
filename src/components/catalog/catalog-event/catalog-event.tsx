import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Event } from '../../../types';
import { UserContext } from '../../route-user/route-user';
import {formatDate} from '../../../utilities';
import './catalog-event.css';

interface CatalogEventProps {
  className?: string;
  event: Event;
  isManager: boolean;
}


export const CatalogEvent = ({ className, event, isManager  }: CatalogEventProps) => {
  const userContext = React.useContext(UserContext);
   
  const handleClick= async () => {
    await userContext?.setUserEvent(event);
    userContext?.setUserPage('eventPage');
  }
  
  return (
    <div className={className}>
  <Card className="card" onClick= { handleClick }>
      <CardMedia
        component="img"
        height="140"
        image={event.imageUrl} 
        alt={event.name}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.startDate}
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

export default CatalogEvent;