document.addEventListener("DOMContentLoaded", function () {
  const heroSection = document.getElementById("hero-section");
  const trendingCategoriesSection = document.getElementById(
    "trending-categories-section"
  );
  const modal = document.getElementById("custom-modal");
  const previewModal = document.getElementById("custom-modal-preview");
  const addBtn = document.getElementById("add-btn");
  const saveBtn = document.getElementById("save-btn");
  const title = document.getElementById("title");
  const subTitle = document.getElementById("subTitle");
  const description = document.getElementById("description");
  const image = document.getElementById("image");
  const mainImagePreview = document.getElementById("imagePreview");
  const chooseMainImage = document.getElementById("chooseMainImage");
  const confirmModal = document.getElementById("confirmModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  var heroIndex = null;
  var trendingCategoryIndex = null;

  heroes.forEach((h) => {
    const row = document.createElement("tr");
    row.classList.add("item");

    row.innerHTML = `
    <td>${h.title}</td>
    <td>${h.subtitle}</td>
    <td class="btn-td">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
    </td>
  `;

    row.querySelector(".edit").addEventListener("click", () => {
      openModal(h.id);
    });

    row.querySelector(".delete").addEventListener("click", () => {
      heroIndex = h.id;
      confirmModal.style.display = "flex";
    });

    heroSection.appendChild(row);
  });

  // trendingCategories.forEach((c) => {
  //   const row = document.createElement("tr");
  //   row.classList.add("itemTC");

  //   row.innerHTML = `
  //   <td>
  //     <img src="${c.image}" alt="${c.name}">
  //     <h3>${c.name}</h3>
  //     <button class="edit">Edit</button>
  //   </td>
  // `;
  //   trendingCategoriesSection.appendChild(row);
  // });

  trendingCategories.forEach((c) => {
    const categoryCard = document.createElement("div");
    categoryCard.classList.add("category-card");

    categoryCard.innerHTML = `
      <img src="${c.image}" alt="${c.name}">
      <h3>${c.name}</h3>
      <button class="edit">Edit</button>
    `;
    
    trendingCategoriesSection.appendChild(categoryCard);
});

  function openModal(index) {
    heroIndex = index;
    modal.classList.add("show");
    if (index != null) {
      const hero = heroes.find((h) => h.id === index);
      addBtn.style.display = "none";
      saveBtn.style.display = "block";
      title.value = hero.title;
      subTitle.value = hero.subtitle;
      description.value = hero.description;
      mainImagePreview.src = hero.image;
      mainImagePreview.style.display = "block";
      chooseMainImage.style.display = "none";
    } else {
      addBtn.style.display = "block";
      saveBtn.style.display = "none";
    }
  }

  function closeModal() {
    heroIndex = null;
    title.value = "";
    subTitle.value = "";
    description.value = "";
    mainImagePreview.src = "";
    mainImagePreview.style.display = "none";
    chooseMainImage.style.display = "flex";
    modal.classList.remove("show");
  }

  function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("alertModal").style.display = "flex";
  }

  document.getElementById("closeAlert").addEventListener("click", () => {
    document.getElementById("alertModal").style.display = "none";
  });

  document.getElementById("close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  document.getElementById("add-hero").addEventListener("click", () => {
    openModal(null);
  });

  document.getElementById("add-hero-mobile").addEventListener("click", () => {
    openModal(null);
  });

  document.getElementById("preview-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const hero = heroes.find((h) => h.id === heroIndex);

    if (hero) {
      document.getElementById("preview-title").innerText = hero.title;
      document.getElementById("preview-subTitle").innerText = hero.subtitle;
      document.getElementById("preview-description").innerText =
        hero.description;
      document.getElementById("preview-shop-now").innerText = hero.buttonText;
      document.getElementById(
        "preview-image"
      ).style.backgroundImage = `url(${hero.image})`;
      previewModal.classList.add("show");
      previewModal
        .querySelectorAll(".animate-text")
        .forEach(function (element, index) {
          setTimeout(() => {
            element.classList.add("active");
          }, index * 300);
        });
    } else if (
      title.value != "" &&
      subTitle.value != "" &&
      description.value != "" &&
      mainImagePreview.src != ""
    ) {
      document.getElementById("preview-title").innerText = title.value;
      document.getElementById("preview-subTitle").innerText = subTitle.value;
      document.getElementById("preview-description").innerText =
        description.value;
      document.getElementById("preview-shop-now").innerText = "Shop Now";
      document.getElementById(
        "preview-image"
      ).style.backgroundImage = `url(${mainImagePreview.src})`;
      previewModal.classList.add("show");
      previewModal
        .querySelectorAll(".animate-text")
        .forEach(function (element, index) {
          setTimeout(() => {
            element.classList.add("active");
          }, index * 300);
        });
    }
  });

  previewModal.addEventListener("click", (e) => {
    if (e.target === previewModal) {
      previewModal.classList.remove("show");
      previewModal.querySelectorAll(".animate-text").forEach((element) => {
        element.classList.remove("active");
      });
    }
  });

  chooseMainImage.addEventListener("click", () => {
    image.click();
  });

  mainImagePreview.addEventListener("click", () => {
    image.click();
  });

  image.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        mainImagePreview.src = e.target.result;
        mainImagePreview.style.display = "block";
        chooseMainImage.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      title.value != "" &&
      subTitle.value != "" &&
      description.value != "" &&
      mainImagePreview.src != ""
    ) {
      const newHero = {
        id: heroes.length + 1,
        title: title.value,
        subtitle: subTitle.value,
        description: description.value,
        image: mainImagePreview.src,
        buttonText: "Shop Now",
      };
      console.log(newHero);
    } else {
      showAlert("Veuillez remplir tous les champs");
      return;
    }
  });

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const hero = heroes.find((h) => h.id === heroIndex);

    if (
      hero &&
      title.value != "" &&
      subTitle.value != "" &&
      description.value != "" &&
      mainImagePreview.src != ""
    ) {
      const newHero = {
        id: hero.id,
        title: title.value,
        subtitle: subTitle.value,
        description: description.value,
        image: mainImagePreview.src,
        buttonText: hero.buttonText,
      };
      console.log(newHero);
    } else {
      showAlert("Veuillez remplir tous les champs");
      return;
    }
  });

  confirmDeleteBtn.addEventListener("click", () => {
    alert(`Hero supprimé : ${heroIndex}`);
    confirmModal.style.display = "none";
    closeModal();
  });

  cancelDeleteBtn.addEventListener("click", () => {
    confirmModal.style.display = "none";
  });
});
