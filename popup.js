document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.getElementById("title");
  const listElement = document.getElementById("list");
  const addItemForm = document.getElementById("add-item-form");
  const newItemInput = document.getElementById("new-item");

  const updateList = () => {
    fetch("http://localhost:3003/items")
      .then((response) => response.json())
      .then((data) => {
        titleElement.textContent = data.title;
        listElement.innerHTML = data.items
          .map(
            (item) => `
                        <div class="item">
                            <input type="checkbox" data-id="${item._id}">
                            <p>${item.name}</p>
                        </div>
                    `
          )
          .join("");
      })
      .catch((err) => console.error("Failed to fetch items:", err));
  };

  addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const itemName = newItemInput.value.trim();
    if (itemName) {
      fetch("http://localhost:3003/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName }),
      })
        .then(() => {
          newItemInput.value = "";
          updateList();
        })
        .catch((err) => console.error("Failed to add item:", err));
    }
  });

  listElement.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      fetch("http://localhost:3003/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: event.target.getAttribute("data-id") }),
      })
        .then(() => updateList())
        .catch((err) => console.error("Failed to delete item:", err));
    }
  });

  updateList(); //first load madak use madtiv
});
