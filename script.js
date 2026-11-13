Papa.parse('leeds_age_data.csv', {
  download: true,
  header: true,
  skipEmptyLines: true,

  complete: function(results) {
    const rows = results.data
      .filter(row =>
        row.agegroup &&
        row.casualties !== undefined &&
        row.casualties !== ''
      )
      .map(row => ({
        agegroup: row.agegroup.trim(),
        casualties: Number(row.casualties)
      }))
      .filter(row => Number.isFinite(row.casualties));

    const tbody = document.querySelector('#dataTable tbody');
    const labels = [];
    const values = [];

    rows.forEach(row => {
      const tr = document.createElement('tr');

      const ageCell = document.createElement('td');
      ageCell.textContent = row.agegroup;

      const countCell = document.createElement('td');
      countCell.textContent = row.casualties.toLocaleString();

      tr.append(ageCell, countCell);
      tbody.appendChild(tr);

      labels.push(row.agegroup);
      values.push(row.casualties);
    });

    const total = values.reduce((sum, n) => sum + n, 0);

    const knownRows = rows.filter(
      row => row.agegroup.toLowerCase() !== 'unknown'
    );

    const topGroup = knownRows.reduce(
      (top, row) =>
        !top || row.casualties > top.casualties ? row : top,
      null
    );

    const unknown = rows
      .filter(row => row.agegroup.toLowerCase() === 'unknown')
      .reduce((sum, row) => sum + row.casualties, 0);

    document.getElementById('totalCasualties').textContent =
      total.toLocaleString();

    document.getElementById('topAgeCount').textContent =
      topGroup ? topGroup.casualties.toLocaleString() : '—';

    document.getElementById('topAgeLabel').textContent =
      topGroup
        ? `Most represented known age group: ${topGroup.agegroup}`
        : 'Most represented known age group';

    document.getElementById('unknownPercent').textContent =
      total > 0 ? `${(unknown / total * 100).toFixed(1)}%` : '—';

    new Chart(document.getElementById('ageChart'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Casualties',
          data: values,
          backgroundColor: '#4e79a7',
          borderRadius: 6
        }]
      },

      options: {
        responsive: true,
        maintainAspecatio: false,

        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'x'
        },

        plugins: {
          legend: {
            display: false
          }
        },

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


