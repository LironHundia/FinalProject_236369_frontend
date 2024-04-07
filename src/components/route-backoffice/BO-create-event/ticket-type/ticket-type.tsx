import React, { useState, useRef, useEffect } from 'react';
import { TicketStruct } from '../../../../types';
import './ticket-type.css';

interface TicketTypeProps {
    index: number;
    onTicketUpdate: (index: number, newTicket: TicketStruct) => void;  
}

const TicketType: React.FC<TicketTypeProps> = ({ index, onTicketUpdate }) => {
     const place = useRef(index);
    useEffect(() => {
      if (place.current === null) {
        place.current = index;
      }
    }, []);

    const [ticket, setTicket] = useState<TicketStruct>({ type: '', price: 0, initialQuantity: 0, availableQuantity: 0});
  
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'initialQuantity' || name === 'price') 
      if ( Number(value) < 0) return;
    let updatedTicket = {...ticket};
    if (name === 'initialQuantity') {
      updatedTicket = { ...updatedTicket, [name]: Number(value), availableQuantity: Number(value) };} 
    else if (name === 'price') {
        updatedTicket = { ...updatedTicket, [name]: Number(value) };} 
    else {
      updatedTicket = { ...updatedTicket, [name]: value };}
    setTicket(updatedTicket);
    onTicketUpdate(place.current, updatedTicket);
  };



  return (
    <div className="ticketType">
        <form >
          <input name="type" value={ticket.type} onChange={handleChange} placeholder="Type" required/>
          <input name="price" value={ticket.price === 0 ? '' : ticket.price} onChange={handleChange} placeholder="Price (USD)" type="number" min="1"/>
        <input name="initialQuantity" value={ticket.initialQuantity === 0 ? '' : ticket.initialQuantity} onChange={handleChange} placeholder="Total tickets" type="number" min="1" />
        </form>
    </div>
  );
};

export default TicketType;
