import React, { useState, useEffect } from "react";
import { Box, Heading, Grommet } from "grommet";
import "./App.css";

const theme = {
  global: {
    colors: {
      brand: "#000000",
      focus: "#000000",
    },
    font: {
      family: "Lato",
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

const ViewInsurance = () => {
  const [insuranceState, setInsuranceState] = useState([]);
  const [patientEmail, setPatientEmail] = useState("");

  // Fetch insurance data and patient email
  const fetchInsurance = async () => {
    try {
      const userResponse = await fetch("http://localhost:3001/userInSession");
      const userData = await userResponse.json();
      const email_in_use = userData.email;
      setPatientEmail(email_in_use); // Set the current patient email

      const insuranceResponse = await fetch(
        `http://localhost:3001/patientViewInsurance?email=${email_in_use}`,
      );
      const insuranceData = await insuranceResponse.json();
      console.log("Fetched insurance data:", insuranceData);

      if (insuranceData.data) {
        setInsuranceState(insuranceData.data);
      } else {
        console.error("No data found in insurance response");
        window.alert("No data found in insurance response");
      }
    } catch (error) {
      window.alert("Error fetching insurance data");
      console.error("Error fetching insurance data:", error);
    }
  };

  useEffect(() => {
    fetchInsurance(); // Call the fetchInsurance function when the component mounts
  }, []);

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <AppBar>
          <a style={{ color: "inherit", textDecoration: "inherit" }} href="/">
            <Heading level="3" margin="none">
              HMS
            </Heading>
          </a>
        </AppBar>
        <Box
          fill
          pad={{ vertical: "large", horizontal: "medium" }}
          align="center"
          justify="start"
        >
          <table className="table table-hover" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Policy No</th>
                <th>Provider</th>
                <th>Coverage Amount</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {insuranceState.map((insurance) => (
                <tr key={insurance.ID}>
                  <td align="center">{insurance.Policy_number || "N/A"}</td>
                  <td align="center">{insurance.provider || "N/A"}</td>
                  <td align="center">{insurance.coverage_amount || "N/A"}</td>
                  <td align="center">{patientEmail || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Grommet>
  );
};

export default ViewInsurance;
