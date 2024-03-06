import { Box } from "@mui/material";
import React, { useState } from "react";

import Signup from "./Signup";
import Login from "./Login";

const LoginSignup = () => {
  const [activeState, setActiveState] = useState(false);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {!activeState ? (
        <Login setActiveState={setActiveState} />
      ) : (
        <Signup setActiveState={setActiveState} />
      )}
    </Box>
  );
};

export default LoginSignup;
