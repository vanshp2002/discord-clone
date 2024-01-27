import React from 'react';
import Select from 'react-select';
import './Dropdown.css';

export default function Dropdown({ day, month, year }) {
  // Generate options for days, months, and years
  const generateOptions = (start, end, isMonth = false) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push({
        label: isMonth ? getMonthName(i) : i.toString(),
        value: i.toString(),
      });
    }
    return options;
  };

  const getMonthName = (monthNumber) => {
    const monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1];
  };

  const dayOptions = generateOptions(1, 31); // Assuming days range from 1 to 31
  const monthOptions = generateOptions(1, 12, true); // Month names
  const yearOptions = generateOptions(2022, 2030); // Assuming years range from 2022 to 2030

  // Placeholder options for day, month, and year
  const defaultDayOption = { label: 'Day', value: null };
  const defaultMonthOption = { label: 'Month', value: null };
  const defaultYearOption = { label: 'Year', value: null };

  const customize = {
    control: (styles) => ({
      ...styles,
      backgroundColor: '#1E1F22',
      borderColor: '#1E1F22',
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      return { ...styles, color: '#b5bac1', backgroundColor: isFocused ? '#35373c' : '#2b2d31' };
    },
    singleValue: (styles) => ({ ...styles, color: '#91959C', fontSize: '14px' }),
    menu: (styles) => ({ ...styles, backgroundColor: '#2b2d31' }),
    menuList: (styles) => ({ 
      ...styles, 
      color: '#91959C',
      fontSize: '14px',
      padding: 0, 
      "::-webkit-scrollbar": {
        width: "5px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#2b2d31"
      },
      "::-webkit-scrollbar-thumb": {
        background: "#000000"
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#000000"
      } }),
  };


  return (
    <>
      {/* Day Dropdown */}
      <Select
        className="basic-single"
        classNamePrefix="Day"
        defaultValue={defaultDayOption}
        name="day"
        options={dayOptions}
        styles = {customize}
        isSearchable
      />

      {/* Month Dropdown */}
      <Select
        className="basic-single"
        classNamePrefix="Month"
        defaultValue={defaultMonthOption}
        name="month"
        options={monthOptions}
        styles={customize}
        isSearchable
      />

      {/* Year Dropdown */}
      <Select
        className="basic-single"
        classNamePrefix="Year"
        defaultValue={defaultYearOption}
        name="year"
        options={yearOptions}
        styles={customize}
        isSearchable
      />
    </>
  );
}
