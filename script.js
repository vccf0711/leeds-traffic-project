
Papa.parse('leeds_age_data.csv', {
  download: true,
  header: true,
  skipEmptyLines: true,

  complete: function(results) {

    const tbody = document.querySelector('#dataTable tbody');

    const labels = [];
    const values = [];

    results.data.forEach(row => {

      // Add data to the HTML table
      const tr = document.createElement('tr');

      const ageCell = document.createElement('td');
      ageCell.textContent = row.agegroup;

      const countCell = document.createElement('td');
      countCell.textContent = row.casualties;

      tr.appendChild(ageCell);
      tr.appendChild(countCell);
      tbody.appendChild(tr);

      // Prepare data for the chart
      labels.push(row.agegroup);
      values.push(Number(row.casualties));

    });

    // Create the bar chart
    new Chart(document.getElementById('ageChart'), {
      type: 'bar',

      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Casualties',
          data: values,
          backgroundColor: '#4e79a7'
        }]
      },

      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Casualties'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Age Group'
            }
          }
        }
      }
    });

  },

  error: function(err) {
    console.error('Failed to load CSV:', err);
  }
});

