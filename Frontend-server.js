const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
const fs = require('fs'); // for reading json files
const Redis = require('ioredis');

app.use(express.static('public'));
// Define a route

app.get('/', (req, res) => {
  //res.send('Hello, World!');
  res.sendFile(path.join(__dirname,'public',  'index.html'));

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
