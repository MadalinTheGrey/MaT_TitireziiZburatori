let supplies = [];

const stockTableBody = document.getElementById("stockTableBody");
const searchByNameInput = document.getElementById("searchByName");
const searchByQuantityInput = document.getElementById("searchByQuantity");

const noStockMessage = document.getElementById("noStockMessage");
const addNewPieceBtn = document.getElementById("addNewPieceBtn");
const addPieceModal = document.getElementById("addPieceModal");
const addPieceForm = document.getElementById("addPieceForm");
const cancelNewPieceBtn = document.getElementById("cancelNewPieceBtn");
const saveNewPieceBtn = document.getElementById("saveNewPieceBtn");
const importBtn = document.getElementById("importBtn");
const exportBtn = document.getElementById("exportBtn");

// Câmpurile din formularul pop-up
const newPieceNameInput = document.getElementById("newPieceName");
const newPieceDescriptionInput = document.getElementById("newPieceDescription");
const newPieceStockInput = document.getElementById("newPieceStock");

function renderSupplies() {
  stockTableBody.innerHTML = "";

  if (supplies.length === 0) {
    noStockMessage.style.display = "block";
    return;
  }

  noStockMessage.style.display = "none";

  supplies.forEach((supply) => {
    const row = document.createElement("tr");
    row.classList.add("stock-item");
    row.dataset.id = supply.id;

    const escapeHTML = (str) => {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    };

    row.innerHTML = `
      <td>${escapeHTML(supply.name)}</td>
      <td>${escapeHTML(supply.description)}</td>
      <td class = "stock-quantity">${supply.in_stock}</td>
      <td class = "stock-actions">
        <button class = "edit-stock-btn" title = "Editează stock">
          <i class="uil uil-pen"></i>
        </button>
      </td>
    `;

    stockTableBody.appendChild(row);
  });
}

async function fetchSupplies(name, in_stock) {
  const token = localStorage.getItem("jwt");

  try {
    let fetchLink = "/api/supplies";
    let addedFilter = false;
    if (name) {
      fetchLink += `?name=${encodeURIComponent(name)}`;
      addedFilter = true;
    }
    if (in_stock) {
      if (!addedFilter) fetchLink += "?";
      else fetchLink += "&";
      fetchLink += `in_stock=${encodeURIComponent(in_stock)}`;
      addedFilter = true;
    }
    const response = await fetch(fetchLink, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error fetching supplies");
    }

    supplies = data.supplies;
    renderSupplies();
  } catch (error) {
    console.error("Error fetching supplies: ", error);
  }
}

/**
 * functie pt deschiderea pop-up
 */
const openAddPieceModal = () => {
  if (addPieceModal) {
    addPieceModal.classList.add("active");
    addPieceForm.reset();
    newPieceNameInput.focus();
  }
};

const closeAddPieceModal = () => {
  if (addPieceModal) {
    addPieceModal.classList.remove("active");
    addPieceForm.reset(); // Resetează formularul la valorile inițiale și la închidere
  }
};

/**
 * Funcție pentru filtrarea pieselor după nume, număr sau ambele.
 */
const filterTable = async () => {
  const searchText = searchByNameInput.value.toLowerCase().trim();
  const searchQuantity = searchByQuantityInput.value.trim();

  fetchSupplies(searchText, searchQuantity);

  let anyRowVisible = true;

  if (supplies.length === 0) anyRowVisible = false;

  if (anyRowVisible) {
    noStockMessage.style.display = "none";
  } else {
    noStockMessage.style.display = "block";
  }
};

/**
 * functie pt a "adauga" o noua piesa(trebuie integrarea)
 * @param {*} event
 * @returns
 */
const saveNewPiece = async (event) => {
  event.preventDefault(); // Oprește comportamentul implicit de trimitere a formularului (reîncărcarea paginii)

  const pieceName = newPieceNameInput.value.trim();
  const pieceDescription = newPieceDescriptionInput.value.trim();
  const pieceStock = parseInt(newPieceStockInput.value);
  const newPieceData = {
    name: pieceName,
    description: pieceDescription,
    in_stock: pieceStock,
  };

  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch("/api/supplies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPieceData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error || "Error adding supply");
      return;
    }
    supplies.push(newPieceData);
    renderSupplies();
  } catch (error) {
    console.error("Error adding supply: ", error);
  }
  closeAddPieceModal();
};

