import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  Grid,
  Text
} from 'grommet';
import { useNavigate } from 'react-router-dom'; // Use for navigation
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000'
    },
    font: {
      family: 'Lato',
    },
  },
};

const SidebarButton = ({ label, onClick, dropdownItems }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Box>
      <Button
        plain
        onClick={onClick}
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        {({ hover }) => (
          <Box
            background={hover ? "#DADADA" : undefined}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Text size="large">{label}</Text>
          </Box>
        )}
      </Button>
      {dropdownItems && showDropdown && (
        <Box
          background="light-2"
          pad={{ vertical: "small" }}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {dropdownItems.map((item, index) => (
            <Button
              key={index}
              plain
              onClick={() => {}}
            >
              {({ hover }) => (
                <Box
                  background={hover ? "#E0E0E0" : undefined}
                  pad={{ horizontal: "large", vertical: "medium" }}
                >
                  <Text size="medium">{item}</Text>
                </Box>
              )}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

const SidebarButtons = () => {
  const [active, setActive] = useState();
  const navigate = useNavigate(); // Hook for navigation

  const handleNavigation = (label) => {
    if (label === "Appointments") {
      navigate("/ApptList");
    } else if (label === "Sign Out") {
      fetch("http://localhost:3001/endSession");
      navigate("/");
    } else if (label === "Settings") {
      navigate("/DocSettings");
    } else if (label === "View Patients") {
      navigate("/MedHistView");
    }
    setActive(label);
  };

  return (
    <Grommet full theme={theme}>
      <Box fill direction="row">
        <Box background="brand">
          {["Appointments", "View Patients", "Settings"].map(label => (
            <SidebarButton
              key={label}
              label={label}
              active={label === active}
              onClick={() => handleNavigation(label)}
            />
          ))}
          <SidebarButton
            label="Lab result"
            dropdownItems={["Generate Lab Result"]}
          />
          <SidebarButton
            label="Insurance"
            dropdownItems={["View Insurance Details"]}
          />
          <SidebarButton
            label="Sign Out"
            onClick={() => handleNavigation("Sign Out")}
          />
        </Box>
      </Box>
    </Grommet>
  );
};

const DocHome = () => {
  const Header = () => (
    <Box
      tag='header'
      background='brand'
      pad='small'
      elevation='small'
      justify='between'
      direction='row'
      align='center'
      flex={false}
      style={{ borderBottom: "1px solid grey" }}
    >
      <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
        <Heading level='3' margin='none'>HMS</Heading>
      </a>
    </Box>
  );

  return (
    <Grommet full theme={theme}>
      <Box align="left">
        <Header />
        <Grid
          fill
          rows={['auto', 'flex']}
          columns={['auto', 'flex']}
          areas={[
            { name: 'sidebar', start: [0, 1], end: [0, 1] },
            { name: 'main', start: [1, 1], end: [1, 1] },
          ]}
        >
          <Box
            gridArea="sidebar"
            width="small"
            animation={[
              { type: 'fadeIn', duration: 300 },
              { type: 'slideRight', size: 'xlarge', duration: 150 },
            ]}
          >
            <SidebarButtons />
          </Box>
          <Box
            gridArea="main"
            justify="top"
            align="center"
          >
            <Box align="center" pad="large">
              <Heading color="#000000">Welcome Doctor</Heading>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Grommet>
  );
};

export default DocHome;
