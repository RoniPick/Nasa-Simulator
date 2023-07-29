const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
const fs = require('fs'); // for reading json files
const Redis = require('ioredis');

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dashboard.html'));
});

//Define a route for Astronomical Events
app.get('/Astronomical-events', (req, res) => {
// take the html file from the current directory  
  res.sendFile(path.join(__dirname, '../frontend', 'Astronomical_events.html'));
});

// Define a route for NASA
app.get('/nasa', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'nasa.html'));
});

// Define a route for Sun
app.get('/sun', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'sun.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
