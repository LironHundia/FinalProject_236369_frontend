import React from 'react';
import { Select, MenuItem, Slider } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import './sort-filter.css';


interface SortFilterProps {
  sortOption: string | undefined;
  handleSortChange: (event: SelectChangeEvent<string>) => void;
  setSliderValue: (value: number) => void;
}

export const SortFilter: React.FC<SortFilterProps> = ({ sortOption, handleSortChange, setSliderValue }) => {
  return (
    <div className="sort-filter">
      <div className="filter">
        <p>Starting from:</p>
        <Slider 
        defaultValue={0} 
        getAriaValueText={value => `$${value}`}
        aria-labelledby="discrete-slider" 
        valueLabelDisplay="auto" 
        step={10}
        marks 
        min={0} 
        max={110} 
        onChange={(event, newValue) => {
            setSliderValue(typeof newValue === 'number' ? newValue : newValue[0]);
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