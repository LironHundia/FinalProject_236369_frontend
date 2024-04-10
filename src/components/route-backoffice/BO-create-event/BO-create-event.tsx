import React, { useState, useEffect } from 'react';
import {  Select, MenuItem, TextField, Button, Container, 
    FormControl, InputLabel, Grid, Box} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {UserBar} from '../../user-bar/user-bar';
import {categories, CreatedEvent, defaultCreatedEvent, 
    TicketStruct, defaultTicketStruct} from '../../../types';
import TicketType from './ticket-type/ticket-type';
import {sameType} from '../../../utilities';
import {MAX_TICKETS_CATEGORIES} from '../../../consts';
import {EventApi} from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import './BO-create-event.css';

  
interface CreateEventProps {
    navigateToBOCatalogPage: () => void;
  }

export const BOCreateEvent: React.FC<CreateEventProps> = ({navigateToBOCatalogPage}) => {
    const [formData, setFormData] = useState<CreatedEvent>(defaultCreatedEvent);
  const [index, setIndex] = useState(0);
  const [quantityChange, setQuantityChange] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const triggerQuantityChange = () => setQuantityChange(prevState => !prevState);

    useEffect(() => {
        const total = formData.tickets.reduce((sum, ticket) => sum + ticket.initialQuantity, 0);
        setFormData(prevState => ({ ...prevState, totalAvailableTickets: total }));
        console.log(formData);
      }, [quantityChange]);
      


  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  
  const handleDateChange = (dateType: 'startDate' | 'endDate', value: Dayjs | null) => {
    if (value) {
      setFormData({
        ...formData,
        [dateType]: value.toDate(),
      });
    }
  };

  const handleSelectChange = (event:  SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [event.target.name as keyof typeof formData]: event.target.value,
    });
  };

  const handleAddTicket = () => {
    const newTicket: TicketStruct = defaultTicketStruct;
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




  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sameType(formData.tickets)) {
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={2}> <DateTimePicker name="startDate" value={dayjs(formData.startDate)} onChange={(value) => handleDateChange('startDate', value)} label="Start Date"  
        minDateTime={ dayjs(new Date())} slotProps={{ textField: { required: true, fullWidth: true }}}  /></Box>
         <Box mb={2}> <DateTimePicker name="endDate" value={dayjs(formData.endDate)} onChange={(value) => handleDateChange('endDate', value)} label="End Date"  
        minDateTime={ dayjs(formData.startDate).add(1, 'hour')} slotProps={{ textField: { required: true, fullWidth: true }}}  /></Box>
        </LocalizationProvider>
        </Grid>
        </Grid>
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

