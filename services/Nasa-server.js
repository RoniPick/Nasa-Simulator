const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = 4001;
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

//Define a route for NASA
app.get('/nasa', async (req, res) => {
  try {
    const currentDate = new Date();
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + 1);

    const startDate = formatDate(currentDate);
    const endDate = formatDate(nextDate);

    const apiKey = '1uI4GbaJZKD9NooOyvHAc5RK54xdc6ifIKXCe8g9';
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;
    console.log("data", data)

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log("finished")

});

// Define a route for scraping data from the main website
app.get('/sun', (req, res) => {
  console.log("sun")
  const pythonProcess = exec('python3 frontend/sun_information.py');

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
    // Send a response to the client here if needed
    res.json({ message: 'Python script executed successfully' });
  });
});

// Format the date in 'YYYY-MM-DD' format
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
