const promotions = [
  {
    id: 1,
    title: "Promo Été -20%",
    discount: 20,
    type: "percentage", // Pourcentage de réduction
    products: ["Ordinateur Portable", "Casque Bluetooth"],
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    active: true,
  },
  {
    id: 2,
    title: "Réduction de 15€ sur les Smartphones",
    discount: 15,
    type: "fixed", // Réduction fixe en euros
    products: ["Smartphone"],
    startDate: "2024-04-15",
    endDate: "2024-05-15",
    active: true,
  },
  {
    id: 3,
    title: "Offre Spéciale -10% sur Tout le Site",
    discount: 10,
    type: "percentage",
    products: ["Tous"],
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    active: false,
  },
];

const promoCodes = [
  {
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    minPurchase: 50,
    expirationDate: "2024-12-31",
    active: true,
  },
  {
    code: "FREESHIP",
    discount: "Livraison Gratuite",
    type: "shipping",
    minPurchase: 30,
    expirationDate: "2024-06-30",
    active: true,
  },
  {
    code: "SAVE20",
    discount: 20,
    type: "fixed",
    minPurchase: 100,
    expirationDate: "2024-05-01",
    active: false,
  },
];

function renderPromotions() {
  const promoTable = document.getElementById("promotionsTable");
  promoTable.innerHTML = "";

  promotions.forEach((promo) => {
    promoTable.innerHTML += `
            <tr>
                <td>${promo.title}</td>
                <td>${promo.discount}${
      promo.type === "percentage" ? "%" : "€"
    }</td>
                <td>${promo.products.join(", ")}</td>
                <td>${promo.startDate} - ${promo.endDate}</td>
                <td>${promo.active ? "🟢" : "🔴"}</td>
            </tr>
        `;
  });
}

function renderPromoCodes() {
  const codesTable = document.getElementById("promoCodesTable");
  codesTable.innerHTML = "";

  promoCodes.forEach((code) => {
    codesTable.innerHTML += `
            <tr>
                <td>${code.code}</td>
                <td>${code.discount}${
      code.type === "percentage" ? "%" : code.type === "fixed" ? "€" : ""
    }</td>
                <td>${code.minPurchase}€</td>
                <td>${code.expirationDate}</td>
                <td>${code.active ? "🟢" : "🔴"}</td>
            </tr>
        `;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderPromotions();
  renderPromoCodes();
});
