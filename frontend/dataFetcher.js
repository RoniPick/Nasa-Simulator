// Function to populate the table with data
function populateTableData(data, targetContainerId) {
  const dataContainer = document.getElementById(targetContainerId);
  const tbody = dataContainer.querySelector('tbody');

  // Clear previous data
  tbody.innerHTML = '';

  data.forEach((item, index) => {
    const row = tbody.insertRow(); // Create a table row

    const eventNumberCell = row.insertCell();
    eventNumberCell.textContent = index + 1; // Event number starts from 1

    const keys = ['utc', 'informingFactor', 'location', 'eventType', 'severityLevel'];

    keys.forEach(key => {
      const cell = row.insertCell(); // Create a table data cell
      const valueSpan = document.createElement('span');

      if (key === 'location') {
        const location = item[key];
        valueSpan.textContent = `RA: ${location.RA}, DEC: ${location.DEC}`;
      } else {
        valueSpan.textContent = item[key];
      }

      if (key === 'severityLevel') {
        if (item[key] > 3) {
          valueSpan.style.color = 'red';
          valueSpan.style.fontWeight = 'bold';
          valueSpan.style.fontSize = 'x-large';
        }
      }

      cell.appendChild(valueSpan);
    });
  });
}

