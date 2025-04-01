document.addEventListener("DOMContentLoaded", function () {
  const productTable = document.getElementById("blogTable");
  var blogsIndex = null;

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
            <button class="review">Reviews</button>
        </td>
      `;

    row.querySelector(".infos").addEventListener("click", () => {});

    row.querySelector(".review").addEventListener("click", () => {});
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
});
