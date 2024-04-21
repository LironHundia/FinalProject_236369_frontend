import React, { useState, useEffect } from 'react';
import {  Select, MenuItem, TextField, Button, Container, 
    FormControl, InputLabel, Box} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {UserBar} from '../../user-bar/user-bar';
import {categories, CreatedEvent, defaultCreatedEvent, 
    TicketStruct, defaultTicketStruct,
    APIStatus} from '../../../types';
import TicketType from './ticket-type/ticket-type';
import {MAX_TICKETS_CATEGORIES} from '../../../consts';
import {EventApi} from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import { InvalidActionMsg } from '../../invalid-action-msg/invalid-action-msg';
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
  const [invalidActionMsg, setInvalidActionMsg] = useState<string | null>(null);

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
      await EventApi.addNewEvent(formData);
      navigateToBOCatalogPage();
    }  
    catch(e){
      const error = await e;
      setServerError("error in adding event");
      if(error as APIStatus === APIStatus.Unauthorized)
        {
          setInvalidActionMsg("You are not authorized to perform this action");
        }
    }
  };



  return (
    <div className="page">
    {invalidActionMsg && <InvalidActionMsg msg={invalidActionMsg} goToCatalog={navigateToBOCatalogPage} />}
    <div className="user-bar">
    <UserBar onGoBack={navigateToBOCatalogPage}/>
    </div>
    <br />{serverError && <ErrorMessage message={serverError} />}
    <Container className="form" maxWidth="xl">
      <form onSubmit={handleSubmit}>
      <div className="event-details">
      <div className="details-column">
        <Box mb={2}><TextField name="name" value={formData.name} onChange={handleTextChange} label="Name" required fullWidth /></Box>
        <Box mb={2}>
        <FormControl fullWidth required>
        <InputLabel id="category-label"> Category</InputLabel>
        <Select name="category" value={formData.category} onChange={handleSelectChange} required fullWidth>
        {categories.map((category, index) => (
        <MenuItem key={index} value={category}>
        {category}</MenuItem>))}
        </Select>
        </FormControl>
        </Box>
        <Box mb={2}><TextField name="description" value={formData.description} onChange={handleTextChange} label="Description" required fullWidth /> </Box>
        <Box mb={2}><TextField name="organizer" value={formData.organizer} onChange={handleTextChange} label="Organizer" required fullWidth /></Box>
        <Box mb={2}><TextField name="location" value={formData.location} onChange={handleTextChange} label="Location" required fullWidth /> </Box>
        </div>
        <div className="details-column">
        <Box mb={2}><TextField name="imageUrl" value={formData.imageUrl} onChange={handleTextChange} label="Img URL" fullWidth /></Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={2}> <DateTimePicker name="startDate" value={dayjs(formData.startDate)} onAccept ={(value) => handleDateChange('startDate', value)} label="Start Date"  
        minDateTime={ dayjs(new Date())} slotProps={{ textField: { required: true, fullWidth: true }}}  /></Box>
         <Box mb={2}> <DateTimePicker name="endDate" value={dayjs(formData.endDate)} onAccept ={(value) => handleDateChange('endDate', value)} label="End Date"  
        minDateTime={ dayjs(formData.startDate).add(1, 'hour')} slotProps={{ textField: { required: true, fullWidth: true }}}  /></Box>
        </LocalizationProvider>
        </div>
        </div>
        <br />{ticketsError && <ErrorMessage message={ticketsError} />}
        <div className='tickets'>
        {formData.tickets.map((ticket, i) => (
        <TicketType key={i} index={i} onTicketUpdate={handleTicketUpdate} onQuanChange={triggerQuantityChange}/>))}        
          {formData.tickets.length < MAX_TICKETS_CATEGORIES && 
        <button className="addButton" onClick={handleAddTicket}>+<br />add new type</button>}
        </div>
        <Box className="total" mt={2}>
          Total Tickets: {formData.totalAvailableTickets ? formData.totalAvailableTickets.toLocaleString() : '0'}
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button type="submit" variant="contained" color="primary">Publish Event</Button>
        </Box>
        </form>
    </Container>
    </div>
  );
  
};

