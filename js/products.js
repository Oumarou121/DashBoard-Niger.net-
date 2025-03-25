document.addEventListener("DOMContentLoaded", function () {
  const productTable = document.getElementById("productTable");
  const modal = document.getElementById("custom-modal");
  const addBtn = document.getElementById("add-btn");
  const editBtn = document.getElementById("save-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const otherSpecs = document.getElementById("other-specs");
  const container = document.getElementById("secondaryImagesContainer");
  const categorySelect = document.getElementById("category-select");
  const sousCategorySelect = document.getElementById("sous-category-select");
  const additionalSelectsContainer = document.querySelector(
    "#additional-selects-container .column"
  );
  const specsContent = document.getElementById("specs-content");
  var productIndex = null;
  let selectedFiles = [];

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.classList.add("item");

    const category = product.category.split("/").at(-1);

    row.innerHTML = `
    <td>${product.id}</td>
    <td>${product.sales}</td>
    <td>${product.name}</td>
    <td>${category}</td>
    <td>${formatPrice(product.price)}</td>
    <td>${product.qty}</td>
    <td>
        <button class="infos">Infos</button>
    </td>
  `;

    row.querySelector(".infos").addEventListener("click", () => {
      openModal(product.id);
    });
    productTable.appendChild(row);
  });

  function addSecondaryImage(imageSrc, file) {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("secondary-image");

    const img = document.createElement("img");
    img.src = imageSrc;
    imgContainer.appendChild(img);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-image");
    removeBtn.innerHTML = "×";
    removeBtn.onclick = function () {
      imgContainer.remove();

      // Supprimer l'image du tableau selectedFiles
      selectedFiles = selectedFiles.filter((f) => f !== file);
    };

    imgContainer.appendChild(removeBtn);
    document
      .getElementById("secondaryImagesContainer")
      .appendChild(imgContainer);
  }

  document.getElementById("chooseMainImage").addEventListener("click", () => {
    document.getElementById("mainImage").click();
  });

  document.getElementById("mainImagePreview").addEventListener("click", () => {
    document.getElementById("mainImage").click();
  });

  document
    .getElementById("mainImage")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          document.getElementById("mainImagePreview").src = e.target.result;
          document.getElementById("mainImagePreview").style.display = "block";
          document.getElementById("chooseMainImage").style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });

  document
    .getElementById("addSecondaryImage")
    .addEventListener("click", function () {
      document.getElementById("secondaryImages").click();
    });

  document
    .getElementById("secondaryImages")
    .addEventListener("change", function (event) {
      const files = Array.from(event.target.files);
      const container = document.getElementById("secondaryImagesContainer");

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          addSecondaryImage(e.target.result, file);
        };
        reader.readAsDataURL(file);
      });

      selectedFiles = [...selectedFiles, ...files];

      event.target.value = "";
    });

  filtres.generateFilters().forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  categorySelect.addEventListener("change", (e) => {
    additionalSelectsContainer.innerHTML = "";
    const selectedCategory = e.target.value;
    // console.log(selectedCategory);
    createOptions(filtres.generateFilters(), selectedCategory);
    updateSubCategories(selectedCategory, sousCategorySelect);
  });

  sousCategorySelect.addEventListener("change", (e) => {
    additionalSelectsContainer.innerHTML = "";
    const selectedSubCategoryPath = e.target.value;
    // console.log(selectedSubCategoryPath);
    createOptions(filtres.generateFilters(), selectedSubCategoryPath);
    generateSubCategorySelect(
      selectedSubCategoryPath,
      additionalSelectsContainer
    );
  });

  function updateSubCategories(category, selectElement) {
    const currentCategory = category.split("/").at(-1);
    const selectedCategory = filtres
      .generateFilters()
      .find((cat) => cat.name === currentCategory);

    if (selectedCategory) {
      selectElement.innerHTML =
        '<option value="" disabled selected hidden>Sélectionnez une sous-catégorie</option>';
      selectedCategory.getSubCategory().forEach((subCategory) => {
        const path = category + "/" + subCategory.name;
        const option = document.createElement("option");
        option.value = path;
        option.textContent = subCategory.name;
        selectElement.appendChild(option);
      });
    }
  }

  function generateSubCategorySelect(categoryPath, container) {
    const currentCategoryName = categoryPath.split("/").at(-1);
    const mainCategoryName = categoryPath.split("/")[0];

    const mainCategory = filtres
      .generateFilters()
      .find((cat) => cat.name === mainCategoryName);
    if (!mainCategory) return;

    const findSubCategory = (category, pathParts) => {
      if (pathParts.length === 0) return category;
      const nextSubCategory = category
        .getSubCategory()
        .find((sub) => sub.name === pathParts[0]);
      return nextSubCategory
        ? findSubCategory(nextSubCategory, pathParts.slice(1))
        : null;
    };

    const selectedSubCategory = findSubCategory(
      mainCategory,
      categoryPath.split("/").slice(1)
    );
    if (
      !selectedSubCategory ||
      selectedSubCategory.getSubCategory().length === 0
    )
      return;

    const selectBox = document.createElement("div");
    selectBox.classList.add("select-box");

    let optionsHTML = `<option value="" disabled selected hidden>Sélectionnez une sous-catégorie</option>`;
    selectedSubCategory.getSubCategory().forEach((subCategory) => {
      const path = categoryPath + "/" + subCategory.name;
      optionsHTML += `<option value="${path}">${subCategory.name}</option>`;
    });

    selectBox.innerHTML = `
    <label for="sous-category-select-${currentCategoryName}">Sous-catégorie de ${currentCategoryName}</label>
    <select id="sous-category-select-${currentCategoryName}" name="sub-category-${currentCategoryName}" required>
      ${optionsHTML}
    </select>
  `;

    container.appendChild(selectBox);

    selectBox.querySelector("select").addEventListener("change", (e) => {
      generateSubCategorySelect(e.target.value, container);
      createOptions(filtres.generateFilters(), e.target.value);
    });
  }

  function createOptions(categories, path) {
    const pathSegments = path.split("/");
    let specsMap = new Map();

    parcourCategory(categories, pathSegments, 0, specsMap);

    specsContent.innerHTML = "";
    specsMap.forEach((values, key) => {
      creationSpecs(key, values);
    });
  }

  function parcourCategory(categories, pathSegments, rang, specsMap) {
    if (!categories || rang >= pathSegments.length) return;

    const foundCategory = categories.find(
      (cat) => cat.name === pathSegments[rang]
    );

    if (foundCategory) {
      foundCategory.getOptions().forEach((option) => {
        const title = option.getTitle();
        const newValues = option.getValues();

        if (specsMap.has(title)) {
          const existingValues = specsMap.get(title);
          specsMap.set(title, [...new Set([...existingValues, ...newValues])]);
        } else {
          specsMap.set(title, newValues);
        }
      });

      parcourCategory(
        foundCategory.getSubCategory(),
        pathSegments,
        rang + 1,
        specsMap
      );
    }
  }

  function creationSpecs(key, values, defaultValue = null) {
    let isOther = defaultValue === null ? false : true;
    const specs = document.createElement("div");
    specs.classList.add("column");
    const selectBox = document.createElement("div");
    selectBox.classList.add("select-box");
    let select = document.createElement("select");
    select.required = true;
    if (defaultValue === null) {
      let defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.hidden = true;
      defaultOption.textContent = "Sélectionnez une option";
      select.appendChild(defaultOption);
    }
    values.forEach((value) => {
      let optionElement = document.createElement("option");
      optionElement.value = value;
      optionElement.textContent = value;
      select.appendChild(optionElement);
      if (value === defaultValue) {
        optionElement.selected = true;
        isOther = false;
      }
    });

    let otherOption = document.createElement("option");
    otherOption.value = "other";
    otherOption.textContent = "Autre...";
    select.appendChild(otherOption);
    let customInput = document.createElement("input");
    customInput.type = "text";
    customInput.name = "other";
    customInput.placeholder = "Entrez une valeur...";
    customInput.style.display = "none";
    customInput.style.marginTop = "5px";
    select.addEventListener("change", function () {
      if (select.value === "other") {
        customInput.classList.add("visible");
        customInput.required = true;
      } else {
        customInput.classList.remove("visible");
        customInput.required = false;
        customInput.value = "";
      }
    });
    if (isOther) {
      select.value = "other";
      customInput.classList.add("visible");
      customInput.value = defaultValue;
    }
    selectBox.appendChild(select);
    selectBox.appendChild(customInput);
    specs.innerHTML = `
        <div class="input-box">
          <input type="text" value="${key}" readonly />
        </div>
      `;
    specs.appendChild(selectBox);
    specsContent.appendChild(specs);
  }

  function openModal(index = null) {
    document.querySelectorAll("input[required]").forEach((input) => {
      if (input.disabled) {
        input.disabled = false;
      }
    });
    document.querySelectorAll("select[required]").forEach((input) => {
      if (input.disabled) {
        input.disabled = false;
      }
    });
    productIndex = index;
    console.log(productIndex);
    document.body.classList.add("no-scroll");
    modal.classList.add("show");
    if (index === null) {
      addBtn.style.display = "block";
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
      document.getElementById("modal-form").reset();
      additionalSelectsContainer.innerHTML = "";
      specsContent.innerHTML = "";
      otherSpecs.innerHTML = "";
      container.innerHTML = "";
      document.getElementById("mainImagePreview").src = "";
      document.getElementById("mainImagePreview").style.display = "none";
      document.getElementById("chooseMainImage").style.display = "flex";
    } else {
      addBtn.style.display = "none";
      editBtn.style.display = "block";
      deleteBtn.style.display = "block";
      chargeData(index);
    }
  }

  function closeModal() {
    productIndex = null;
    selectedFiles = [];
    document.body.classList.remove("no-scroll");
    modal.classList.remove("show");
    document.querySelectorAll("input[required]").forEach((input) => {
      if (input.offsetParent === null) {
        input.disabled = true;
      } else {
        input.disabled = false;
      }
    });
    document.querySelectorAll("select[required]").forEach((input) => {
      if (input.offsetParent === null) {
        input.disabled = true;
      } else {
        input.disabled = false;
      }
    });
  }

  document.getElementById("open-modal").addEventListener("click", () => {
    openModal(null);
  });
  document.getElementById("close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  function foundLastCategory() {
    let subCategoryAll = document.querySelectorAll(
      "#additional-selects-container select option:checked"
    );

    let selectedValue = Array.from(subCategoryAll)
      .map((option) => option.value)
      .at(-1);

    if (selectedValue) return selectedValue;

    selectedValue = document.getElementById("sous-category-select")?.value;
    if (selectedValue) return selectedValue;

    return document.getElementById("category-select")?.value || null;
  }

  function foundSpecs() {
    let specsMap = {};

    const columnOtherSpecs = otherSpecs.querySelectorAll(".column");
    columnOtherSpecs.forEach((column) => {
      const titleElement = column.querySelector(".input-box input");
      const title = titleElement ? titleElement.value : "";
      const valueElement = column.querySelector(".input-box.input-value input");
      const value = valueElement ? valueElement.value : "";
      specsMap[title] = value;
    });

    const columnSpecs = specsContent.querySelectorAll(".column");

    columnSpecs.forEach((column) => {
      const titleElement = column.querySelector(".input-box input[readonly]");
      const title = titleElement ? titleElement.value : "";

      const selectedOption = column.querySelector(
        ".select-box select option:checked"
      );
      const value = selectedOption ? selectedOption.value : "";

      if (value === "other") {
        const otherInput = column.querySelector(
          ".select-box input[name='other']"
        );
        const otherValue = otherInput ? otherInput.value : "";
        specsMap[title] = otherValue;
      } else {
        specsMap[title] = value;
      }
    });

    return specsMap;
  }

  function chargeData(index) {
    otherSpecs.innerHTML = "";
    const product = products.filter((p) => p.id === index)[0];
    if (!product) {
      console.error("Produit non trouvé !");
      return;
    }

    loadImages(product.images);

    document.getElementById("productName").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("priceReduction").value = product.priceReduction;
    document.getElementById("sales").value = product.sales;
    document.getElementById("qty").value = product.qty;

    const categoryList = product.category.split("/");

    if (categoryList[0]) {
      categorySelect.value = categoryList[0];
      let event1 = new Event("change");
      categorySelect.dispatchEvent(event1);
    }

    if (categoryList[1]) {
      sousCategorySelect.value = categoryList[0] + "/" + categoryList[1];
      let event2 = new Event("change");
      sousCategorySelect.dispatchEvent(event2);
    }

    let path = categoryList[0] + "/" + categoryList[1] + "/";
    let selects =
      additionalSelectsContainer.querySelectorAll(".select-box select");
    for (let i = 2; i < categoryList.length; i++) {
      select = selects[i - 2];
      select.value = path + categoryList[i];
      const currentEvent = new Event("change");
      select.dispatchEvent(currentEvent);
      path = select.value + "/";
      selects =
        additionalSelectsContainer.querySelectorAll(".select-box select");
    }

    const specs = product.specs;
    Object.entries(specs).forEach(([key, value]) => {
      const current = specsContent.querySelector(
        `.column .input-box input[value="${key}"]`
      );
      if (current) {
        const selectBox = current
          .closest(".column")
          .querySelector(".select-box");

        const select = selectBox.querySelector("select");
        const isOption = select.querySelector(
          `option[value="${CSS.escape(value)}"]`
        );
        if (isOption) {
          select.value = value;
        } else {
          select.value = "other";
          const customInput = selectBox.querySelector("input[name='other']");
          customInput.value = value;
          customInput.classList.add("visible");
          customInput.required = true;
        }
      } else {
        const column = document.createElement("div");
        column.classList.add("column");
        column.innerHTML = `
          <div class="input-box">
            <input type="text" value="${key}" readonly>
          </div>
          <div class="input-box input-value">
            <input type="text" value="${value}">
          </div>
        `;
        otherSpecs.appendChild(column);
      }
    });
  }

  function loadImages(imageUrls) {
    if (!imageUrls || imageUrls.length === 0) {
      console.error("Aucune image à charger !");
      return;
    }

    const mainImagePreview = document.getElementById("mainImagePreview");
    const chooseMainImage = document.getElementById("chooseMainImage");
    if (imageUrls[0]) {
      mainImagePreview.src = imageUrls[0];
      mainImagePreview.style.display = "block";
      chooseMainImage.style.display = "none";
    }

    const secondaryImagesContainer = document.getElementById(
      "secondaryImagesContainer"
    );
    secondaryImagesContainer.innerHTML = "";

    for (let i = 1; i < imageUrls.length; i++) {
      addSecondaryImage(imageUrls[i]);
    }
  }

  document.getElementById("add-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const data = recoveryDate();
    const emptyKeys = Object.entries(data.specs)
      .filter(
        ([key, value]) => value === "" || value === null || value === undefined
      )
      .map(([key]) => key);
    if (
      data.sales !== null &&
      data.qty !== null &&
      data.name !== null &&
      data.category !== null &&
      data.price !== null &&
      data.priceReduction !== null &&
      data.images.length > 1 &&
      data.images[0] &&
      data.specs &&
      emptyKeys.length === 0
    ) {
      //Savegarde du produit
      console.log(data);
    } else {
      alert("Veuillez remplire tous les champs");
    }
  });

  document.getElementById("save-btn").addEventListener("click", (e) => {
    e.preventDefault();
    recoveryDate();
    const data = recoveryDate();
    data.reviews = products[productIndex].reviews;
    const emptyKeys = Object.entries(data.specs)
      .filter(
        ([key, value]) => value === "" || value === null || value === undefined
      )
      .map(([key]) => key);
    if (
      data.id !== null &&
      data.sales !== null &&
      data.qty !== null &&
      data.name !== null &&
      data.category !== null &&
      data.price !== null &&
      data.priceReduction !== null &&
      data.images.length > 1 &&
      data.images[0] &&
      data.specs &&
      emptyKeys.length === 0
    ) {
      //Savegarde du produit
      console.log(data);
    } else {
      alert("Veuillez remplire tous les champs");
    }
  });

  document.getElementById("delete-btn").addEventListener("click", (e) => {
    e.preventDefault();
    alert(`delete product ${productIndex}`);
    closeModal();
  });

  function recoveryDate() {
    const name = document.getElementById("productName").value;
    const category = foundLastCategory();
    let images = [];

    const file = document.getElementById("mainImage").files[0];
    if (file) {
      //Savegarde de l'image principale dans sfirebase storage et recuperation du url
      console.log(file);
      const primaryUrl = `products/${category}/${name}/image0`;

      images[0] = primaryUrl;
    } else {
      const mainImagePreview = document.getElementById("mainImagePreview");
      if (mainImagePreview.src && mainImagePreview.style.display !== "none") {
        images[0] = mainImagePreview.src;
      }
    }

    //Images secondaires
    console.log(selectedFiles);
    const selectedFilesLength = selectedFiles.length;
    const secondaryLength = document.querySelectorAll(
      ".secondary-images .secondary-image"
    ).length;
    document
      .querySelectorAll(".secondary-images .secondary-image")
      .forEach((image, index) => {
        let imageUrl = null;
        if (index < secondaryLength - selectedFilesLength) {
          console.log("Image par defaut");
          imageUrl = image.querySelector("img").src;
          images[index + 1] = imageUrl;
        } else {
          console.log("Image charge");
          //Savegarde de l'image principale dans sfirebase storage et recuperation du url
          const file =
            selectedFiles[index - (secondaryLength - selectedFilesLength)];
          console.log(file);
          imageUrl = `products/${category}/${name}/image${index + 1}`;
          images[index + 1] = imageUrl;
        }
      });

    const product = new Product(
      productIndex,
      document.getElementById("sales").value,
      document.getElementById("qty").value,
      name,
      category,
      document.getElementById("price").value,
      document.getElementById("priceReduction").value,
      images,
      foundSpecs(),
      []
    );

    return product;
  }

  document.getElementById("specsAdd").addEventListener("click", () => {
    const column = document.createElement("div");
    column.classList.add("column");
    column.innerHTML = `
          <div class="input-box">
            <input type="text" placeholder="Entrez le nom">
          </div>
          <div class="input-box input-value custom-input">
            <input type="text" placeholder="Entrez le valeur">
            <i class="uil uil-trash"></i>
          </div>
        `;

    column.querySelector(".uil-trash").addEventListener("click", () => {
      column.remove();
    });
    otherSpecs.appendChild(column);
  });
});
