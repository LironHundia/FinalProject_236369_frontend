import React, { useState, useRef, useEffect } from 'react';
import { TicketStruct, defaultTicketStruct } from '../../../../types';
import './ticket-type.css';

//State and functions that sent from BOCreateEvent
interface TicketTypeProps {
    index: number;
    onTicketUpdate: (index: number, newTicket: TicketStruct) => void;  
    onQuanChange: () => void;
}

const TicketType: React.FC<TicketTypeProps> = ({ index, onTicketUpdate, onQuanChange }) => {

  //One-time hook, sets for the TicketType component its index
     const place = useRef(index);
    useEffect(() => {
      if (place.current === null) {
        place.current = index;
      }
    }, []);

    const [ticket, setTicket] = useState<TicketStruct>(defaultTicketStruct);
  
 
    //Handle the input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'initialQuantity' || name === 'price') 
      if ( Number(value) < 0) return;
    let updatedTicket = {...ticket};
    if (name === 'initialQuantity') {
      updatedTicket = { ...updatedTicket, [name]: Number(value), availableQuantity: Number(value) };
      onQuanChange();} 
    else if (name === 'price') {
        updatedTicket = { ...updatedTicket, [name]: Number(value) };} 
    else {
      updatedTicket = { ...updatedTicket, [name]: value };}
    setTicket(updatedTicket);
    onTicketUpdate(place.current, updatedTicket);
  };



  return (
    <div className="ticketType">
          <input name="type" value={ticket.type} onChange={handleChange} placeholder="Type" required/>
          <input name="price" value={ticket.price === 0 ? '' : ticket.price} onChange={handleChange} placeholder="Price (USD)" type="number" min="1" required/>
        <input name="initialQuantity" value={ticket.initialQuantity === 0 ? '' : ticket.initialQuantity} onChange={handleChange} placeholder="Total tickets" type="number" min="1" required/>
    </div>
  );
};

export default TicketType;
