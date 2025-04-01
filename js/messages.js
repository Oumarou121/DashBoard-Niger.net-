document.addEventListener("DOMContentLoaded", function () {
  const messagesTable = document.getElementById("messagesTable");
  var messagesIndex = null;
  const team = ["Administrateur", "Support", "Livraison"];
  const modal = document.getElementById("custom-modal");
  const modalConfirm = document.getElementById("confirmModal");
  const addBtn = document.getElementById("add-btn");
  const saveBtn = document.getElementById("save-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const senderInput = document.getElementById("sender");
  const senderViewInput = document.getElementById("sender-view");
  const receiverInput = document.getElementById("receiver");
  const receiverBox = document.getElementById("sender-box");
  const receiverBoxView = document.getElementById("sender-box-view");
  const messageInput = document.getElementById("message");

  const truncateByLetters = (message, charLimit = 20) => {
    if (message.length > charLimit) {
      return message.slice(0, charLimit) + " ...";
    }
    return message;
  };

  messages.forEach((message) => {
    const row = document.createElement("tr");
    const bgColor =
      !message.isRead &&
      message.receiver &&
      team.includes(message.receiver.trim())
        ? "txt-primary"
        : "txt-default";

    row.classList.add("item", bgColor);

    row.innerHTML = `
    <td>${message.id}</td>
    <td>${message.sender}</td>
    <td>${truncateByLetters(message.message)}</td>
    <td>${message.receiver}</td>
    <td class="btn-td">
        <button class="infos">Infos</button>
    </td>
  `;

    row.querySelector(".infos").addEventListener("click", () => {
      openModal(message.id);
    });

    messagesTable.appendChild(row);
  });

  document.getElementById("search").addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase();
    filterMessages(searchValue);
  });

  function filterMessages(searchValue) {
    const rows = document.querySelectorAll(".item");

    rows.forEach((row) => {
      const sender = row.children[1].textContent.toLowerCase();
      const message = row.children[2].textContent.toLowerCase();
      const receiver = row.children[3].textContent.toLowerCase();

      if (
        sender.includes(searchValue) ||
        message.includes(searchValue) ||
        receiver.includes(searchValue)
      ) {
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

  function openModal(index) {
    messagesIndex = index;
    modal.classList.add("show");
    if (index !== null) {
      addBtn.style.display = "none";
      saveBtn.style.display = "block";
      deleteBtn.style.display = "block";
      receiverBox.style.display = "none";
      receiverBoxView.style.display = "block";
      const message = messages.filter((m) => m.id === index)[0];
      senderViewInput.value = message.sender;
      receiverInput.value = message.receiver;
      messageInput.value = message.message;
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
      addBtn.style.display = "block";
      saveBtn.style.display = "none";
      deleteBtn.style.display = "none";
      receiverBox.style.display = "block";
      receiverBoxView.style.display = "none";
      senderInput.value = "Administrateur";
      senderViewInput.value = "";
      receiverInput.value = "";
      messageInput.value = "";
    }
  }

  function closeModal() {
    messagesIndex = null;
    modal.classList.remove("show");
  }

  function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("alertModal").classList.add("show");
  }

  document.getElementById("open-modal").addEventListener("click", (e) => {
    e.preventDefault();
    openModal(null);
  });

  document.getElementById("close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  document.getElementById("add-btn").addEventListener("click", (e) => {
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

    console.log(newMessage);
  });
});

function closeAnyModal(button) {
  button.closest(".modal").classList.remove("show");
}
