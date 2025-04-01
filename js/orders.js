document.addEventListener("DOMContentLoaded", function () {
  const ordersTable = document.getElementById("ordersTable");
  const searchInput = document.getElementById("search-orders");
  const filterCheckboxes = document.querySelectorAll(
    ".filter input[type='checkbox']"
  );
  const sortButtons = document.querySelectorAll(".sort-btn");
  const productsContent = document.getElementById("products-content");
  const modal = document.getElementById("custom-modal");
  const modalConfirm = document.getElementById("confirmModal");
  const updateContent = document.querySelector(".updateAll");

  const statusTranslations = {
    pending: "En attente d'expédition",
    shipping: "En cours d'expédition",
    progressed: "En cours de livraison",
    "progressed-returned": "Retour en cours",
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
    "progressed-returned": "txt-light-orange",
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

  const statusOptions = {
    pending: ["shipping", "dismiss-delivered"],
    shipping: ["progressed"],
    progressed: ["delivered", "report-delivered"],
    "progressed-returned": ["returned", "report-returned"],
    checking: ["progressed-returned", "dismiss-returned"],
    "report-returned": ["progressed-returned"],
    "report-delivered": ["progressed"],
  };

  let orders = ordersManager.getOrders();
  let currentSort = { criteria: null, order: "asc" };
  var orderId = null;

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

  function updateStatusSelect(status, newStatusSelect, delayInput) {
    newStatusSelect.innerHTML = `
      <option value="" disabled selected hidden>New Status</option>
      ${
        statusOptions[status]
          ?.map((option) => `<option value="${option}">${option}</option>`)
          .join("") || ""
      }
    `;
  }

  function managerUpdateAll(status) {
    if (status) {
      updateContent.style.display = "block";
      const selectBox = updateContent.querySelector(".select-box");
      const newStatusSelect = selectBox.querySelector(".newStatus");
      const rejectReasonContainer = updateContent.querySelector(
        ".rejectReasonContainer"
      );
      const delayInput = selectBox.querySelector("input[type=number]");
      const reasonInput = rejectReasonContainer.querySelector("textarea");
      reasonInput.value = "";
      delayInput.style.display = "none";

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

      updateStatusSelect(status, newStatusSelect, delayInput);

      newStatusSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        delayInput.style.display = ["progressed", "report", "checking"].some(
          (status) => value.includes(status)
        )
          ? "block"
          : "none";
        rejectReasonContainer.style.display = value.includes("dismiss")
          ? "block"
          : "none";
      });
      rejectReasonContainer
        .querySelector("select")
        .addEventListener("change", function () {
          if (this.value === "autre") {
            reasonInput.style.display = "block";
            reasonInput.focus();
          } else {
            reasonInput.style.display = "none";
            reasonInput.value = this.value;
          }
        });
    } else {
      updateContent.style.display = "none";
    }
  }

  function openModal(index) {
    document.body.classList.add("no-scroll");
    orderId = index;
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
    var sameStatus = null;
    productsContent.innerHTML = "";
    orderSummary.innerHTML = "";

    items.forEach((item) => {
      var date1 = null;
      var date2 = null;
      const date = item.history.at(-1).updateAt;
      const status = item.history.at(-1).status;
      const translatedStatus = statusTranslations[status] || status;
      const txtColor = statusColors[status] || "txt-default";
      const isChecking = status === "checking";

      if (sameStatus === null) {
        sameStatus = status;
      } else if (status !== sameStatus) {
        sameStatus = false;
      }

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
        date1 = date;
      } else if (
        [
          "progressed",
          "progressed-returned",
          "checking",
          "report-returned",
          "report-delivered",
        ].includes(status)
      ) {
        date1 = date;
        date2 = item.history.at(-1).endingAt;
      } else if (status === "delivered") {
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
              ${isChecking ? `<p class="justification">Justificatif</p>` : ""}
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
              <select name="newStatus" class="newStatus" required>
                <option value="" disabled selected hidden>
                  New Status
                </option>
              </select>
              <input name="delay" type="number" placeHolder="Delay Max" />
            </div>
          </div>
          <div class="rejectReasonContainer">
            <span>Motif de rejet :</span>
            <select name="rejectReasonSelect" class="rejectReasonSelect">
              <option value="" disabled selected hidden>Choisissez un motif</option>
              <option value="Produit en rupture de stock">Produit en rupture de stock</option>
              <option value="Adresse de livraison incorrecte">Adresse de livraison incorrecte</option>
              <option value="Problème de paiement">Problème de paiement</option>
              <option value="autre">Autre (spécifiez ci-dessous)</option>
            </select>

            <textarea name="rejectReason" class="rejectReason" placeholder="Autre motif..." style="display: none;"></textarea>
          </div>

        </div>
      </div>
    `;

      const selectBox = product.querySelector(".select-box");
      const newStatusSelect = product.querySelector(".newStatus");
      const rejectReasonContainer = product.querySelector(
        ".rejectReasonContainer"
      );
      const delayInput = product.querySelector("input[type=number]");
      delayInput.style.display = "none";
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

      updateStatusSelect(status, newStatusSelect, delayInput);

      newStatusSelect.addEventListener("change", (e) => {
        const value = e.target.value;

        delayInput.style.display = ["progressed", "report", "checking"].some(
          (status) => value.includes(status)
        )
          ? "block"
          : "none";

        if (value.includes("dismiss")) {
          rejectReasonContainer.style.display = "block";
          delayInput.style.display = "none";
        } else {
          rejectReasonContainer.style.display = "none";
        }
      });

      product
        .querySelector(".rejectReasonSelect")
        .addEventListener("change", function () {
          const rejectReason = product.querySelector(".rejectReason");
          if (this.value === "autre") {
            rejectReason.style.display = "block";
            rejectReason.focus();
          } else {
            rejectReason.style.display = "none";
            rejectReason.value = this.value;
          }
        });

      product.querySelector(".justification")?.addEventListener("click", () => {
        const quantity = 5;
        const reason = "Adresse de livraison incorrecte";
        const imageUrl =
          "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311";

        document.getElementById("modalQuantity").textContent = quantity;
        document.getElementById("modalReason").textContent = reason;
        document.getElementById("modalImage").src = imageUrl;

        document.getElementById("rejectModal").style.display = "flex";

        document
          .getElementById("closeModalBtn")
          .addEventListener("click", function () {
            document.getElementById("rejectModal").style.display = "none";
          });
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

    managerUpdateAll(sameStatus);
  }

  function closeModal() {
    document.body.classList.remove("no-scroll");
    modal.classList.remove("show");
    orderId = null;
  }

  document.getElementById("close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("alertModal").style.display = "flex";
  }

  document.getElementById("closeAlert").addEventListener("click", () => {
    document.getElementById("alertModal").style.display = "none";
  });

  function showAlertConfirm(message) {
    modalConfirm.style.display = "flex";
    document.getElementById("p-confirm").innerHTML = message;

    return new Promise((resolve) => {
      document.getElementById("confirm-save").addEventListener("click", () => {
        modalConfirm.style.display = "none";
        resolve(true);
      });

      document.getElementById("cancel-save").addEventListener("click", () => {
        modalConfirm.style.display = "none";
        resolve(false);
      });
    });
  }

  function returnHistoryItem(content, index) {
    const select = content.querySelector(".select-box select");
    const input = content.querySelector(".select-box input");
    const rejectReasonContainer = content.querySelector(
      ".rejectReasonContainer"
    );
    var status = null;
    var updateAt = Date.now();
    var endingAt = null;
    var justification = null;
    var guarantee = null;

    if (select.style.display !== "none") {
      if (select.value !== "") {
        status = select.value;
        if (status === "delivered") {
          const order = ordersManager.getOrderById(orderId)[0];
          const item = order.getItems()[index];
          const productId = item.productId;
          const product = products.filter((p) => p.id === productId)[0];
          const productGuarantee = product.specs.Guarantee
            ? Number(product.specs.Guarantee.split(" ")[0]) || 0
            : 0;
          guarantee = Date.now() + productGuarantee * 365 * 24 * 60 * 60 * 1000;
        }
      } else {
        return;
      }
    }

    if (input.style.display !== "none") {
      if (input.value !== "") {
        endingAt = updateAt + Number(input.value) * 24 * 60 * 60 * 1000;
      } else {
        return;
      }
    }

    if (rejectReasonContainer.style.display !== "none") {
      const select = rejectReasonContainer.querySelector("select");
      const input = rejectReasonContainer.querySelector("textarea");
      if (select.value !== "") {
        if (select.value === "autre") {
          justification = input.value;
        } else {
          justification = select.value;
        }
      } else {
        return;
      }
    }

    return new orderItemHistory(
      status,
      updateAt,
      endingAt,
      guarantee,
      justification
    );
  }

  document.getElementById("save-btn").addEventListener("click", async (e) => {
    e.preventDefault();

    if (
      updateContent.style.display !== "none" &&
      updateContent.querySelector(".select-box select").value !== ""
    ) {
      const select = updateContent.querySelector(".select-box select");
      const input = updateContent.querySelector(".select-box input");
      const rejectReasonContainer = updateContent.querySelector(
        ".rejectReasonContainer"
      );

      let status = select.style.display !== "none" ? select.value : null;
      let updateAt = Date.now();
      let endingAt =
        input.style.display !== "none" && input.value
          ? updateAt + Number(input.value) * 24 * 60 * 60 * 1000
          : null;
      let justification = null;
      if (rejectReasonContainer.style.display !== "none") {
        justification = getJustification(rejectReasonContainer);
        if (!justification)
          return showAlert("Veuillez remplir tous les champs");
      }

      let guarantee = getGuarantees(status);

      if (!status) return showAlert("Veuillez remplir tous les champs");

      let historyItems = buildHistoryItems(
        status,
        updateAt,
        endingAt,
        guarantee,
        justification
      );
      let message = generateConfirmationMessage(historyItems, true);

      if (await showAlertConfirm(message)) {
        console.log("L'utilisateur a confirmé !");
      } else {
        console.log("L'utilisateur a annulé.");
      }
    } else {
      let historyItems = new Map();
      modal.querySelectorAll(".product-content").forEach((content, index) => {
        const historyItem = returnHistoryItem(content, index);
        if (historyItem) historyItems.set(index, historyItem);
      });

      if (historyItems.size === 0)
        return showAlert("Veuillez remplir tous les champs");

      let message = generateConfirmationMessage(historyItems);
      if (await showAlertConfirm(message)) {
        console.log("L'utilisateur a confirmé !");
      } else {
        console.log("L'utilisateur a annulé.");
      }
    }
  });

  function getJustification(container) {
    if (container.style.display === "none") return null;
    const select = container.querySelector("select");
    const input = container.querySelector("textarea");
    console.log(input.value);
    return select.value === "autre"
      ? input.value !== ""
        ? input.value
        : null
      : select.value;
  }

  function getGuarantees(status) {
    if (status !== "delivered") return [];
    return ordersManager
      .getOrderById(orderId)[0]
      .getItems()
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const guaranteeDuration = product?.specs?.Guarantee
          ? Number(product.specs.Guarantee.split(" ")[0]) || 0
          : 0;
        return Date.now() + guaranteeDuration * 365 * 24 * 60 * 60 * 1000;
      });
  }

  function buildHistoryItems(
    status,
    updateAt,
    endingAt,
    guarantee,
    justification
  ) {
    if (status === "delivered") {
      return guarantee.map(
        (g) =>
          new orderItemHistory(status, updateAt, endingAt, g, justification)
      );
    }
    return [
      new orderItemHistory(status, updateAt, endingAt, null, justification),
    ];
  }

  function generateConfirmationMessage(historyItems, isAll = false) {
    let message = "Voulez-vous sauvegarder les modifications suivantes ?<br>";

    historyItems.forEach((value, key) => {
      if (isAll) {
        message += `<br>📌 Tous les produits <br>`;
      } else {
        message += `<br>📌 Produit ${key + 1} :<br>`;
      }
      message += `    Statut : ${value.status}<br>`;
      message += `    Modifié le : ${new Date(
        value.updateAt
      ).toLocaleString()}<br>`;
      if (value.endingAt)
        message += `    Fin prévue : ${new Date(
          value.endingAt
        ).toLocaleString()}<br>`;
      if (value.guarantee) message += `   Garantie : ${value.guarantee}<br>`;
      if (value.justification)
        message += `   Justification : ${value.justification}<br>`;
    });

    return message;
  }
});

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function closeAnyModal(button) {
  button.closest(".modal").classList.remove("show");
}
