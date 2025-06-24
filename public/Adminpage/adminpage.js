const requests = [
  {
    id: 748,
    productName: "Bicicletă Calypso 1000",
    problemDescription:
      "Am intrat cu bicicleta în copacul din imagine și am stricat roata din spate. Mi-aș dori să o reparați și apoi să vopsesc bicicleta în roșu (cuminte după ce se ferește după copacii de mine!)",
    dateTime: "30.02.1999",
    // MODIFICAT: Acum este un array de URL-uri care pot include și videoclipuri
    mediaUrls: [
      // Renumit de la 'imageUrls' la 'mediaUrls'
      "https://images.pexels.com/photos/15603043/pexels-photo-15603043.jpeg", // Imagine
      "https://images.pexels.com/photos/5446297/pexels-photo-5446297.jpeg", // Imagine
      "https://images.pexels.com/photos/1595476/pexels-photo-1595476.jpeg", // Imagine (pentru a testa scroll-ul)
      // EXEMPLU: Adăugăm un URL de videoclip (trebuie să simulezi un fișier video local)
      // Să presupunem că ai un fișier 'video1.mp4' în directorul 'assets/videos/'
      // path-ul real va depinde de unde stochezi videoclipurile pe server
      "/assets/videos/video1.mp4", // VIDEOCLIP
    ],
    status: "pending", // pending, accepted, rejected
    adminComment: "",
  },
  {
    id: 749,
    productName: "Laptop Dell XPS 15",
    problemDescription:
      "Ecranul a început să pâlpâie intermitent, iar bateria se descarcă foarte repede. Am nevoie de el pentru facultate.",
    dateTime: "15.05.2025 10:30",
    // MODIFICAT: Acum este un array de URL-uri (unul singur pentru acest caz)
    mediaUrls: ["/assets/imgs/faq.png"],
    status: "pending",
    adminComment: "",
  },
  {
    id: 750,
    productName: "Telefon Samsung Galaxy S23",
    problemDescription:
      "Camera frontală nu mai funcționează după ce mi-a căzut pe jos. De asemenea, sticla de pe spate este spartă.",
    dateTime: "01.06.2025 14:00",
    mediaUrls: [
      "https://images.pexels.com/photos/5446297/pexels-photo-5446297.jpeg", // Adaug o a treia imagine pentru a declanșa scroll-ul
      // EXEMPLU: Adăugăm un alt URL de videoclip
      "/assets/videos/video1.mp4", // VIDEOCLIP 
      "/assets/imgs/faq.png",
    ],
    status: "pending",
    adminComment: "",
  },
  {
    id: 751,
    productName: "Frigider Arctic",
    problemDescription:
      "Nu mai răcește deloc, iar becul interior nu se mai aprinde. Alimentele din el s-au stricat.",
    dateTime: "20.06.2025 09:00",
    mediaUrls: [
      "https://images.pexels.com/photos/5446297/pexels-photo-5446297.jpeg",
      "https://images.pexels.com/photos/5446297/pexels-photo-5446297.jpeg",
    ],
    status: "pending",
    adminComment: "",
  },
];

// NOU: Simulează datele pentru programările ocupate
// Acum include și numele clientului
const occupiedAppointments = [
  { date: "22.06.2025", time: "10:00 - 11:00", clientName: "Ion Popescu" },
  { date: "22.06.2025", time: "14:00 - 15:00", clientName: "Maria Ionescu" },
  { date: "23.06.2025", time: "09:30 - 10:30", clientName: "Andrei Vasilescu" },
  { date: "23.06.2025", time: "16:00 - 17:00", clientName: "Elena Dumitrescu" },
  { date: "24.06.2025", time: "11:00 - 12:00", clientName: "George Enescu" },
  { date: "24.06.2025", time: "15:00 - 16:00", clientName: "Ana Maria Popa" },
  { date: "25.06.2025", time: "09:00 - 10:00", clientName: "Victor Stancu" },
  { date: "25.06.2025", time: "13:00 - 14:00", clientName: "Diana Munteanu" },
  { date: "26.06.2025", time: "10:00 - 11:00", clientName: "Cristian Avram" },
  { date: "26.06.2025", time: "15:00 - 16:00", clientName: "Laura Georgescu" },
];

