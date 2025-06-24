document.addEventListener("DOMContentLoaded", () => {
  const stockTableBody = document.getElementById("stockTableBody");
  const searchByNameInput = document.getElementById("searchByName");
  const searchByQuantityInput = document.getElementById("searchByQuantity");

  const noStockMessage = document.getElementById("noStockMessage");

  /**
   * Funcție pentru filtrarea pieselor după nume, număr sau ambele.
   */
  const filterTable = async () => {
    const searchText = searchByNameInput.value.toLowerCase().trim();
    const searchQuantity = searchByQuantityInput.value.trim();

    let anyRowVisible = false;

    Array.from(stockTableBody.children).forEach((row) => {
      const partName = row.children[0].textContent.toLowerCase();
      const quantityText = row.children[2].textContent.trim();
      const quantity = parseInt(quantityText);

      const matchesName = partName.includes(searchText);
      const matchesQuantity =
        searchQuantity === "" || quantity === parseInt(searchQuantity);

      if (matchesName && matchesQuantity) {
        row.style.display = "";
        anyRowVisible = true;
      } else {
        row.style.display = "none";
      }
    });

    if (anyRowVisible) {
      noStockMessage.style.display = "none";
    } else {
      noStockMessage.style.display = "block";
    }
  };

  //add event listenere
  searchByNameInput.addEventListener("input", filterTable);
  searchByQuantityInput.addEventListener("input", filterTable);

  filterTable();

  const addNewPieceBtn = document.getElementById("addNewPieceBtn");
  const addPieceModal = document.getElementById("addPieceModal");
  const addPieceForm = document.getElementById("addPieceForm");
  const cancelNewPieceBtn = document.getElementById("cancelNewPieceBtn");
  const saveNewPieceBtn = document.getElementById("saveNewPieceBtn"); // Acum îl folosim direct pentru clarity

  // Câmpurile din formularul pop-up
  const newPieceNameInput = document.getElementById("newPieceName");
  const newPieceDescriptionInput = document.getElementById(
    "newPieceDescription"
  );
  const newPieceStockInput = document.getElementById("newPieceStock");

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
      stock: pieceStock,
    };

    console.log("Datele noi pentru piesă:", newPieceData);

    // TODO: AICI VEI FACE APELUL CĂTRE BACKEND PENTRU A SALVA NOUA PIESĂ
    // Exemplu de apel `fetch` (necesită un endpoint de API pe serverul tău)
    /*
        try {
            const response = await fetch('/api/pieces', { // Exemplu de endpoint API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Poate fi necesar un token de autentificare aici
                    // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
                },
                body: JSON.stringify(newPieceData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Eroare la adăugarea piesei.');
            }

            const result = await response.json();
            console.log('Piesa adăugată cu succes:', result);

            // După adăugarea cu succes, închide modalul
            closeAddPieceModal();
            alert('Piesa a fost adăugată cu succes!');

            // Aici ar trebui să reîncarci tabelul sau să adaugi rândul nou dinamic
            // filterTable(); // Re-filtrează (nu va adăuga rândul nou dacă nu e în DOM)
            // Sau: loadPiecesIntoTable(); // Funcție care ar prelua toate piesele din nou de la server și ar re-popula tabelul
            // Sau: location.reload(); // Simplu, dar nu cel mai bun UX

        } catch (error) {
            console.error('Eroare la adăugarea piesei:', error);
            alert('Eroare la adăugarea piesei: ' + error.message);
        }
        */

    // Pentru moment, doar logăm datele și închidem modalul pentru a testa UI-ul
    closeAddPieceModal();
    alert("Piesa a fost simulată adăugată. Acum trebuie integrat cu backend!");
  };

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
          alert(
            "Valoare stoc invalidă. Te rugăm să introduci un număr pozitiv."
          );
          cell.textContent = originalStock; 
          return;
        }

        if (newStock === originalStock) {
          cell.textContent = originalStock;
          return;
        }

        console.log(
          `Încercare de actualizare stoc pentru piesa ID: ${pieceId} de la ${originalStock} la ${newStock}`
        );

        // TODO: AICI VEI FACE APELUL CĂTRE BACKEND PENTRU A ACTUALIZA STOCUL
        /*
                try {
                    const response = await fetch(`/api/pieces/${pieceId}/stock`, { // Exemplu de endpoint PUT/PATCH
                        method: 'PATCH', // PATCH este mai potrivit pentru actualizarea parțială a unei resurse
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Dacă e necesar
                        },
                        body: JSON.stringify({ stock: newStock })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Eroare la actualizarea stocului.');
                    }

                    // Dacă salvarea pe backend a avut succes, actualizăm textul în celulă
                    cell.textContent = newStock;
                    alert(`Stoc actualizat pentru piesa ID ${pieceId} la ${newStock}`);

                } catch (error) {
                    console.error('Eroare la actualizarea stocului:', error);
                    alert('Eroare la actualizarea stocului: ' + error.message + '\nValoarea nu a fost salvată.');
                    cell.textContent = originalStock; // Restaurează valoarea originală în caz de eroare
                }
                */
        // Pentru testare: actualizăm doar local și afișăm alertă
        cell.textContent = newStock;
        alert(
          `Stoc actualizat local pentru piesa ID ${pieceId} la ${newStock}. Acum trebuie integrat cu backend!`
        );
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
});
