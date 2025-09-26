const salesData = {
  "2024-01": 500, // Janvier 2024 → 500€
  "2024-02": 800, // Février 2024 → 800€
  "2024-03": 1200, // Mars 2024 → 1200€
  "2024-04": 950, // Avril 2024 → 950€
  "2024-05": 1300, // Mai 2024 → 1300€
  "2024-06": 1600, // Juin 2024 → 1600€
};

async function renderChart() {
  const labels = Object.keys(salesData);
  const data = Object.values(salesData);

  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "line", // Line chart
    data: {
      labels: labels,
      datasets: [
        {
          label: "Ventes Mensuelles (€)",
          data: data,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderWidth: 2,
        },
      ],
    },
  });
}

renderChart();

async function updateSummary() {
  const totalSales = Object.values(salesData).reduce(
    (sum, val) => sum + val,
    0
  );

  document.getElementById("totalSales").innerText = totalSales + " €";
  document.getElementById("totalOrders").innerText =
    Object.keys(salesData).length;
}

updateSummary();

function renderOrdersChart(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const ctx = document.getElementById("ordersChart").getContext("2d");
  new Chart(ctx, {
    type: "bar", // Graphique en barres
    data: {
      labels: labels,
      datasets: [
        {
          label: "Nombre de Commandes",
          data: values,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
  });
}

function updateOrdersTable(data) {
  let tableBody = document.getElementById("ordersTable");
  tableBody.innerHTML = "";

  Object.keys(data).forEach((month) => {
    let row = `<tr><td>${month}</td><td>${data[month]}</td></tr>`;
    tableBody.innerHTML += row;
  });
}

const ordersCountByMonth = {
  Janvier: 120,
  Février: 98,
  Mars: 150,
  Avril: 180,
  Mai: 200,
  Juin: 170,
  Juillet: 210,
  Août: 190,
  Septembre: 160,
  Octobre: 220,
  Novembre: 250,
  Décembre: 300,
};

// Tester les fonctions avec ces données
renderOrdersChart(ordersCountByMonth);
updateOrdersTable(ordersCountByMonth);
