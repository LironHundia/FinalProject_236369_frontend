import React, { useState, useEffect } from 'react';
import { Button, Container,  Box} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Dayjs } from 'dayjs';
import {UserBar} from '../../user-bar/user-bar';
import {categories, CreatedEvent, defaultCreatedEvent, 
    TicketStruct, defaultTicketStruct} from '../../../types';
import TicketType from './ticket-type/ticket-type';
import {MAX_TICKETS_CATEGORIES} from '../../../consts';
import {EventApi} from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import NewEventDetails from './new-event-details/new-event-details';
import './BO-create-event.css';

  
interface CreateEventProps {
    navigateToBOCatalogPage: () => void;
  }

export const BOCreateEvent: React.FC<CreateEventProps> = ({navigateToBOCatalogPage}) => {
    const [formData, setFormData] = useState<CreatedEvent>(defaultCreatedEvent); // State to store the form data
  const [index, setIndex] = useState(0); // Indexes to differentiate tickets type
  const [quantityChange, setQuantityChange] = useState(false); // To alert that the amount of tickets has changed in one of the types
  const [serverError, setServerError] = useState<string | null>(null);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

    const triggerQuantityChange = () => setQuantityChange(prevState => !prevState);


    //If quantity changes at one of the types, update the total tickets
    useEffect(() => {
        const total = formData.tickets.reduce((sum, ticket) => sum + ticket.initialQuantity, 0);
        setFormData(prevState => ({ ...prevState, totalAvailableTickets: total }));
      }, [quantityChange]);
      

//Handle TextField changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };


  //Handle DateTimePicker changes
  const handleDateChange = (dateType: 'startDate' | 'endDate', value: Dayjs | null) => {
    if (value) {
      setFormData({
        ...formData,
        [dateType]: value.toDate().toISOString() ,  
      });
    }
  };


    //Handle Select changes
  const handleSelectChange = (event:  SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [event.target.name as keyof typeof formData]: event.target.value,
    });
  };

  //Add one more TicketType component
  const handleAddTicket = () => {
    const newTicket: TicketStruct = defaultTicketStruct;
    setFormData({
      ...formData,
      tickets: [...formData.tickets, newTicket],
    });
    setIndex(index + 1);
  };
  

  //Update the index-ed TicketStruct in the tickets array
  const handleTicketUpdate = (index: number, ticket: TicketStruct) => {
    setFormData({
      ...formData,
      tickets: formData.tickets.map((t, i) => i === index ? ticket : t),
    });
  };
  
  
  //Check if there are duplicated types in the tickets array
  function checkForDuplicateTypes(tickets: TicketStruct[]): boolean {
    let uniqueTypes = new Set();
    let duplicateTypes = [];

    for (let ticket of tickets) {
        if (uniqueTypes.has(ticket.type)) {
            duplicateTypes.push(ticket.type);
        } else {
            uniqueTypes.add(ticket.type);
        }
    }

    if (duplicateTypes.length > 0) {
        setTicketsError(`Invalid form. The next types are duplicated: ${duplicateTypes.join(', ')}`);
        return true;
    } else {
        setTicketsError(null);
        return false;
    }
}



// handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (checkForDuplicateTypes(formData.tickets))
      return;
    try{
    await EventApi.addNewEvent(formData);}
    catch(e){
      setServerError("error in adding event");
    }
    navigateToBOCatalogPage();
  };



  return (
    <div className="page">
    <div className="user-bar">
    <UserBar onGoBack={navigateToBOCatalogPage}/>
    </div>
    <br />{serverError && <ErrorMessage message={serverError} />}
    <Container className="form" maxWidth="xl">
      <form onSubmit={handleSubmit}>
        <NewEventDetails formData={formData} categories={categories} handleTextChange={handleTextChange} 
        handleSelectChange={handleSelectChange} handleDateChange={handleDateChange} />
        <div className="ticketsSection">
        <br />{ticketsError && <ErrorMessage message={ticketsError} />}
        <div className='types'>
        {formData.tickets.map((ticket, i) => (
        <TicketType key={i} index={i} onTicketUpdate={handleTicketUpdate} onQuanChange={triggerQuantityChange}/>))}        
          {formData.tickets.length < MAX_TICKETS_CATEGORIES && 
        <button className="addButton" onClick={handleAddTicket}>+<br />add new type</button>}
        </div>
        <Box className="total" mt={2}>
          Total Tickets: {formData.totalAvailableTickets ? formData.totalAvailableTickets.toLocaleString() : '0'}
        </Box>
        </div>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button type="submit" variant="contained" color="primary">Publish Event</Button>
        </Box>
        </form>
    </Container>
    </div>
  );
  
};

