import React, { useEffect, useState } from 'react';
import { Box, Text, Grommet } from 'grommet';
import { useParams } from 'react-router-dom';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000',
    },
    font: {
      family: 'Lato',
    },
  },
};

const LabResultDetail = () => {
  const { testId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLabResult = async () => {
      try {
        const response = await fetch(`http://localhost:3001/view-lab-result/${testId}`);
        if (response.ok) {
          const resultData = await response.json();
          console.log('Raw result data from backend:', resultData); // Log the raw data

          // Transform data to match expected structure
          if (resultData && resultData.data && resultData.data.length > 0) {
            const labResult = resultData.data[0]; // Access the first item in the array
            const transformedData = {
              id: labResult.id || 'N/A',            // Adjusted to get id directly from the first object
              name: labResult.name || 'N/A',
              date: labResult.date 
                  ? new Date(labResult.date).toLocaleDateString() // Format date
                  : 'N/A',
              result: labResult.result || 'Not yet available', // Fallback for result
              appointment_id: labResult.appointment_id || 'N/A'
            };
            console.log('Transformed lab result data:', transformedData); // Log the transformed data
            setResult(transformedData);
          } else {
            console.error('Unexpected data format or empty array:', resultData); // Log unexpected format
            setError('Unexpected data format or no results found.');
          }
        } else {
          console.error('Error fetching lab result:', response.statusText); // Log error message
          setError('Error fetching lab result: ' + response.statusText);
        }
      } catch (err) {
        console.error('Error fetching data:', err.message); // Log error message
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLabResult();
  }, [testId]);

  // Helper function to render result details
  const renderDetail = (label, value) => (
    <Text>
      <strong>{label}:</strong> {value}
    </Text>
  );

  return (
    <Grommet theme={theme}>
      <Box pad="large" align="center" border={{ color: 'light-3', size: 'small' }} round="small">
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="status-critical">{error}</Text>
        ) : result ? (
          <>
            <Text weight="bold" margin={{ bottom: 'medium' }}>Lab Test Result Details:</Text>
            {renderDetail('ID', result.id)}
            {renderDetail('Name', result.name)}
            {renderDetail('Date', result.date)}
            {renderDetail('Result', result.result)}
            {renderDetail('Appointment ID', result.appointment_id)}
          </>
        ) : (
          <Text>No results found.</Text>
        )}
      </Box>
    </Grommet>
  );
};

export default LabResultDetail;
