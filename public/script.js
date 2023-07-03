document.getElementById('exploreBtn').addEventListener('click', function() {
    // Handle button click event here
    // You can add the code to navigate to the data about the sun or perform any other action
    console.log('Button clicked!');
    function getData() {
      // Make an HTTP GET request to the backend server
      fetch('http://localhost:3000/data-5events')
        .then(response => response.json())
        .then(data => {
          // Process the received data and display it in the dataContainer div
          const dataContainer = document.getElementById('dataContainer');
          dataContainer.innerHTML = '';

          // Loop through the data and create HTML elements to display it
          data.forEach(item => {
            const itemDiv = document.createElement('div');
            const keys = Object.keys(item);
            keys.forEach(key => {
              const row = document.createElement('p');
              const keySpan = document.createElement('span');
              keySpan.textContent = `${key}: `;
              const valueSpan = document.createElement('span');
              valueSpan.textContent = `${item[key]}`;
              row.appendChild(keySpan);
              row.appendChild(valueSpan);
              itemDiv.appendChild(row);
            });
            dataContainer.appendChild(itemDiv);
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });

        console.log('getData() function finished');
    }
    getData();
  });
  