const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'joelbinoy',
  database: 'hms',
  port: 3306 // Default MySQL port
});

// Open the connection
connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the MySQL database.');

  // Close the connection
  connection.end();
});
