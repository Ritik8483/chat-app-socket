import { TextField } from "@mui/material";
import React from "react";

const InputField = (props) => {
  const { type, placeholder, label, name, value, onChange } = props;
  return (
    <TextField
      type={type}
      placeholder={placeholder}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;
