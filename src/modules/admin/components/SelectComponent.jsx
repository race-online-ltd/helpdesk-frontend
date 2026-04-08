import React from "react";
import Select from "react-select";

export const SelectComponent = ({ options, placeholder, ...props }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "30px",
      height: "30px",
      width: "100%",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "30px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px",
    }),
  };
  return (
    <Select
      options={options}
      placeholder={placeholder}
      className='form-control'
      styles={customStyles}
      {...props}
    />
  );
};
