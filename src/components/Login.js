import React, { useState } from "react";
import InputField from "../reuseables/InputField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

const Login = ({ setActiveState }) => {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState({
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
        `${process.env.REACT_APP_API_ROOT}auth/login`,
        inputValues
      );
      if (resp?.data?.token) {
        localStorage.setItem("webUserToken", JSON.stringify(resp?.data?.token));
        localStorage.setItem("webUserEmail", JSON.stringify(inputValues.email));
        navigate("/products");
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
        LOGIN FORM
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
          Login
        </Button>
        <Box display="flex" gap="5px">
          Don't have an account?{" "}
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => setActiveState(true)}
            color="blue"
          >
            Signup
          </Typography>
        </Box>
      </Box>
    </form>
  );
};

export default Login;
