import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
} from 'grommet';
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
  >
    <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
      <Heading level='3' margin='none'>HMS</Heading>
    </a>
  </Box>
);

const Body = ({ apptlist, onCancel }) => (
  <div className="container">
    <div className="panel panel-default p50 uth-panel">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>Concerns</th>
            <th>Symptoms</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apptlist.map(appt => (
            <tr key={appt.id}>
              <td>{appt.id}</td>
              <td>{appt.name}</td>
              <td>{new Date(appt.date).toLocaleDateString()}</td>
              <td>{appt.starttime}</td>
              <td>{appt.concerns}</td>
              <td>{appt.symptoms}</td>
              <td>{appt.status}</td>
              <td>
                <Button label="Diagnose" href={`/Diagnose/${appt.id}`} />
                {appt.status === "NotDone" && (
                  <Button
                    label="Cancel"
                    onClick={() => onCancel(appt.id)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DocViewAppt = () => {
  const [apptlist, setApptlist] = useState([]);

  useEffect(() => {
    const getNames = async () => {
      try {
        const response = await fetch('http://localhost:3001/doctorViewAppt');
        const data = await response.json();
        setApptlist(data.data);
      } catch (error) {
        console.error('Error fetching appointment list:', error);
      }
    };

    getNames();
  }, []);

  const handleCancel = async (id) => {
    try {
      await fetch(`http://localhost:3001/deleteAppt?uid=${encodeURIComponent(id)}`);
      setApptlist(prevList => prevList.filter(appt => appt.id !== id));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  return (
    <Grommet theme={theme} full>
      <Header />
      <Box fill>
        <Body apptlist={apptlist} onCancel={handleCancel} />
      </Box>
    </Grommet>
  );
};

export default DocViewAppt;