// NOU: Simulează datele pentru cererile de la furnizori
// let pt a putea fi modificat
let supplierRequests = [
  {
    id: 1,
    supplierName: "Furnizor MotoPiese SRL",
    partName: "Filtru Ulei Motocicletă",
    description:
      "Necesită 5 bucăți, cod produs: FUMT-2023. Urgență medie. Livrare în 3 zile.",
  },
  {
    id: 2,
    supplierName: "CicluServicii SA",
    partName: "Set Frâne Hidraulice Bicicletă",
    description:
      "2 seturi, pentru biciclete de munte. Calitate superioară. Termen limită 5 zile.",
  },
  {
    id: 3,
    supplierName: "ElectroMobility Distribuitor",
    partName: "Baterie Trotinetă Electrică 36V",
    description:
      "10 bucăți, model standard. Compatibil cu Xiaomi M365. Stoc limitat.",
  },
  {
    id: 4,
    supplierName: "AutoPro Componente",
    partName: "Lanț Transmisie Moto",
    description:
      "Diverse dimensiuni, pentru modele Honda și Yamaha. Cantitate mare necesară.",
  },
  {
    id: 5,
    supplierName: "Piese Rapid SRL",
    partName: "Anvelopă Bicicletă 29 inch",
    description: "Anvelope off-road, 15 bucăți. Așteptăm oferta de preț.",
  },
  {
    id: 6,
    supplierName: "General Parts Inc.",
    partName: "Amortizor Trotinetă Față",
    description: "Model universal, 8 bucăți. Avem nevoie urgentă.",
  },
  {
    id: 7,
    supplierName: "MegaMoto Spares",
    partName: "Set garnituri motor",
    description: "Pentru motor Suzuki GSX-R, an 2018. 3 seturi.",
  },
];

let currentRequestIndex = 0; // Indexul cererii curente afișate

// Referințe la elementele DOM
const requestIdElem = document.getElementById("requestId");
const productNameElem = document.getElementById("productName");
const problemDescriptionElem = document.getElementById("problemDescription");
const dateTimeElem = document.getElementById("dateTime");
const adminCommentElem = document.getElementById("adminComment");
const requestImageContainer = document.getElementById("requestImageContainer"); // Containerul pentru media

const acceptBtn = document.getElementById("acceptBtn"); // Asigură-te că ai această referință
const refuseBtn = document.getElementById("refuseBtn"); // Asigură-te că ai această referință

// Referințele existente (desktop):
const prevButtonDesktop = document.querySelector(
  ".prev-button.desktop-nav-button"
);
const nextButtonDesktop = document.querySelector(
  ".next-button.desktop-nav-button"
);

// Referințe la butoanele de navigare mobile
const prevButtonMobile = document.querySelector(".prev-button-mobile");
const nextButtonMobile = document.querySelector(".next-button-mobile");

// NOU: Referințe la elementele pentru programări ocupate
const occupiedAppointmentsListElem = document.getElementById(
  "occupiedAppointmentsList"
);
const noAppointmentsMessageElem = document.getElementById(
  "noAppointmentsMessage"
);

// NOU: Referințe la elementele pentru cererile de la furnizori
const supplierRequestsContainerElem = document.getElementById(
  "supplierRequestsContainer"
);
const noSupplierRequestsMessageElem = document.getElementById(
  "noSupplierRequestsMessage"
);

// NOU: Referințe pentru modalul de adăugare cerere
const addSupplierRequestBtn = document.getElementById("addSupplierRequestBtn");
const addRequestModal = document.getElementById("addRequestModal");
const addRequestForm = document.getElementById("addRequestForm");
const newSupplierNameInput = document.getElementById("newSupplierName");
const newPartNameInput = document.getElementById("newPartName");
const newDescriptionTextarea = document.getElementById("newDescription");
const saveNewRequestBtn = document.getElementById("saveNewRequestBtn");
const cancelNewRequestBtn = document.getElementById("cancelNewRequestBtn");


/**
 * Funcție helper pentru a determina tipul de fișier pe baza extensiei URL-ului.
 * @param {string} url - URL-ul fișierului.
 * @returns {string} - 'image' sau 'video' sau 'unknown'.
 */
