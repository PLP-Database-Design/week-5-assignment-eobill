// Import required packages
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Set up database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving patients' });
    }
    res.json(results);
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving providers' });
    }
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
  const { firstName } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
  db.query(query, [firstName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving patients' });
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  
  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving providers' });
    }
    res.json(results);
  });
});

// Start the server
const PORT = 3306;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
