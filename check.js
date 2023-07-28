const express = require('express');
const axios = require('axios');
const app = express();
const port = 4002;
const path = require('path');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

// Define a route for NASA
app.get('/sun', async (req, res) => {
  try {
    // const currentDate = new Date();
    // const nextDate = new Date();
    // nextDate.setDate(currentDate.getDate() + 1);

    const url = 'https://theskylive.com/sun-info';

    const response = await axios.get(url);
    const data = response.data;
    console.log('data', data);

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log('finished');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});