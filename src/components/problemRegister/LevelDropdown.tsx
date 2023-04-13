import React, { useState } from 'react';

interface LevelDropdownProps {
  options: string;
  handleDropDownChange:(e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LevelDropdown = ({ options, handleDropDownChange }: LevelDropdownProps) => {

  // const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { value } = event.target;
  //   setSelectedValue(value);
  //   onChange(value);
  // };


  return (
    <select onChange={(e)=>handleDropDownChange(e)} className = "appearance-none border border-gray-400 rounded-md py-2 px-3 bg-transparent my-4 mr-4" value={options} >
      {["bronze", "silver", "gold"].map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
export default LevelDropdown;