function getMediaType(url) {
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "flv"]; // Adaugă aici toate extensiile video pe care le vei folosi

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "unknown"; // Pentru alte tipuri de fișiere sau URL-uri invalide
  }
}

/**
 * Funcție pentru a afișa detaliile unei cereri specifice, inclusiv media (imagini/videoclipuri).
 * @param {number} index - Indexul cererii în array-ul `requests`.
 */
function displayRequest(index) {
  if (index < 0 || index >= requests.length) {
    console.warn("Index invalid pentru cerere.");
    // Logica pentru a gestiona lipsa cererilor sau index invalid
    if (requests.length === 0) {
      document.querySelector(".request-card").style.display = "none";
      document.querySelector(".requests-carousel-section h1").textContent =
        "Nu există cereri în așteptare.";
      // Ascunde butoanele de navigare dacă nu mai sunt cereri
      if (prevButtonDesktop) prevButtonDesktop.style.display = "none";
      if (nextButtonDesktop) nextButtonDesktop.style.display = "none";
      if (prevButtonMobile) prevButtonMobile.style.display = "none";
      if (nextButtonMobile) nextButtonMobile.style.display = "none";
    } else {
      // Dacă indexul este invalid, dar există cereri, ajustează indexul la o valoare validă
      currentRequestIndex = Math.max(0, Math.min(index, requests.length - 1));
      displayRequest(currentRequestIndex);
    }
    return;
  } else {
    // Afișează cardul și butoanele de navigare dacă există cereri
    document.querySelector(".request-card").style.display = "flex";
    document.querySelector(".main-title").textContent =
      "CERERI CLIENȚI"; // Resetează titlul
    if (prevButtonDesktop) prevButtonDesktop.style.display = "";
    if (nextButtonDesktop) nextButtonDesktop.style.display = "";
    if (prevButtonMobile) prevButtonMobile.style.display = "";
    if (nextButtonMobile) nextButtonMobile.style.display = "";
  }

  const request = requests[index];

  requestIdElem.textContent = request.id;
  productNameElem.textContent = request.productName;
  problemDescriptionElem.textContent = request.problemDescription;
  dateTimeElem.textContent = request.dateTime;
  adminCommentElem.value = request.adminComment; // Setează valoarea textarea-ului

  // MODIFICARE AICI: Afișează imaginile ȘI videoclipurile
  requestImageContainer.innerHTML = ""; // Golește containerul de media înainte de a adăuga altele noi

  if (request.mediaUrls && request.mediaUrls.length > 0) {
    request.mediaUrls.forEach((url) => {
      const mediaType = getMediaType(url);

      if (mediaType === "image") {
        const img = document.createElement("img");
        img.src = url;
        img.alt = `Imagine pentru cererea #${request.id}`;
        img.classList.add("request-item-image"); // Clasă pentru stilizare
        requestImageContainer.appendChild(img);
      } else if (mediaType === "video") {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true; // Adaugă controalele native (play, pauză, volum)
        video.preload = "metadata"; // Încarcă doar metadatele (dimensiune, durată)
        video.classList.add("request-item-video"); // Clasă nouă pentru stilizare
        // Optional: video.autoplay = true; // Dacă vrei să pornească automat
        // Optional: video.loop = true; // Dacă vrei să se repete
        // Optional: video.muted = true; // Dacă vrei să fie mut implicit
        requestImageContainer.appendChild(video);
      } else {
        // Afișează un mesaj pentru tipuri de fișiere necunoscute
        const unknownMediaText = document.createElement("p");
        unknownMediaText.textContent = `Tip media necunoscut: ${url}`;
        unknownMediaText.style.textAlign = "center";
        unknownMediaText.style.color = "#FF0000"; // Roșu pentru eroare/avertisment
        requestImageContainer.appendChild(unknownMediaText);
      }
    });
  } else {
    // Afișează un placeholder sau un mesaj dacă nu există media
    const noMediaText = document.createElement("p");
    noMediaText.textContent = "Nicio imagine sau videoclip disponibil(ă).";
    noMediaText.style.textAlign = "center";
    noMediaText.style.color = "#777";
    requestImageContainer.appendChild(noMediaText);
  }

  // Gestionează vizibilitatea butoanelor Acceptă/Refuză și a textarea-ului
  if (request.status === "pending") {
    acceptBtn.style.display = "inline-block";
    refuseBtn.style.display = "inline-block";
    adminCommentElem.readOnly = false; // Poate fi editat
    adminCommentElem.style.backgroundColor = "#fff"; // Fundal alb normal
    adminCommentElem.style.cursor = "auto"; // Cursor normal
  } else {
    // Dacă cererea a fost deja procesată, ascunde butoanele și setează textarea-ul ca read-only
    acceptBtn.style.display = "none";
    refuseBtn.style.display = "none";
    adminCommentElem.readOnly = true; // Nu mai poate fi editat
    adminCommentElem.style.backgroundColor = "#f0f0f0"; // Fundal gri pentru read-only
    adminCommentElem.style.cursor = "not-allowed"; // Cursor "nu e permis"
  }
}

