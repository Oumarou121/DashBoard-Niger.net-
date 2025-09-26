// Données fictives pour tester sans Firebase
const testOrders = [
  {
    timestamp: "2024-01-15",
    totalAmount: 120.5,
    products: [
      { name: "Smartphone", quantity: 2 },
      { name: "Casque Bluetooth", quantity: 1 },
    ],
  },
  {
    timestamp: "2024-02-10",
    totalAmount: 85.0,
    products: [{ name: "Clavier Mécanique", quantity: 1 }],
  },
  {
    timestamp: "2024-02-28",
    totalAmount: 200.0,
    products: [{ name: "Ordinateur Portable", quantity: 1 }],
  },
  {
    timestamp: "2024-03-05",
    totalAmount: 50.0,
    products: [{ name: "Souris Gaming", quantity: 1 }],
  },
  {
    timestamp: "2024-03-20",
    totalAmount: 100.0,
    products: [{ name: "Smartphone", quantity: 1 }],
  },
  {
    timestamp: "2024-03-25",
    totalAmount: 75.0,
    products: [{ name: "Casque Bluetooth", quantity: 2 }],
  },
];

const testCustomers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// 🌍 Récupérer les statistiques globales depuis les données fictives
function fetchGlobalStats() {
  let totalRevenue = 0;
  let totalOrders = testOrders.length;

  testOrders.forEach((order) => {
    totalRevenue += order.totalAmount;
  });

  document.getElementById("totalOrders").innerText = totalOrders;
  document.getElementById("totalCustomers").innerText = testCustomers.length;
  document.getElementById("totalRevenue").innerText = totalRevenue.toFixed(2);
}

// 📊 Simuler les ventes par mois
function fetchSalesData() {
  let salesData = {};

  testOrders.forEach((order) => {
    const date = new Date(order.timestamp);
    const month = date.toLocaleString("fr-FR", { month: "long" });

    salesData[month] = (salesData[month] || 0) + 1;
  });

  renderSalesChart(salesData);
}

// 📈 Affichage du graphique des ventes
function renderSalesChart(data) {
  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Ventes Mensuelles",
          data: Object.values(data),
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
  });
}

// 🏆 Simuler le top 5 des produits vendus
function fetchTopProducts() {
  let productSales = {};

  testOrders.forEach((order) => {
    order.products.forEach((product) => {
      productSales[product.name] =
        (productSales[product.name] || 0) + product.quantity;
    });
  });

  // Trier les produits et garder le top 5
  const sortedProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const table = document.getElementById("topProductsTable");
  table.innerHTML = "";
  sortedProducts.forEach(([name, quantity]) => {
    table.innerHTML += `<tr><td>${name}</td><td>${quantity}</td></tr>`;
  });
}

// 📢 Lancer le chargement des données fictives
fetchGlobalStats();
fetchSalesData();
fetchTopProducts();
