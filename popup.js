document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.getElementById("title");
  const listElement = document.getElementById("list");
  const addItemForm = document.getElementById("add-item-form");
  const newItemInput = document.getElementById("new-item");

  const updateList = async () => {
    try {
      const response = await fetch("http://localhost:3003/items");

      const data = await response.json();

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
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  addItemForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const itemName = newItemInput.value.trim();

    if (itemName) {
      try {
        await fetch("http://localhost:3003/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: itemName }),
        });

        newItemInput.value = "";

        await updateList();
      } catch (err) {
        console.error("Failed to add item:", err);
      }
    }
  });

  
  listElement.addEventListener("change", async (event) => {
    if (event.target.type === "checkbox") {
      try {
        await fetch("http://localhost:3003/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: event.target.getAttribute("data-id") }),
        });
        await updateList();
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
    }
  });
  
  updateList(); // First load
  
});