// NOU: Funcție pentru a afișa programările ocupate
function displayOccupiedAppointments(appointments) {
  occupiedAppointmentsListElem.innerHTML = ""; // Golește lista existentă

  if (appointments.length === 0) {
    noAppointmentsMessageElem.style.display = "block"; // Afișează mesajul "Nu există..."
  } else {
    noAppointmentsMessageElem.style.display = "none"; // Ascunde mesajul
    // Sortează programările după dată și ora pentru o afișare ordonată
    const sortedAppointments = [...appointments].sort((a, b) => {
      const dateA = new Date(
        a.date.split(".").reverse().join("-") + "T" + a.time.split(" ")[0]
      ); // Parsează doar ora de început pentru sortare
      const dateB = new Date(
        b.date.split(".").reverse().join("-") + "T" + b.time.split(" ")[0]
      );
      return dateA - dateB;
    });

    sortedAppointments.forEach((appointment) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <span class="appointment-date">${appointment.date}</span>
                <span class="appointment-time">${appointment.time}</span>
                <span class="appointment-client">${appointment.clientName}</span>
            `; // Am adăugat appointment-client
      occupiedAppointmentsListElem.appendChild(listItem);
    });
  }
}

/**
 * Funcție pentru a naviga la cererea anterioară.
 */
function goToPrevRequest() {
  currentRequestIndex--;
  if (currentRequestIndex < 0) {
    currentRequestIndex = requests.length - 1; // Mergi la ultima cerere (loop)
  }
  displayRequest(currentRequestIndex);
}

/**
 * Funcție pentru a naviga la cererea următoare.
 */
function goToNextRequest() {
  currentRequestIndex++;
  if (currentRequestIndex >= requests.length) {
    currentRequestIndex = 0; // Mergi la prima cerere (loop)
  }
  displayRequest(currentRequestIndex);
}

/**
 * Simulează trimiterea datelor către un server/bază de date.
 * În realitate, ai folosi `fetch` sau `XMLHttpRequest` pentru a face un apel POST/PUT la un API backend.
 * @param {object} data - Obiectul cu datele de trimis (id, status, adminComment).
 */
async function sendDataToServer(data) {
  console.log("Simulez trimiterea datelor către server:", data);

  // Aici ar veni codul real pentru un apel API, de exemplu:
  /*
    try {
        const response = await fetch('/api/update-request', { // Exemplu de endpoint
            method: 'POST', // Sau 'PUT'
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_TOKEN' // Dacă ai nevoie de autentificare
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Răspuns de la server:', result);
        alert('Cerearea a fost actualizată cu succes!');
    } catch (error) {
        console.error('Eroare la trimiterea datelor către server:', error);
        alert('A apărut o eroare la actualizarea cererii. Te rugăm să încerci din nou.');
    }
    */

  // Pentru acest exemplu, doar simulăm o întârziere și apoi actualizăm statusul local
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Datele au fost "salvate" (simulat).');
      resolve({ success: true, message: "Status actualizat cu succes!" });
    }, 500); // Simulează un delay de 0.5 secunde
  });
}

// NOU: Funcție pentru a genera un ID unic pentru noile cereri
function generateUniqueId(arr) {
  if (arr.length === 0) {
    return 1;
  }
  const maxId = Math.max(...arr.map((item) => item.id));
  return maxId + 1;
}

// MODIFICAT: Funcție pentru a afișa cererile de la furnizori, cu buton de ștergere
function displaySupplierRequests(requests) {
  supplierRequestsContainerElem.innerHTML = ""; // Golește containerul existent

  if (requests.length === 0) {
    noSupplierRequestsMessageElem.style.display = "block";
  } else {
    noSupplierRequestsMessageElem.style.display = "none";

    requests.forEach((request) => {
      const card = document.createElement("div");
      card.classList.add("supplier-request-card");
      card.innerHTML = `
                <h3>${request.supplierName}</h3>
                <p class="part-name">${request.partName}</p>
                <p class="part-description">${request.description}</p>
                <button class="delete-supplier-btn" data-id="${request.id}">
                    <i class="uil uil-trash"></i> </button>
            `;
      supplierRequestsContainerElem.appendChild(card);
    });
  }
}

// NOU: Funcție pentru a șterge o cerere de la furnizori
function deleteSupplierRequest(idToDelete) {
  const confirmDelete = confirm(
    `Ești sigur că vrei să ștergi cererea cu ID #${idToDelete}?`
  );
  if (confirmDelete) {
    // În realitate, ai face un apel API aici pentru a șterge din baza de date
    // await sendDataToServer({ type: 'deleteSupplierRequest', id: idToDelete });

    supplierRequests = supplierRequests.filter(
      (request) => request.id !== idToDelete
    );
    displaySupplierRequests(supplierRequests); // Re-afișează lista actualizată
    alert(`Cererea #${idToDelete} a fost ștearsă.`);
  }
}

// NOU: Funcție pentru a deschide modalul de adăugare cerere
function openAddRequestModal() {
  addRequestModal.classList.add("active");
  // Resetează câmpurile formularului de fiecare dată când se deschide modalul
  addRequestForm.reset();
  // Focus pe primul câmp pentru o experiență mai bună
  newSupplierNameInput.focus();
}

// NOU: Funcție pentru a închide modalul de adăugare cerere
function closeAddRequestModal() {
  addRequestModal.classList.remove("active");
}

// NOU: Funcție pentru a salva o nouă cerere de la furnizori
function saveNewSupplierRequest(event) {
  event.preventDefault(); // Oprește reîncărcarea paginii la trimiterea formularului

  const supplierName = newSupplierNameInput.value.trim();
  const partName = newPartNameInput.value.trim();
  const description = newDescriptionTextarea.value.trim();

  if (!supplierName || !partName || !description) {
    alert("Te rog completează toate câmpurile pentru a adăuga cererea.");
    return;
  }

  const newRequest = {
    id: generateUniqueId(supplierRequests), // Generează un ID unic
    supplierName: supplierName,
    partName: partName,
    description: description,
  };

  // În realitate, ai face un apel API aici pentru a adăuga în baza de date
  // await sendDataToServer({ type: 'addSupplierRequest', data: newRequest });

  supplierRequests.push(newRequest); // Adaugă noua cerere în array-ul local
  displaySupplierRequests(supplierRequests); // Re-afișează lista actualizată
  closeAddRequestModal(); // Închide modalul
  alert(`Cererea de la "${supplierName}" pentru "${partName}" a fost adăugată.`);
}

// Adaugă event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Afișează prima cerere la încărcarea paginii
  if (requests.length > 0) {
    // Adaugă această verificare
    displayRequest(currentRequestIndex);
  } else {
    // Opțional: Ascunde elementele legate de cerere dacă nu există cereri
    document.querySelector(".request-card").style.display = "none";
    document.querySelector(".requests-carousel-section h1").textContent =
      "Nu există cereri în așteptare.";
    // Poți de asemenea ascunde butoanele de navigare etc.
    if (prevButtonDesktop) prevButtonDesktop.style.display = "none";
    if (nextButtonDesktop) nextButtonDesktop.style.display = "none";
    if (prevButtonMobile) prevButtonMobile.style.display = "none";
    if (nextButtonMobile) nextButtonMobile.style.display = "none";
  }

  // NOU: Afișează programările ocupate la încărcarea paginii
  displayOccupiedAppointments(occupiedAppointments);

  if (prevButtonDesktop) {
    prevButtonDesktop.addEventListener("click", goToPrevRequest);
  }
  if (nextButtonDesktop) {
    nextButtonDesktop.addEventListener("click", goToNextRequest);
  }

  // Atașează event listeneri pentru butoanele mobile
  if (prevButtonMobile) {
    prevButtonMobile.addEventListener("click", goToPrevRequest);
  }
  if (nextButtonMobile) {
    nextButtonMobile.addEventListener("click", goToNextRequest);
  }

  // Adaugă verificări pentru a te asigura că butoanele există înainte de a adăuga listeneri
  if (acceptBtn) {
    acceptBtn.addEventListener("click", async () => {
      const currentRequest = requests[currentRequestIndex];
      const adminComment = adminCommentElem.value.trim();

      if (!adminComment) {
        alert("Te rog să introduci un motiv pentru aprobarea cererii.");
        return;
      }

      currentRequest.status = "accepted";
      currentRequest.adminComment = adminComment;

      acceptBtn.style.display = "none";
      refuseBtn.style.display = "none";
      adminCommentElem.readOnly = true;
      adminCommentElem.style.backgroundColor = "#f0f0f0";
      adminCommentElem.style.cursor = "not-allowed";

      await sendDataToServer({
        id: currentRequest.id,
        status: "accepted",
        adminComment: adminComment,
      });

      alert(`Cererea #${currentRequest.id} a fost acceptată!`);
    });
  }

  if (refuseBtn) {
    refuseBtn.addEventListener("click", async () => {
      const currentRequest = requests[currentRequestIndex];
      const adminComment = adminCommentElem.value.trim();

      if (!adminComment) {
        alert("Te rog să introduci un motiv pentru refuzul cererii.");
        return;
      }

      currentRequest.status = "rejected";
      currentRequest.adminComment = adminComment;

      acceptBtn.style.display = "none";
      refuseBtn.style.display = "none";
      adminCommentElem.readOnly = true;
      adminCommentElem.style.backgroundColor = "#f0f0f0";
      adminCommentElem.style.cursor = "not-allowed";

      await sendDataToServer({
        id: currentRequest.id,
        status: "rejected",
        adminComment: adminComment,
      });

      alert(`Cererea #${currentRequest.id} a fost refuzată!`);
    });
  }

  // NOU: Afișează cererile de la furnizori la încărcarea paginii
  displaySupplierRequests(supplierRequests);

  // NOU: Adaugă event listener pentru butonul "Adaugă Cerere Nouă"
  if (addSupplierRequestBtn) {
    addSupplierRequestBtn.addEventListener("click", openAddRequestModal);
  }

  // NOU: Adaugă event listener pentru butonul "Salvează" din modal
  if (addRequestForm) {
    addRequestForm.addEventListener("submit", saveNewSupplierRequest);
  }

  // NOU: Adaugă event listener pentru butonul "Anulează" din modal
  if (cancelNewRequestBtn) {
    cancelNewRequestBtn.addEventListener("click", closeAddRequestModal);
  }

  // NOU: Adaugă event listener pentru a închide modalul la click în afara conținutului
  if (addRequestModal) {
    addRequestModal.addEventListener("click", (event) => {
      // Verifică dacă click-ul a fost direct pe overlay, nu pe conținutul modalului
      if (event.target === addRequestModal) {
        closeAddRequestModal();
      }
    });
  }

  // NOU: Deleagă evenimentul de click pentru butoanele de ștergere
  // Această abordare este necesară deoarece butoanele sunt adăugate dinamic
  if (supplierRequestsContainerElem) {
    supplierRequestsContainerElem.addEventListener("click", (event) => {
      const target = event.target;
      // Verifică dacă elementul pe care s-a dat click este butonul de ștergere sau iconița din el
      const deleteButton = target.closest(".delete-supplier-btn");
      if (deleteButton) {
        const requestId = parseInt(deleteButton.dataset.id);
        deleteSupplierRequest(requestId);
      }
    });
  }
});
