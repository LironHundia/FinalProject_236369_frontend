import React, { useState, useEffect } from 'react';
import {  Select, MenuItem, TextField, Button, Container, FormControl, InputLabel, Grid, Box} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {UserBar} from '../../user-bar/user-bar';
import {categories, TicketStruct, Event} from '../../../types';
import TicketType from './ticket-type/ticket-type';
import {createValidation} from '../../../utilities';
import './BO-create-event.css';

const defaultTicket: TicketStruct = { type: '', price: 0, initialQuantity: 0, availableQuantity: 0 };

interface CreateEventProps {
    navigateToBOCatalogPage: () => void;
  }

  const defaultEvent: Event = {
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
    const [formData, setFormData] = useState<Event>(defaultEvent);
  const [index, setIndex] = useState(0);

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


// only for debugging
//   useEffect(() => {
//     console.log(formData);
//   }, [formData.tickets]);



  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add logic to submit the form data to your database
    if (!createValidation(formData)) {
        return;
    }



  };



  return (
    <div className="page">
    <div className="user-bar">
    <UserBar onGoBack={navigateToBOCatalogPage}/>
    </div>
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
        <TicketType key={i} index={i} onTicketUpdate={handleTicketUpdate} />))}        
        <button className="addButton" onClick={handleAddTicket}>+<br />add new type</button>
        </div>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Create Event</Button>
        </Box>
    </Container>

    </div>
  );
  
};

