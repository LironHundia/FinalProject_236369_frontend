import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import * as utils from '../../../utilities';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { Order } from '../../../types';
import { UserOrderDetails } from '../user-order-details/user-order-details';
import './user-order-header.scss';
import { WidthFull } from '@mui/icons-material';

export const UserOrderHeader: React.FC<Order> = (order) => {
  const purchaseDate = utils.dateAndTimeToLocalString(new Date(order.purchaseDate));
  const startDate = utils.dateAndTimeToLocalString(new Date(order.startDate));
  const timeLeft = new Date(order.startDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hasPassed = new Date(order.endDate).getTime() < new Date().getTime();
  return (
    <div className='orderHeaderItem'>
      <Accordion className="accordion">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
            <Box className="headerTextContainer">
              <Typography>{order.eventName}</Typography>
              <Typography>{order.quantity} x {order.ticketsType} Seats</Typography>
              <Typography>Start Date: {startDate}</Typography>
              <Typography>Purchase Date: {purchaseDate}</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
          <UserOrderDetails {...order} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
