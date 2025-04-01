document.addEventListener("DOMContentLoaded", function () {
  const productTable = document.getElementById("userTable");
  var usersIndex = null;
  const modal = document.getElementById("custom-modal");
  const modalSend = document.getElementById("custom-modal-send");
  const addBtn = document.getElementById("add-btn");
  const saveBtn = document.getElementById("save-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");
  const totalInput = document.getElementById("total");
  const firstNameInput = document.querySelector("#first-name");
  const lastNameInput = document.querySelector("#last-name");
  const phoneNumber1Input = document.querySelector("#phone-number1");
  const phoneNumber2Input = document.querySelector("#phone-number2");
  const regionSelect = document.querySelector("#region-select");
  const districtInput = document.querySelector("#district");
  const streetInput = document.querySelector("#street");
  const usersList = users.getUsers();
  const addAddressBtn = document.querySelector(".add-address");
  const addAddressContent = document.querySelector(".add-address-content");
  const addressList = document.getElementById("address-list");
  const userAddressesContent = document.getElementById(
    "user-addresses-content"
  );
  const modalDelete = document.getElementById("address-modal-delete");
  const modalEdit = document.getElementById("address-modal");
  const modalConfirm = document.getElementById("confirmModal");
  const confirmDelete = document.getElementById("deleteAddress");

  usersList.forEach((user) => {
    const row = document.createElement("tr");
    row.classList.add("item");

    const address = user.addresses[user.currentIndex];
    const name = address.firstName + " " + address.lastName;

    row.innerHTML = `
    <td>${user.id}</td>
    <td>${name}</td>
    <td>${user.email}</td>
    <td>${user.role}</td>
    <td class="btn-td">
        <button class="infos">Infos</button>
        <button class="send">Send</button>
    </td>
  `;

    row.querySelector(".infos").addEventListener("click", () => {
      openModal(user.id);
    });

    row.querySelector(".send").addEventListener("click", () => {
      sendMessage(user);
    });
    productTable.appendChild(row);
  });

  document.getElementById("search").addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase();
    filterUsers(searchValue);
  });

  function filterUsers(searchValue) {
    const rows = document.querySelectorAll(".item");

    rows.forEach((row) => {
      const name = row.children[1].textContent.toLowerCase();
      const email = row.children[2].textContent.toLowerCase();
      console.log(name, email);

      if (name.includes(searchValue) || email.includes(searchValue)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  function openModalConfirm(message) {
    return new Promise((resolve) => {
      modalConfirm.classList.add("show");
      document.getElementById("p-confirm").innerHTML = message;

      const confirmBtn = document.getElementById("confirm-save");
      const cancelBtn = document.getElementById("cancel-save");

      function confirmHandler() {
        modalConfirm.classList.remove("show");
        resolve(true);
        cleanup();
      }

      function cancelHandler() {
        modalConfirm.classList.remove("show");
        resolve(false);
        cleanup();
      }

      function cleanup() {
        confirmBtn.removeEventListener("click", confirmHandler);
        cancelBtn?.removeEventListener("click", cancelHandler);
      }

      confirmBtn.addEventListener("click", confirmHandler);
      cancelBtn?.addEventListener("click", cancelHandler);
    });
  }

  function sendMessage(user) {
    modalSend.classList.add("show");
    const senderInput = document.getElementById("sender");
    const receiverInput = document.getElementById("receiver");
    const messageInput = document.getElementById("message");
    receiverInput.value = user.email;

    document.getElementById("send-btn").addEventListener("click", async (e) => {
      e.preventDefault();
      const sender = senderInput.value.trim();
      const receiver = receiverInput.value;
      const message = messageInput.value.trim();
      if (sender === "" || receiver === "" || message === "") {
        showAlert("Veuillez remplir tous les champs.");
        return;
      }

      const newMessage = new Message(
        messages.length,
        sender,
        receiver,
        message,
        Date.now(),
        false
      );
      const value = await openModalConfirm(
        "Are you sure you want to send this message?"
      );
      console.log("Send confirmed:", value, newMessage);
    });
  }

  function openModal(index = null) {
    addressList.innerHTML = "";
    usersIndex = index;
    if (usersIndex !== null) {
      addBtn.style.display = "none";
      saveBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
      const user = users.getUserById(usersIndex)[0];
      userAddressesContent.style.display = "block";
      addAddressBtn.style.display = "block";
      chargeData(user);
      addAddressBtn.addEventListener("click", () => {
        openModalEdit(user);
      });

      document
        .getElementById("save-btn")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          const value = await openModalConfirm(
            "Are you sure you want to apply this update?"
          );
          console.log("Save confirmed:", value);
        });

      document
        .getElementById("delete-btn")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          const value = await openModalConfirm(
            "Are you sure you want to delete this account?"
          );
          console.log("Delete confirmed:", value);
        });
    } else {
      addBtn.style.display = "inline-block";
      saveBtn.style.display = "none";
      deleteBtn.style.display = "none";
      userAddressesContent.style.display = "none";
      addAddressBtn.style.display = "none";
      emailInput.value = "";
      roleInput.value = "client";
      totalInput.value = 0;
      addAddressContent.style.display = "block";
      emailInput.removeAttribute("readonly");
    }
    modal.classList.add("show");
    Array.from(addAddressContent.getElementsByTagName("input")).forEach(
      (input) => {
        input.value = "";
      }
    );

    Array.from(addAddressContent.getElementsByTagName("select")).forEach(
      (select) => {
        select.value = "";
      }
    );
  }

  function closeModal() {
    usersIndex = null;
    modal.classList.remove("show");
  }

  function openModalDelete(user, index) {
    modalDelete.classList.add("show");
    document.getElementById("delete-content").innerHTML = `
      Are you sure you want to delete the address ${user.addresses[index].firstName} ${user.addresses[index].lastName}, ${user.addresses[index].district} 
      ${user.addresses[index].street} ${user.addresses[index].phoneNumber1} Niamey?
    `;
    confirmDelete.addEventListener("click", () => {
      alert(`Delete Address ${index}`);
      modalDelete.classList.remove("show");
      chargeData(user);
    });
  }

  function openModalEdit(user, address = null, index = null) {
    modalEdit.classList.add("show");
    const firstNameInputEdit = document.querySelector("#first-name-edit");
    const lastNameInputEdit = document.querySelector("#last-name-edit");
    const phoneNumber1InputEdit = document.querySelector("#phone-number1-edit");
    const phoneNumber2InputEdit = document.querySelector("#phone-number2-edit");
    const regionSelectEdit = document.querySelector("#region-select-edit");
    const districtInputEdit = document.querySelector("#district-edit");
    const streetInputEdit = document.querySelector("#street-edit");
    if (address && index !== null) {
      firstNameInputEdit.value = address.firstName;
      lastNameInputEdit.value = address.lastName;
      phoneNumber1InputEdit.value = address.phoneNumber1;
      phoneNumber2InputEdit.value = address.phoneNumber2;
      regionSelectEdit.value = address.region;
      districtInputEdit.value = address.district;
      streetInputEdit.value = address.street;
    } else {
      firstNameInputEdit.value = "";
      lastNameInputEdit.value = "";
      phoneNumber1InputEdit.value = "";
      phoneNumber2InputEdit.value = "";
      regionSelectEdit.value = "";
      districtInputEdit.value = "";
      streetInputEdit.value = "";
    }

    document.getElementById("submitAddress").addEventListener("click", () => {
      if (
        firstNameInputEdit.value === "" ||
        lastNameInputEdit.value === "" ||
        phoneNumber1InputEdit.value === "" ||
        regionSelectEdit.value === "" ||
        districtInputEdit.value === "" ||
        streetInputEdit.value === ""
      ) {
        showAlert("Veuillez remplir tous les champs");
        return;
      }
      const address = {
        firstName: firstNameInputEdit.value,
        lastName: lastNameInputEdit.value,
        phoneNumber1: phoneNumber1InputEdit.value,
        phoneNumber2: phoneNumber2InputEdit.value,
        region: regionSelectEdit.value,
        district: districtInputEdit.value,
        street: streetInputEdit.value,
      };
      if (address && index !== null) {
        user.updateAddress(index, address);
      } else {
        user.addAddress(address);
      }
      chargeData(user);
      modalEdit.classList.remove("show");
    });
  }

  function chargeData(user) {
    addressList.innerHTML = "";
    email.value = user.email;
    role.value = user.role;
    total.value = Number(user.total);
    user.getAddresses().length > 0
      ? (addAddressContent.style.display = "none")
      : "block";
    user.getAddresses().forEach((address, index) => {
      const addressItem = document.createElement("div");
      addressItem.classList.add("address-card");
      if (index === user.currentIndex) {
        addressItem.classList.add("active");
      }

      addressItem.innerHTML = `
                <div class="addressContent">
                  <input id="address-${index}" type="radio" name="selectedAddress" value="${index}" ${
        index === user.currentIndex ? "checked" : ""
      } />
                  <label for="address-${index}">
                    <div class="address-info">
                      <h4>${address.firstName} ${address.lastName}</h4>
                      <p><strong>Téléphone :</strong> ${address.phoneNumber1} ${
        address.phoneNumber2 ? ` / ${address.phoneNumber2}` : ""
      }</p>
                      <p><strong>Adresse :</strong> ${address.street}, ${
        address.district
      }, ${address.region}, Niger</p>
                    </div>
                  </label>
                </div>
                <div class="options">
                  <i class="fas fa-ellipsis-v option-btn" data-index="${index}"></i>
                  <div class="dropdown-menu" id="menu-${index}">
                    <button class="edit-btn" data-index="${index}">Modifier</button>
                    <button class="delete-btn" data-index="${index}">Supprimer</button>
                  </div>
                </div>
            `;

      addressItem
        .querySelector(`input[name="selectedAddress"]`)
        .addEventListener("change", () => {
          document.querySelectorAll(".address-card").forEach((card) => {
            card.classList.remove("active");
          });
          addressItem.classList.add("active");
        });

      addressItem.querySelector(".option-btn").addEventListener("click", () => {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.style.display = "none";
        });
        document.getElementById(`menu-${index}`).style.display = "block";
      });

      addressItem
        .querySelector(".delete-btn")
        .addEventListener("click", (e) => {
          e.preventDefault();
          openModalDelete(user, index);
        });

      addressItem.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.preventDefault();
        openModalEdit(user, address, index);
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest(".options")) {
          document.querySelectorAll(".dropdown-menu").forEach((menu) => {
            menu.style.display = "none";
          });
        }
      });

      addressList.appendChild(addressItem);
    });
  }

  function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("alertModal").classList.add("show");
  }

  document.getElementById("open-modal").addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  document.getElementById("close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  document.getElementById("add-btn").addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const role = roleInput.value;
    const total = totalInput.value.trim();
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const phoneNumber1 = phoneNumber1Input.value.trim();
    const phoneNumber2 = phoneNumber2Input.value.trim();
    const region = regionSelect.value;
    const district = districtInput.value.trim();
    const street = streetInput.value.trim();
    if (
      !email ||
      !role ||
      !firstName ||
      !lastName
      // !phoneNumber1 ||
      // !region ||
      // !district ||
      // !street
    ) {
      showAlert("Please fill all the required fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address");
      return;
    }

    if (isNaN(Number(total)) || Number(total) < 0) {
      showAlert("Total must be a valid positive number");
      return;
    }
    const address = new Address(
      firstName,
      lastName,
      phoneNumber1,
      phoneNumber2,
      region,
      district,
      street
    );
    const user = new User(usersList.length, email, [address], role, total);
    console.log(user);
    closeModal();
  });
});

function closeAnyModal(button) {
  button.closest(".modal").classList.remove("show");
}
