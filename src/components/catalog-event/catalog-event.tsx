import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {formatDate} from '../../../utilities';
import './catalog-event.css';

function findMinPrice(arr: Array<{ name: string, price: number, quantity: number }>) {
    const filteredArr = arr.filter(item => item.quantity > 0);
    return Math.min(...filteredArr.map(item => item.price));
  }

function totalQuantity(arr: Array<{ name: string, price: number, quantity: number }>) {
    return arr.reduce((total, item) => total + item.quantity, 0);
  }

export const CatalogEvent = ({ event, isManager }: { event: any, isManager: boolean }) => {
  return (
  <Card className="card" onClick={() => { /* handle click event here */ }}>
      <CardMedia
        component="img"
        height="140"
        image={event.image} 
        alt={event.title}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(event.start_date)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.category}
        </Typography>
        {!isManager && (
        <Typography variant="body2" color="text.secondary">
         from {findMinPrice(event.tickets)}$
        </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {totalQuantity(event.tickets)} Tickets available
        </Typography>
      </CardContent>
    </Card>
      );
};

export default CatalogEvent;