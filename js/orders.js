document.addEventListener("DOMContentLoaded", function () {
  const ordersTable = document.getElementById("ordersTable");
  const searchInput = document.getElementById("search-orders");
  const filterCheckboxes = document.querySelectorAll(
    ".filter input[type='checkbox']"
  );
  const sortButtons = document.querySelectorAll(".sort-btn");
  const productsContent = document.getElementById("products-content");
  const modal = document.getElementById("custom-modal");

  const statusTranslations = {
    pending: "En attente d'expédition",
    shipping: "En cours d'expédition",
    progressed: "En cours de livraison",
    delivered: "Livré",
    checking: "En vérification",
    cancelled: "Annulé",
    returned: "Retourné",
    "report-returned": "Retour reporté",
    "dismiss-delivered": "Livraison rejetée",
    "report-delivered": "Livraison reportée",
    "dismiss-returned": "Retour rejeté",
    postponed: "Commande reportée",
  };

  const statusColors = {
    pending: "txt-yellow",
    shipping: "txt-light-blue",
    progressed: "txt-blue",
    delivered: "txt-green",
    checking: "txt-purple",
    cancelled: "txt-red",
    returned: "txt-orange",
    "report-returned": "txt-dark-red",
    "dismiss-delivered": "txt-gray",
    "report-delivered": "txt-dark-green",
    "dismiss-returned": "txt-light-gray",
    postponed: "txt-brown",
  };

  let orders = ordersManager.getOrders();
  let currentSort = { criteria: null, order: "asc" };

  function renderOrders() {
    ordersTable.innerHTML = "";
    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.classList.add("item");

      const translatedStatus = statusTranslations[order.status] || order.status;
      const bgColor = statusColors[order.status] || "txt-default";
      const customerName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
      row.innerHTML = `
            <td>${order.id}</td>
            <td>${customerName}</td>
            <td class="${bgColor}">${translatedStatus}</td>
            <td>${formatDate1(order.updateAt)}</td>
            <td>${formatPrice(order.totalPrice)}</td>
            <td><button class="infos">Infos</button></td>
          `;

      row
        .querySelector(".infos")
        .addEventListener("click", () => openModal(order.id));
      ordersTable.appendChild(row);
    });
  }

  function filterOrders() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedStatuses = Array.from(filterCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.id);

    orders = ordersManager.getOrders().filter((order) => {
      const orderId = order.id;
      const customerName =
        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase();
      const status = order.status.toLowerCase();

      const matchesSearch =
        orderId === searchValue ||
        customerName.includes(searchValue) ||
        status.includes(searchValue);
      const matchesFilter =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(order.status);

      return matchesSearch && matchesFilter;
    });
    sortOrders();
    renderOrders();
  }

  function sortOrders() {
    if (!currentSort.criteria) return;

    orders.sort((a, b) => {
      let valA = a[currentSort.criteria];
      let valB = b[currentSort.criteria];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      return currentSort.order === "asc"
        ? valA > valB
          ? 1
          : -1
        : valA < valB
        ? 1
        : -1;
    });
    renderOrders();
  }

  function handleSort(event) {
    const criteria = event.target.dataset.criteria;
    const currentArrow = document.getElementById(`${criteria}-arrow`);

    if (currentSort.criteria === criteria) {
      currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
    } else {
      currentSort.criteria = criteria;
      currentSort.order = "asc";
    }

    sortOrders();
    updateArrows();
  }

  function updateArrows() {
    const arrows = document.querySelectorAll(".arrow");
    arrows.forEach((arrow) => arrow.classList.remove("up", "down"));

    if (currentSort.criteria) {
      const currentArrow = document.getElementById(
        `${currentSort.criteria}-arrow`
      );
      currentArrow.classList.add(currentSort.order === "asc" ? "up" : "down");
    }
  }

  searchInput.addEventListener("input", debounce(filterOrders, 300));
  filterCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener("change", filterOrders)
  );
  sortButtons.forEach((button) => button.addEventListener("click", handleSort));

  renderOrders();

  function openModal(index) {
    modal.classList.add("show");
    const order = ordersManager.getOrderById(index)[0];
    const items = order.getItems();
    document.getElementById("title").innerHTML = `Order #${order.id}`;
    document.getElementById("sub-total").innerHTML =
      formatPrice(order.totalPrice) + " FCFA";
    document.getElementById("shipping-total").innerHTML =
      formatPrice(order.deliveryPrice) + " FCFA";
    document.getElementById("total").innerHTML =
      formatPrice(order.totalPrice + order.deliveryPrice) + " FCFA";
    const orderSummary = document.getElementById("payment-status");
    var nbrItem = 0;
    productsContent.innerHTML = "";
    orderSummary.innerHTML = "";

    items.forEach((item, index) => {
      var date1 = null;
      var date2 = null;
      const date = item.history.at(-1).updateAt;
      const status = item.history.at(-1).status;
      const translatedStatus = statusTranslations[status] || status;
      const txtColor = statusColors[status] || "txt-default";

      let prevPriceHtml = "";
      if (item.priceReduction > 0) {
        prevPriceHtml = `
            <span class="prev-price">
                <span id="previewPrice">-${formatPrice(
                  item.priceReduction
                )} FCFA</span>
            </span>
        `;
      }

      if (
        [
          "pending",
          "shipping",
          "cancelled",
          "returned",
          "dismiss-delivered",
          "dismiss-returned",
        ].includes(status)
      ) {
        console.log("1");
        date1 = date;
      } else if (
        [
          "progressed",
          "checking",
          "report-returned",
          "report-delivered",
        ].includes(status)
      ) {
        console.log("2");
        date1 = date;
        date2 = item.history.at(-1).endingAt;
      } else if (status === "delivered") {
        console.log("3");
        date1 = date;
      }

      const product = document.createElement("div");
      product.classList.add("products-section");
      product.innerHTML = `
      <div class="product">
        <div class="product-image">
          <img src="${item.image}" alt="${item.productName}" />
          ${prevPriceHtml}
        </div>
        <div class="product-content">
          <div class="content">
            <div class="name-content">
              <a href="product.html?id=${item.productId}" class="text-red">${
        item.productName
      }</a>
              <p class="text-gray">Couleur : ${
                item.color ? item.color : "Non spécifiée"
              }</p>
              <p>Statut : <span class="status ${txtColor}">${translatedStatus}</span></p>
            </div>
            <div class="price-content">
              <span class="text-red">${formatPrice(item.price)} FCFA</span>
              ${
                item.quantity > 1
                  ? `<span class="text-red"> x ${item.quantity}</span>`
                  : ""
              }
            </div>
          </div>
          <div class="order-info">
            <p><span class="delivery-date">${formatDateOrder(
              date1,
              date2
            )}</span></p>
            <div class="select-box">
              <select name="newStatus" id="newStatus" required>
                <option value="" disabled selected hidden>
                  New Status
                </option>
              </select>
              <input type="number" placeHolder="Delay Max" />
            </div>
          </div>
          <div id="rejectReasonContainer">
            <label for="rejectReasonSelect">Motif de rejet :</label>
            <select id="rejectReasonSelect">
              <option value="" disabled selected hidden>Choisissez un motif</option>
              <option value="Produit en rupture de stock">Produit en rupture de stock</option>
              <option value="Adresse de livraison incorrecte">Adresse de livraison incorrecte</option>
              <option value="Problème de paiement">Problème de paiement</option>
              <option value="autre">Autre (spécifiez ci-dessous)</option>
            </select>

            <textarea id="rejectReason" placeholder="Autre motif..." style="display: none;"></textarea>
          </div>

        </div>
      </div>
    `;

      const selectBox = product.querySelector(".select-box");
      const newStatusSelect = product.querySelector("#newStatus");
      const rejectReasonContainer = product.querySelector(
        "#rejectReasonContainer"
      );
      const delayInput = product.querySelector("input[type=number]");

      if (
        [
          "delivered",
          "cancelled",
          "returned",
          "dismiss-delivered",
          "dismiss-returned",
        ].includes(status)
      ) {
        selectBox.style.display = "none";
      }

      if (status === "pending") {
        newStatusSelect.innerHTML = `
          <option value="" disabled selected hidden>New Status</option>
          <option value="shipping">Shipping</option>
          <option value="dismiss-delivered">Dismiss-Delivered</option>
        `;
        delayInput.style.display = "none";
      }

      if (status === "shipping") {
        newStatusSelect.innerHTML = `
          <option value="" disabled selected hidden>New Status</option>
          <option value="progressed">Progressed</option>
        `;
      }

      if (status === "progressed") {
        newStatusSelect.innerHTML = `
          <option value="" disabled selected hidden>New Status</option>
          <option value="delivered">Delivered</option>
          <option value="returned">Returned</option>
          <option value="report-delivered">Report Delivered</option>
          <option value="report-returned">Report Returned</option>
        `;
      }

      if (status === "checking") {
        newStatusSelect.innerHTML = `
          <option value="" disabled selected hidden>New Status</option>
          <option value="progressed">Progressed</option>
          <option value="dismiss-returned">Dismiss Returned</option>
        `;
      }

      if (status === "report-returned") {
        newStatusSelect.innerHTML = `
          <option value="" disabled selected hidden>New Status</option>
          <option value="progressed">Progressed</option>
        `;
      }

      if (status === "report-delivered") {
        newStatusSelect.innerHTML = `
          <option value="" disabled selected hidden>New Status</option>
          <option value="progressed">Progressed</option>
        `;
      }

      newStatusSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        if (value.includes("dismiss")) {
          rejectReasonContainer.style.display = "block";
        } else {
          rejectReasonContainer.style.display = "none";
        }
      });

      product
        .querySelector("#rejectReasonSelect")
        .addEventListener("change", function () {
          const rejectReason = document.getElementById("rejectReason");
          if (this.value === "autre") {
            rejectReason.style.display = "block"; 
            rejectReason.focus();
          } else {
            rejectReason.style.display = "none";
            rejectReason.value = this.value; 
          }
        });

      productsContent.appendChild(product);
      nbrItem += item.quantity;
    });

    const paymentStatus = document.createElement("div");
    if (order.payment === "cash") {
      paymentStatus.innerHTML = `
      <div class="payment-status pending">
        ⚠️ Payment Pending - Pay on Delivery
      </div>
    `;
    } else if (order.payment.includes("virtual-wallet")) {
      paymentStatus.innerHTML = `
      <div class="payment-status paid">
        ✅ Payment Confirmed - Paid by Virtual Wallet
        <a href="https://virtual-wallet.web.app/receipt.html?id=${order.payment}" class="receipt-link" target="_blank">Receipt</a>
      </div>
    `;
    } else {
      paymentStatus.innerHTML = `
      <div class="payment-status delivered">
        Payment Confirmed - Received
      </div>
    `;
    }
    orderSummary.appendChild(paymentStatus);
    const address = order.shippingAddress;
    document.getElementById("user-name").innerHTML =
      address.firstName + " " + address.lastName;
    document.getElementById("nbr-articles").innerHTML = `${nbrItem} article(s)`;
    document.getElementById("user-email").innerHTML = order.userEmail;
    document.getElementById("user-phone-number").innerHTML =
      address.phoneNumber1;
    document.getElementById("user-address").innerHTML = `
    <h2>Shipping Address</h2>
    <address>
      ${address.district} / ${address.street}
      <br />${address.phoneNumber1} / ${address.phoneNumber2}
      <br />${address.region} / Niger
    </address>
  `;
  }

  function closeModal() {
    modal.classList.remove("show");
  }

  document.getElementById("close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });
});

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
