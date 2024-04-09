import React, { useState, useEffect } from 'react';
import {  Select, MenuItem, TextField, Button, Container, FormControl, InputLabel, Grid, Box} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {UserBar} from '../../user-bar/user-bar';
import {categories, TicketStruct, CreatedEvent} from '../../../types';
import TicketType from './ticket-type/ticket-type';
import {createValidation} from '../../../utilities';
import {EventApi} from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import './BO-create-event.css';

const defaultTicket: TicketStruct = { type: '', price: 0, initialQuantity: 0, availableQuantity: 0 };

interface CreateEventProps {
    navigateToBOCatalogPage: () => void;
  }

  const defaultEvent: CreatedEvent = {
    name: '',
    category: '',
    description: '',
    organizer: '',
    location: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    tickets: [defaultTicket],
    totalAvailableTickets: 0,
};
  

export const BOCreateEvent: React.FC<CreateEventProps> = ({navigateToBOCatalogPage}) => {
    const [formData, setFormData] = useState<CreatedEvent>(defaultEvent);
  const [index, setIndex] = useState(0);
  const [quantityChange, setQuantityChange] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const triggerQuantityChange = () => setQuantityChange(prevState => !prevState);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (event:  SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [event.target.name as keyof typeof formData]: event.target.value,
    });
  };

  const handleAddTicket = () => {
    const newTicket: TicketStruct = defaultTicket;
    setFormData({
      ...formData,
      tickets: [...formData.tickets, newTicket],
    });
    setIndex(index + 1);
  };
  

  const handleTicketUpdate = (index: number, ticket: TicketStruct) => {
    setFormData({
      ...formData,
      tickets: formData.tickets.map((t, i) => i === index ? ticket : t),
    });
  };


  useEffect(() => {
    const total = formData.tickets.reduce((sum, ticket) => sum + ticket.initialQuantity, 0);
    setFormData(prevState => ({ ...prevState, totalAvailableTickets: total }));
    console.log(formData);
  }, [quantityChange]);



  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!createValidation(formData)) {
        return;
    }
    try{
    await EventApi.addNewEvent(formData);}
    catch(e){
        setErrorMessage("error in adding event");
    }
    navigateToBOCatalogPage();
  };



  return (
    <div className="page">
    <div className="user-bar">
    <UserBar onGoBack={navigateToBOCatalogPage}/>
    </div>
    <br />{errorMessage && <ErrorMessage message={errorMessage} />}
    <Container className="form" maxWidth="xl">
      <form onSubmit={handleSubmit}>
      <Grid container spacing={4} justifyContent="center">
          <Grid item xl={6} lg={5}>
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
        </Grid>
        <Grid item xl={6} lg={5}>
        <Box mb={2}><TextField name="imageUrl" value={formData.imageUrl} onChange={handleTextChange} label="Img URL" fullWidth /></Box>
        <Box mb={2}><TextField name="startDate" value={formData.startDate} onChange={handleTextChange} label="Start Date" type="datetime-local" required fullWidth InputLabelProps={{ shrink: true }} /></Box>
        <Box mb={2}><TextField name="endDate" value={formData.endDate} onChange={handleTextChange} label="End Date" type="datetime-local" required fullWidth InputLabelProps={{ shrink: true }} /></Box>
        </Grid>
        </Grid>
        </form>
        <div className='tickets'>
        {formData.tickets.map((ticket, i) => (
        <TicketType key={i} index={i} onTicketUpdate={handleTicketUpdate} onQuanChange={triggerQuantityChange}/>))}        
        <button className="addButton" onClick={handleAddTicket}>+<br />add new type</button>
        </div>
        <Box className="total"  mt={2}>
          Total Tickets: {formData.totalAvailableTickets ? formData.totalAvailableTickets.toLocaleString() : '0'}
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Publish Event</Button>
        </Box>
    </Container>

    </div>
  );
  
};

