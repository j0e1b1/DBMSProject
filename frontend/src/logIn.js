import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  CheckBox,
} from 'grommet';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: "#000000",
      active: "#000000",
    },
    font: {
      family: 'Lato',
    },
  },
};

const AppBar = (props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    style={{ zIndex: "1" }}
    {...props}
  />
);

const LogIn = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const isDoc = isDoctor;

    try {
      const endpoint = isDoc
        ? `http://localhost:3001/checkDoclogin?email=${email}&password=${password}`
        : `http://localhost:3001/checklogin?email=${email}&password=${password}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.data.length === 0) {
        window.alert("Invalid Log In");
      } else {
        navigate(isDoc ? "/DocHome" : "/Home");
        console.log(data.data);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      window.alert("An error occurred while logging in.");
    }
  };

  return (
    <Grommet theme={theme} full>
      <AppBar>
        <a style={{ color: "inherit", textDecoration: "inherit" }} href="/">
          <Heading level="3" margin="none">
            HMS
          </Heading>
        </a>
      </AppBar>

      <div className="container">
        <div className="background-image"></div>
        <Box className="login-box" pad="medium">
          <Form onSubmit={handleSubmit}>
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Please enter your email."
              required
            />
            <FormField
              type="password"
              label="Password"
              name="password"
              placeholder="Please enter your password."
              required
            />
            <FormField
              component={CheckBox}
              checked={isDoctor}
              margin="large"
              label="I'm a doctor"
              name="isDoc"
              onChange={(event) => setIsDoctor(event.target.checked)}
            />
            <Box direction="column" align="center">
              <Button
                type="submit"
                label="Log In"
                fill="horizontal"
                primary
                style={{ margin: "1rem" }}
              />
              <Button
                label="Create Account"
                fill="horizontal"
                href="/createAcc"
                style={{ margin: "0.5rem" }}
              />
            </Box>
          </Form>
        </Box>
      </div>
    </Grommet>
  );
};

export default LogIn;
