import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Slider } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { EventApi } from '../../../api/eventApi';
import './sort-filter.css';


interface SortFilterProps {
  sortOption: string | undefined;
  handleSortChange: (event: SelectChangeEvent<string>) => void;
  handleFilterChange: (value: number) => void;
}

export const SortFilter: React.FC<SortFilterProps> = ({ sortOption, handleSortChange, handleFilterChange }) => {
  const [maxPrice, setMaxPrice] = useState(0);
  const [marks, setMarks] = useState<{ value: number }[]>([]);

  //Getting the maximum "lowest price" of the events
  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const data = await EventApi.getMaxPrice();
        setMaxPrice(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMaxPrice();
  }, []);

  //Setting the marks for the slider
  useEffect(() => {
    const newMarks = [];
    for (let i = 0; i <= maxPrice; i += i < 100 ? 10 : 50) {
      newMarks.push({ value: i });
    }

    setMarks(newMarks);
  }, [maxPrice]);

  
  return (
    <div className="sort-filter">
      <div className="filter">
        <p>Starting from:</p>
        <Slider 
        defaultValue={0} 
        valueLabelFormat={(value) => `$${value}`}
        getAriaValueText={value => `Price: $${value}`}
        aria-labelledby="discrete-slider" 
        valueLabelDisplay="auto" 
        step={null} 
        marks={marks}
        min={0} 
        max={maxPrice} 
        onChange={(event, newValue) => {
            handleFilterChange(typeof newValue === 'number' ? newValue : newValue[0]);
          }}/>
      </div>
      <div className="sort">
        <Select
          value={sortOption || ''}
          onChange={handleSortChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          renderValue={() => 'Sort by Price'}>
          <MenuItem value="asc" selected={sortOption === 'asc'}>
            Ascending
          </MenuItem>
          <MenuItem value="desc" selected={sortOption === 'desc'}>
            Descending
          </MenuItem>
          <MenuItem value="Clear">Clear</MenuItem>
        </Select>
      </div>
    </div>
  );
};