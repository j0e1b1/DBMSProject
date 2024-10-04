import React, { useState } from 'react';
import { Box, Button, Form, FormField, TextInput, Grommet, Heading } from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#000000', // Similar theme color as in OrderLabTest
    },
    font: {
      family: 'Lato',
    },
  },
};

const AddInsurance = () => {
  const [formValues, setFormValues] = useState({
    Policy_number: '',
    provider: '',
    coverage_amount: '',
    patient_email: '',
  });
  const [submittedData, setSubmittedData] = useState(null); // To track submitted data

  const handleChange = (field) => (event) => {
    setFormValues({
      ...formValues,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
  
    try {
      const sentData = JSON.stringify(formValues, null, 2); // Format data for console
      console.log('Data sent to backend:', sentData); // Log sent data
  
      const response = await fetch('http://localhost:3001/addInsurance1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues), // Send form data as JSON
      });
  
      // Check if the response content-type is JSON
      const contentType = response.headers.get('content-type');
  
      let responseData;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json(); // Parse as JSON if content-type is JSON
      } else {
        responseData = await response.text(); // Parse as plain text if not JSON
      }
  
      console.log('Response from backend:', responseData); // Log backend response
  
      if (response.ok) {
        // Success: reset form, show success message, and display sent data
        setSubmittedData(sentData); // Track the sent data
        setFormValues({
          Policy_number: '',
          provider: '',
          coverage_amount: '',
          patient_email: '',
        });
        window.alert('Insurance details added successfully!'); // Alert on success
      } else {
        // Failed response from the server
        console.error('Failed to add insurance details:', responseData);
      }
    } catch (error) {
      // Network or other errors
      console.error('Error adding insurance:', error);
    }
  };

  
  return (
    <Grommet theme={theme}>
      <Box align="center" pad="medium"> {/* Adjust padding to match OrderLabTest */}
        <Heading level="3">Add Insurance Details</Heading>
        <Form onSubmit={handleSubmit}>
          <FormField label="Policy No">
            <TextInput
              value={formValues.Policy_number}
              onChange={handleChange('Policy_number')}
              placeholder="Enter Policy Number"
            />
          </FormField>
          <FormField label="Provider">
            <TextInput
              value={formValues.provider}
              onChange={handleChange('provider')}
              placeholder="Enter Provider"
            />
          </FormField>
          <FormField label="Coverage Amount">
            <TextInput
              type="number"
              value={formValues.coverage_amount}
              onChange={handleChange('coverage_amount')}
              placeholder="Enter Coverage Amount"
            />
          </FormField>
          <FormField label="Patient Email">
            <TextInput
              value={formValues.patient_email}
              onChange={handleChange('patient_email')}
              placeholder="Enter Patient Email"
            />
          </FormField>
          <Button type="submit" label="Submit" primary />
        </Form>
      </Box>
    </Grommet>
  );
};

export default AddInsurance;


