import React, { useState } from "react";
import InputField from "../reuseables/InputField";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

const Signup = ({ setActiveState }) => {
  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_API_ROOT}auth/signup`,
        inputValues
      );
      if (resp?.data?.token) {
        localStorage.setItem("webUserToken", JSON.stringify(resp?.data?.token));
        setActiveState(false)
      }
      console.log("resp", resp);
    } catch (error) {
      console.log("error", error);
    }
    console.log(inputValues);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap="20px">
        SIGNUP FORM
        <InputField
          type="text"
          label="First name"
          placeholder="Enter your first name"
          name="firstName"
          value={inputValues.firstName}
          onChange={handleChange}
        />
        <InputField
          type="text"
          label="Last name"
          placeholder="Enter your last name"
          name="lastName"
          value={inputValues.lastName}
          onChange={handleChange}
        />
        <InputField
          type="text"
          label="Email"
          placeholder="Enter your email"
          name="email"
          value={inputValues.email}
          onChange={handleChange}
        />
        <InputField
          type="password"
          label="Password"
          placeholder="Enter your password"
          name="password"
          value={inputValues.password}
          onChange={handleChange}
        />
        <Button variant="contained" type="submit" color="primary">
          Signup
        </Button>
        <Box display="flex" gap="5px">
          Already having an account?{" "}
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => setActiveState(false)}
            color="blue"
          >
            Login
          </Typography>
        </Box>
      </Box>
    </form>
  );
};

export default Signup;
