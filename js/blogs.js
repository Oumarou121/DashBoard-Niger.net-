document.addEventListener("DOMContentLoaded", function () {
  const productTable = document.getElementById("blogTable");
  var blogsIndex = null;
  const modal = document.getElementById("custom-modal");
  const modalComments = document.getElementById("custom-modal-comments");
  const modalComment = document.getElementById("comment-modal");
  const modalParagraph = document.getElementById("paragraph-modal");
  const modalConfirm = document.getElementById("confirmModal");
  const addBtn = document.getElementById("add-btn");
  const saveBtn = document.getElementById("save-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const secondaryContent = document.getElementById("secondaryImagesContainer");
  const mainImagePreview = document.getElementById("mainImagePreview");
  const chooseMainImage = document.getElementById("chooseMainImage");
  const mainImage = document.getElementById("mainImage");
  let selectedFiles = [];
  const paragraphsContent = document.getElementById("add-paragraphs-content");
  const addParagraph = document.getElementById("add-paragraphs");
  const description = document.getElementById("description");
  const nameInput = document.getElementById("name");
  const tagInput = document.getElementById("tag");
  const dateInput = document.getElementById("date");
  const commentsInput = document.getElementById("comments");
  const importantsInput = document.getElementById("importants");
  const commentsContent = document.getElementById("comments-content");

  blogs.forEach((blog) => {
    const row = document.createElement("tr");
    row.classList.add("item");

    row.innerHTML = `
        <td>${blog.id}</td>
        <td>${blog.name}</td>
        <td>${blog.tag}</td>
        <td>${blog.reviews.length}</td>
        <td class="btn-td">
            <button class="infos">Infos</button>
            <button class="comments">Comments</button>
        </td>
      `;

    row.querySelector(".infos").addEventListener("click", () => {
      openModal(blog.id);
    });

    row.querySelector(".comments").addEventListener("click", () => {
      openModalComments(blog.id);
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
      const tag = row.children[2].textContent.toLowerCase();

      if (name.includes(searchValue) || tag.includes(searchValue)) {
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
    blogsIndex = index;
    modal.classList.add("show");
    if (index !== null) {
      const blog = blogs.find((b) => b.id === blogsIndex);
      nameInput.value = blog.name;
      tagInput.value = blog.tag;
      const dateString = blog.date;
      const [day, month, year] = dateString.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      dateInput.value = formattedDate;

      commentsInput.value = blog.reviews.length;
      importantsInput.value = blog.important;
      addBtn.style.display = "none";
      saveBtn.style.display = "block";
      deleteBtn.style.display = "block";
      loadParagraphs(blog);

      saveBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const value = await openModalConfirm(
          "Are you sure you want to apply this update?"
        );
        console.log("Save confirmed:", value);
      });

      deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const value = await openModalConfirm(
          "Are you sure you want to delete this account?"
        );
        console.log("Delete confirmed:", value);
      });
    } else {
      nameInput.value = "";
      tagInput.value = "";
      dateInput.value = "";
      commentsInput.value = "";
      importantsInput.value = "";
      paragraphsContent.innerHTML = "";
      addBtn.style.display = "block";
      saveBtn.style.display = "none";
      deleteBtn.style.display = "none";
    }
  }

  function openModalComment(reviews, review) {
    const nameCommentInput = document.getElementById("name-comment");
    const contentCommentInput = document.getElementById("comment-content");
    modalComment.classList.add("show");
    if (review === null) {
      nameCommentInput.value = "";
      contentCommentInput.value = "";
    } else {
      nameCommentInput.value = review.name;
      contentCommentInput.value = review.comment;
    }
  }

  function openModalComments(index) {
    commentsContent.innerHTML = "";
    blogsIndex = index;
    const blog = blogs.find((b) => b.id === blogsIndex);
    const reviews = blog.reviews;
    modalComments.classList.add("show");
    reviews.forEach((review) => {
      const comment = document.createElement("li");
      comment.classList.add("comment");
      comment.innerHTML = `
         <div class="comment-icon">
          <img
            src="//drou-electronics-store.myshopify.com/cdn/shop/t/42/assets/default-user-image_small.png?v=148888795198729825501689877174"
            alt="author"
          />
        </div>
        <div class="comment-content">
          <div class="comnt-author">
            <span class="auth_name">${review.name}</span>
            <span>${review.date}</span>
          </div>
          <p>${review.comment}</p>
        </div>
        <div class="options">
          <i class="fas fa-ellipsis-v option-btn"></i>
          <div class="dropdown-menu">
            <button class="edit-btn">Modifier</button>
            <button class="delete-btn">Supprimer</button>
          </div>
        </div>
      `;

      comment.querySelector(".option-btn").addEventListener("click", () => {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.style.display = "none";
        });
        comment.querySelector(".dropdown-menu").style.display = "block";
      });

      comment.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.preventDefault();
        openModalComment(reviews, review);
      });

      comment.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.preventDefault();
        comment.remove();
      });

      commentsContent.appendChild(comment);
    });

    document
      .getElementById("add-comments-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();
        openModalComment(reviews, null);
      });
  }

  function closeModalComments() {
    blogsIndex = null;
    modalComments.classList.remove("show");
  }

  document
    .getElementById("close-modal-comments")
    .addEventListener("click", (e) => {
      e.preventDefault();
      closeModalComments();
    });

  function closeModal() {
    blogsIndex = null;
    modal.classList.remove("show");
  }

  function openModalParagraph(paragraphData) {
    modalParagraph.classList.add("show");
    if (paragraphData !== null) {
      loadImages(paragraphData.images);
      description.textContent = paragraphData.description;
    } else {
      secondaryContent.innerHTML = "";
      mainImagePreview.src = "";
      mainImagePreview.style.display = "none";
      chooseMainImage.style.display = "flex";
      description.textContent = "";
    }

    document.getElementById("submitBlog").addEventListener("click", () => {
      const paragraph = recoveryParagraphData();
      console.log(paragraph);
    });
  }

  addParagraph.addEventListener("click", () => {
    openModalParagraph(null);
  });

  function loadParagraphs(blog) {
    const paragraphs = blog.paragraphs;

    paragraphs.forEach((p) => createParagraphElement(p));
  }

  function createParagraphElement(paragraphData) {
    const paragraph = document.createElement("div");
    paragraph.classList.add("paragraph");

    paragraph.innerHTML = `
        <div class="paragraph-images">
            ${paragraphData.images
              .map((img) => `<img src="${img}" alt="" />`)
              .join("")}
        </div>
        <div class="form-group">
          <textarea name="description" readonly>${
            paragraphData.description
          }</textarea>
        </div>
        <div class="options">
          <i class="fas fa-ellipsis-v option-btn"></i>
          <div class="dropdown-menu">
            <button class="edit-btn">Modifier</button>
            <button class="delete-btn">Supprimer</button>
            <button class="duplicate-btn">Dupliquer</button>
          </div>
        </div>
    `;

    paragraph.querySelector(".option-btn").addEventListener("click", () => {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none";
      });
      paragraph.querySelector(".dropdown-menu").style.display = "block";
    });

    paragraph.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.preventDefault();
      openModalParagraph(paragraphData);
    });

    paragraph.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.preventDefault();
      paragraph.remove();
    });

    paragraph.querySelector(".duplicate-btn").addEventListener("click", (e) => {
      e.preventDefault();
      const duplicatedParagraph = createParagraphElement(paragraphData);
      paragraphsContent.appendChild(duplicatedParagraph);
    });

    paragraphsContent.appendChild(paragraph);
    return paragraph;
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".options")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none";
      });
    }
  });

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

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const tag = tagInput.value;
    const date = dateInput.value;
    const important = importantsInput.value;
    const paragraphs = recoveryParagraphsData();

    if (
      name.trim() === "" ||
      tag.trim() === "" ||
      date.trim() === "" ||
      important === "" ||
      paragraphs.length <= 0
    ) {
      showAlert("Tous les champs doivent être remplis");
      return;
    }

    const newBlog = new Blog(
      blogs.length,
      name,
      [],
      important,
      date,
      0,
      tag,
      []
    );

    console.log(newBlog);
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

      selectedFiles = selectedFiles.filter((f) => f !== file);
    };

    imgContainer.appendChild(removeBtn);
    secondaryContent.appendChild(imgContainer);
  }

  chooseMainImage.addEventListener("click", () => {
    mainImage.click();
  });

  mainImagePreview.addEventListener("click", () => {
    mainImage.click();
  });

  mainImage.addEventListener("change", function (event) {
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

  document
    .getElementById("addSecondaryImage")
    .addEventListener("click", function () {
      document.getElementById("secondaryImages").click();
    });

  document
    .getElementById("secondaryImages")
    .addEventListener("change", function (event) {
      const files = Array.from(event.target.files);

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

  function loadImages(imageUrls) {
    if (!imageUrls || imageUrls.length === 0) {
      console.error("Aucune image à charger !");
      return;
    }

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

  function recoveryParagraphData() {
    const blog = blogs.find((b) => b.id === blogsIndex);

    let images = [];
    const descriptionInput = document.getElementById("description");

    const file = mainImage.files[0];
    if (file) {
      //Savegarde de l'image principale dans sfirebase storage et recuperation du url
      console.log(file);
      const primaryUrl = `blogs/${blog.tag}/${blog.name}/image0`;

      images[0] = primaryUrl;
    } else {
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
          imageUrl = `blogs/${blog.tag}/${blog.name}/image${index + 1}`;
          images[index + 1] = imageUrl;
        }
      });

    const paragraph = {
      images: images,
      description: descriptionInput.value.trim(),
    };

    return paragraph;
  }

  function recoveryParagraphsData() {
    console.log(paragraphsContent);
  }
});

function closeAnyModal(button) {
  button.closest(".modal").classList.remove("show");
}
