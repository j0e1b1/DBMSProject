import React, { useState, useEffect } from 'react';
import { Box, Heading, Grommet, Button } from 'grommet';
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

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    style={{ zIndex: '1' }}
    {...props}
  />
);

const PatientsViewAppointments = () => {
  const [appointmentsState, setAppointmentsState] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userResponse = await fetch('http://localhost:3001/userInSession');
        const userData = await userResponse.json();
        const email_in_use = userData.email;
        
        const appointmentsResponse = await fetch(`http://localhost:3001/patientViewAppt?email=${email_in_use}`);
        const appointmentsData = await appointmentsResponse.json();
        
        setAppointmentsState(appointmentsData.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelOrDelete = async (id, isCancel) => {
    try {
      await fetch(`http://localhost:3001/deleteAppt?uid=${id}`);
      // Fetch appointments again after canceling/deleting
      const userResponse = await fetch('http://localhost:3001/userInSession');
      const userData = await userResponse.json();
      const email_in_use = userData.email;
      
      const appointmentsResponse = await fetch(`http://localhost:3001/patientViewAppt?email=${email_in_use}`);
      const appointmentsData = await appointmentsResponse.json();
      
      setAppointmentsState(appointmentsData.data);
    } catch (error) {
      console.error('Error canceling/deleting appointment:', error);
    }
  };

  const Body = () => (
    <div className="container">
      <div className="panel panel-default p50 uth-panel">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Date of Appointment</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Concerns</th>
              <th>Symptoms</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointmentsState.map(patient => (
              <tr key={patient.ID}>
                <td align="center">{new Date(patient.theDate).toLocaleDateString().substring(0, 10)}</td>
                <td align="center">{patient.theStart.substring(0, 5)}</td>
                <td align="center">{patient.theEnd.substring(0, 5)}</td>
                <td align="center">{patient.theConcerns}</td>
                <td align="center">{patient.theSymptoms}</td>
                <td align="center">{patient.status}</td>
                <td>
                  <Button label="See Diagnosis" href={`/showDiagnoses/${patient.ID}`} />
                  {patient.status === "NotDone" ? (
                    <Button
                      label="Cancel"
                      onClick={() => handleCancelOrDelete(patient.ID, true)}
                    />
                  ) : (
                    <Button
                      label="Delete"
                      onClick={() => handleCancelOrDelete(patient.ID, false)}
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

  return (
    <Grommet theme={theme} full>
      <Box>
        <AppBar>
          <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
            <Heading level='3' margin='none'>HMS</Heading>
          </a>
        </AppBar>
        <Body />
      </Box>
    </Grommet>
  );
};

export default PatientsViewAppointments;
