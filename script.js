document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("item-form");
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const taxInput = document.getElementById("tax");
  const tableBody = document.querySelector("#items-table tbody");

  let items = JSON.parse(localStorage.getItem("items")) || [];
  let editId = null;

  renderTable();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const taxRate = parseFloat(taxInput.value);

    if (!name || isNaN(price) || isNaN(taxRate)) {
      alert("Please fill all fields correctly.");
      return;
    }

    const taxAmount = +(price * (taxRate / 100)).toFixed(2);
    const total = +(price + taxAmount).toFixed(2);

    if (editId) {
      // Edit existing item
      items = items.map((item) =>
        item.id === editId
          ? { ...item, name, price, taxAmount, total }
          : item
      );
      editId = null;
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        name,
        price,
        taxAmount,
        total,
      };
      items.push(newItem);
    }

    saveToStorage();
    renderTable();
    form.reset();
  });

  function renderTable() {
    tableBody.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${item.taxAmount.toFixed(2)}</td>
        <td>$${item.total.toFixed(2)}</td>
        <td class="actions">
          <button class="edit" data-id="${item.id}">Edit</button>
          <button class="delete" data-id="${item.id}">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Edit handler
    document.querySelectorAll(".edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = +e.target.getAttribute("data-id");
        const item = items.find((i) => i.id === id);
        if (item) {
          nameInput.value = item.name;
          priceInput.value = item.price;
          taxInput.value = (item.taxAmount / item.price * 100).toFixed(2);
          editId = id;
        }
      });
    });

    // Delete handler
    document.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = +e.target.getAttribute("data-id");
        items = items.filter((item) => item.id !== id);
        saveToStorage();
        renderTable();
      });
    });
  }

  function saveToStorage() {
    localStorage.setItem("items", JSON.stringify(items));
  }
});