/**
 * Funcție pentru a intra în modul de editare pentru o celulă de stoc.
 * @param {HTMLElement} cell - Celula <td> care conține cantitatea în stoc.
 * @param {string} pieceId - ID-ul piesei asociate cu rândul.
 */
function enterEditMode(cell, pieceId) {
  const currentStock = parseInt(cell.textContent.trim());

  const inputField = document.createElement("input");
  inputField.type = "number";
  inputField.value = currentStock;
  inputField.min = "0";

  cell.classList.add("editing");
  cell.innerHTML = "";
  cell.appendChild(inputField);

  // Focalizăm input-ul și selectăm conținutul
  inputField.focus();
  inputField.select();

  let originalStock = currentStock;

  /**
   * Funcție pentru a ieși din modul de editare și a salva/anula.
   * @param {boolean} save - True dacă trebuie să salvăm, False dacă anulăm.
   */
  const exitEditMode = async (save) => {
    cell.classList.remove("editing");
    if (save) {
      const newStock = parseInt(inputField.value);

      if (isNaN(newStock) || newStock < 0) {
        alert("Valoare stoc invalidă. Te rugăm să introduci un număr pozitiv.");
        cell.textContent = originalStock;
        return;
      }

      if (newStock === originalStock) {
        cell.textContent = originalStock;
        return;
      }

      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`/api/supplies/${pieceId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ in_stock: newStock }),
        });

        const data = await response.json();

        if (!response.ok) {
          cell.textContent = originalStock;
          console.error(data.error || "Error modifying supply_stock");
          return;
        }

        cell.textContent = newStock;
      } catch (error) {
        console.error("Error modifying supply stock: ", error);
      }
    } else {
      cell.textContent = originalStock;
    }

    // prevenim multiple executii
    inputField.removeEventListener("blur", blurHandler);
    inputField.removeEventListener("keydown", keydownHandler);
  };

  const blurHandler = () => exitEditMode(true);
  inputField.addEventListener("blur", blurHandler);

  const keydownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputField.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      exitEditMode(false);
    }
  };
  inputField.addEventListener("keydown", keydownHandler);
}

async function importSupplies() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json,.csv";
  fileInput.display = "none";

  document.body.appendChild(fileInput);

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.warn("No file selected for import");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("/api/supplies/import", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error || "Error importing supplies");
        return;
      }

      fetchSupplies(null, null);
    } catch (error) {
      console.error("Error importing supplies");
    }
  });
  fileInput.click();
  fileInput.remove();
}

async function exportSupplies() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch("/api/supplies/export", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(data.error || "Error on export");
      return;
    }

    const exportBlob = await response.blob();

    const url = window.URL.createObjectURL(exportBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "supplies-export.json";

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error during export", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  //add event listenere
  searchByNameInput.addEventListener("input", filterTable);
  searchByQuantityInput.addEventListener("input", filterTable);

  await fetchSupplies(null, null);

  //add event listeners
  addNewPieceBtn.addEventListener("click", openAddPieceModal);
  cancelNewPieceBtn.addEventListener("click", closeAddPieceModal);
  addPieceModal.addEventListener("click", (event) => {
    if (event.target === addPieceModal) {
      // Verifică dacă click-ul a fost direct pe overlay
      closeAddPieceModal();
    }
  });
  addPieceForm.addEventListener("submit", saveNewPiece);
  importBtn.addEventListener("click", importSupplies);
  exportBtn.addEventListener("click", exportSupplies);
  /**
   * functionalitati pt butonul de editare a nr stoc
   */
  if (stockTableBody) {
    stockTableBody.addEventListener("click", (event) => {
      const editButton = event.target.closest(".edit-stock-btn");

      if (editButton) {
        event.preventDefault();
        const row = editButton.closest("tr.stock-item");
        if (!row) {
          console.warn(
            "Nu s-a putut găsi rândul părinte (.stock-item) pentru butonul de editare."
          );
          return;
        }

        const pieceId = row.dataset.id;
        if (!pieceId) {
          console.warn(
            "Rândul nu are atributul data-id. Nu se poate edita piesa."
          );
          return;
        }

        const stockQuantityCell = row.children[2];
        if (!stockQuantityCell) {
          console.warn(
            "Nu s-a putut găsi celula pentru cantitate (index 2) în rând."
          );
          return;
        }

        if (stockQuantityCell.classList.contains("editing")) {
          return;
        }

        enterEditMode(stockQuantityCell, pieceId);
      }
    });
  }
});
