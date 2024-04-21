import React from 'react';
import {  Select, MenuItem, TextField, FormControl, InputLabel, Box} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import './new-event-details.css';

interface NewEventDetailsProps {
  formData: any;
  categories: string[];
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (event: SelectChangeEvent<string>) => void;
  handleDateChange: (dateType: 'startDate' | 'endDate', value: Dayjs | null) => void;
}

const NewEventDetails: React.FC<NewEventDetailsProps> = ({ formData, categories, handleTextChange, handleSelectChange, handleDateChange }) => {
  return (
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
  );
};

export default NewEventDetails;