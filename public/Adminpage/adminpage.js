let requests = [
  {
    id: 748,
    productName: "Bicicletă Calypso 1000",
    problemDescription:
      "Am intrat cu bicicleta în copacul din imagine și am stricat roata din spate. Mi-aș dori să o reparați și apoi să vopsesc bicicleta în roșu (cuminte după ce se ferește după copacii de mine!)",
    dateTime: "30.02.1999",
    mediaUrls: [
      // Renumit de la 'imageUrls' la 'mediaUrls'
      "https://images.pexels.com/photos/15603043/pexels-photo-15603043.jpeg", // Imagine
      "https://images.pexels.com/photos/5446297/pexels-photo-5446297.jpeg", // Imagine
      "https://images.pexels.com/photos/1595476/pexels-photo-1595476.jpeg", // Imagine (pentru a testa scroll-ul)
      "/assets/videos/video1.mp4", // VIDEOCLIP
    ],
    status: "pending", // pending, approved, rejected
    adminComment: "",
  },
  {
    id: 749,
    productName: "Laptop Dell XPS 15",
    problemDescription:
      "Ecranul a început să pâlpâie intermitent, iar bateria se descarcă foarte repede. Am nevoie de el pentru facultate.",
    dateTime: "15.05.2025 10:30",
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
      "https://images.pexels.com/photos/5446297/pexels-photo-5446297.jpeg",
      "/assets/videos/video1.mp4",
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

// Simulează datele pentru programările ocupate
let occupiedAppointments = [
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

//Simulează datele pentru cererile de la furnizori
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

const acceptBtn = document.getElementById("acceptBtn");
const refuseBtn = document.getElementById("refuseBtn");

const prevButtonDesktop = document.querySelector(
  ".prev-button.desktop-nav-button"
);
const nextButtonDesktop = document.querySelector(
  ".next-button.desktop-nav-button"
);

// Referințe la butoanele de navigare mobile
const prevButtonMobile = document.querySelector(".prev-button-mobile");
const nextButtonMobile = document.querySelector(".next-button-mobile");

// Referințe la elementele pentru programări ocupate
const occupiedAppointmentsListElem = document.getElementById(
  "occupiedAppointmentsList"
);
const noAppointmentsMessageElem = document.getElementById(
  "noAppointmentsMessage"
);

// Referințe la elementele pentru cererile de la furnizori
const supplierRequestsContainerElem = document.getElementById(
  "supplierRequestsContainer"
);
const noSupplierRequestsMessageElem = document.getElementById(
  "noSupplierRequestsMessage"
);

// Referințe pentru modalul de adăugare cerere
const addSupplierRequestBtn = document.getElementById("addSupplierRequestBtn");
const addRequestModal = document.getElementById("addRequestModal");
const addRequestForm = document.getElementById("addRequestForm");
const newSupplierNameInput = document.getElementById("newSupplierName");
const newPartNameInput = document.getElementById("newPartName");
const newDescriptionTextarea = document.getElementById("newDescription");
const saveNewRequestBtn = document.getElementById("saveNewRequestBtn");
const cancelNewRequestBtn = document.getElementById("cancelNewRequestBtn");

/**
 * Funcție helper pentru a determina tipul de fișier pe baza extensiei.
 * @param {string} url - URL-ul fișierului.
 * @returns {string} - 'image' sau 'video' sau 'unknown'.
 */
function getMediaType(url) {
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "flv"];

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
    // Dacă indexul este invalid, dar există cereri, ajustează indexul la o valoare validă
    currentRequestIndex = Math.max(0, Math.min(index, requests.length - 1));
    displayRequest(currentRequestIndex);
    return;
  } else {
    // Afișează cardul și butoanele de navigare
    document.querySelector(".request-card").style.display = "flex";
    document.querySelector(".main-title").textContent = "CERERI CLIENȚI"; // Resetează titlul
    if (prevButtonDesktop) prevButtonDesktop.style.display = "";
    if (nextButtonDesktop) nextButtonDesktop.style.display = "";
    if (prevButtonMobile) prevButtonMobile.style.display = "";
    if (nextButtonMobile) nextButtonMobile.style.display = "";
  }

  const request = requests[index];

  requestIdElem.textContent = String(request.id);
  productNameElem.textContent = request.productName;
  problemDescriptionElem.textContent = request.problemDescription;
  dateTimeElem.textContent = request.dateTime;
  adminCommentElem.value = request.adminComment; // Setează valoarea textarea-ului

  // Afișează imaginile ȘI videoclipurile
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

// Funcție pentru a afișa programările ocupate
function displayOccupiedAppointments(appointments) {
  occupiedAppointmentsListElem.innerHTML = ""; // Golește lista existentă

  if (appointments.length === 0) {
    noAppointmentsMessageElem.style.display = "block"; // Afișează mesajul "Nu există..."
  } else {
    noAppointmentsMessageElem.style.display = "none"; // Ascunde mesajul

    appointments.forEach((appointment) => {
      const listItem = document.createElement("li");

      const dateSpan = document.createElement("span");
      dateSpan.className = "appointment-date";
      dateSpan.textContent = appointment.date;

      const timeSpan = document.createElement("span");
      timeSpan.className = "appointment-time";
      timeSpan.textContent = appointment.time;

      const clientSpan = document.createElement("span");
      clientSpan.className = "appointment-client";
      clientSpan.textContent = appointment.clientName;

      listItem.appendChild(dateSpan);
      listItem.appendChild(timeSpan);
      listItem.appendChild(clientSpan);

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

// Funcție pentru a afișa cererile de la furnizori, cu buton de ștergere
function displaySupplierRequests(requests) {
  supplierRequestsContainerElem.innerHTML = ""; // Golește containerul existent

  if (requests.length === 0) {
    noSupplierRequestsMessageElem.style.display = "block";
  } else {
    noSupplierRequestsMessageElem.style.display = "none";

    requests.forEach((request) => {
      const card = document.createElement("div");
      card.classList.add("supplier-request-card");

      const supplierNameH3 = document.createElement("h3");
      supplierNameH3.textContent = request.supplierName;

      const partNameText = document.createElement("p");
      partNameText.className = "part-name";
      partNameText.textContent = request.partName;

      const partDescText = document.createElement("p");
      partDescText.className = "part-description";
      partDescText.textContent = request.description;

      const deleteOrderButton = document.createElement("button");
      deleteOrderButton.className = "delete-supplier-btn";
      deleteOrderButton.dataset.id = request.id;

      const icon = document.createElement("i");
      icon.className = "uil uil-trash";

      deleteOrderButton.appendChild(icon);

      card.appendChild(supplierNameH3);
      card.appendChild(partNameText);
      card.appendChild(partDescText);
      card.appendChild(deleteOrderButton);

      supplierRequestsContainerElem.appendChild(card);
    });
  }
}

// Funcție pentru a șterge o cerere de la furnizori
async function deleteSupplierRequest(idToDelete) {
  const confirmDelete = confirm(
    `Ești sigur că vrei să ștergi cererea cu ID #${idToDelete}?`
  );
  if (confirmDelete) {
    try {
      const token = localStorage.getItem("jwt");

      const response = await fetch(`/api/orders/${idToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.warn("Invalid JSON: ", text);
        }
      }

      if (!response.ok) {
        alert(data.error || "Error deleting order");
        return;
      }

      supplierRequests = supplierRequests.filter(
        (request) => request.id !== idToDelete
      );
      displaySupplierRequests(supplierRequests); // Re-afișează lista actualizată
      alert(`Cererea #${idToDelete} a fost ștearsă.`);
    } catch (error) {
      console.error("Error adding order: ", error);
      alert("An error occured while adding order");
    }
  }
}

// Funcție pentru a deschide modalul de adăugare cerere
function openAddRequestModal() {
  addRequestModal.classList.add("active");
  // Resetează câmpurile formularului de fiecare dată când se deschide modalul
  addRequestForm.reset();
  // Focus pe primul câmp pentru o experiență mai bună
  newSupplierNameInput.focus();
}

// Funcție pentru a închide modalul de adăugare cerere
function closeAddRequestModal() {
  addRequestModal.classList.remove("active");
}

// Funcție pentru a salva o nouă cerere de la furnizori
async function saveNewSupplierRequest(event) {
  event.preventDefault(); // Oprește reîncărcarea paginii la trimiterea formularului

  const supplierName = newSupplierNameInput.value.trim();
  const partName = newPartNameInput.value.trim();
  const description = newDescriptionTextarea.value.trim();

  if (!supplierName || !partName) {
    alert("Trebuie completat un furnizor si numele piesei");
    return;
  }

  const order = {
    provider: supplierName,
    supply_name: partName,
    description: description || "",
  };

  try {
    const token = localStorage.getItem("jwt");

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Error adding order");
      return;
    }

    const newSuppReq = {
      id: data.id,
      supplierName: order.provider,
      partName: order.supply_name,
      description: order.description,
    };

    supplierRequests.push(newSuppReq); // Adaugă noua cerere în array-ul local
    displaySupplierRequests(supplierRequests); // Re-afișează lista actualizată
    closeAddRequestModal(); // Închide modalul
    alert(
      `Cererea de la "${supplierName}" pentru "${partName}" a fost adăugată.`
    );
  } catch (error) {
    console.error("Error adding order: ", error);
    alert("An error occured while adding order");
  }
}

// Adaugă event listeners
document.addEventListener("DOMContentLoaded", async () => {
  // Afișează prima cerere la încărcarea paginii
  await fetchAppointments();
  await fetchOrders();
  if (requests.length > 0) {
    displayRequest(currentRequestIndex);
  } else {
    //Ascunde elementele legate de cerere dacă nu există cereri
    document.querySelector(".request-card").style.display = "none";
    document.querySelector(".requests-carousel-section h1").textContent =
      "Nu există cereri în așteptare.";
    if (prevButtonDesktop) prevButtonDesktop.style.display = "none";
    if (nextButtonDesktop) nextButtonDesktop.style.display = "none";
    if (prevButtonMobile) prevButtonMobile.style.display = "none";
    if (nextButtonMobile) nextButtonMobile.style.display = "none";
  }

  //Afișează programările ocupate la încărcarea paginii
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

  // Verifica ca butoanele exista
  if (acceptBtn) {
    acceptBtn.addEventListener("click", async () => {
      const currentRequest = requests[currentRequestIndex];
      const adminComment = adminCommentElem.value.trim();

      if (!adminComment) {
        alert("Te rog să introduci un motiv pentru aprobarea cererii.");
        return;
      }

      currentRequest.status = "approved";
      currentRequest.adminComment = adminComment;

      await sendReviewToServer(currentRequest);
      requests[currentRequestIndex] = currentRequest;
      displayRequest(currentRequestIndex);
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

      await sendReviewToServer(currentRequest);
      requests[currentRequestIndex] = currentRequest;
      displayRequest(currentRequestIndex);
    });
  }

  // Afișează cererile de la furnizori la încărcarea paginii
  displaySupplierRequests(supplierRequests);

  // Adaugă event listener pentru butonul "Adaugă Cerere Nouă"
  if (addSupplierRequestBtn) {
    addSupplierRequestBtn.addEventListener("click", openAddRequestModal);
  }

  // Adaugă event listener pentru butonul "Salvează" din modal
  if (addRequestForm) {
    addRequestForm.addEventListener("submit", saveNewSupplierRequest);
  }

  // Adaugă event listener pentru butonul "Anulează" din modal
  if (cancelNewRequestBtn) {
    cancelNewRequestBtn.addEventListener("click", closeAddRequestModal);
  }

  // Adaugă event listener pentru a închide modalul la click în afara conținutului
  if (addRequestModal) {
    addRequestModal.addEventListener("click", (event) => {
      // Verifică dacă click-ul a fost direct pe overlay, nu pe conținutul modalului
      if (event.target === addRequestModal) {
        closeAddRequestModal();
      }
    });
  }

  // Deleagă evenimentul de click pentru butoanele de ștergere
  // Această abordare este necesară deoarece butoanele sunt adăugate dinamic
  if (supplierRequestsContainerElem) {
    supplierRequestsContainerElem.addEventListener("click", async (event) => {
      const target = event.target;
      // Verifică dacă elementul pe care s-a dat click este butonul de ștergere sau iconița din el
      const deleteButton = target.closest(".delete-supplier-btn");
      if (deleteButton) {
        const requestId = parseInt(deleteButton.dataset.id);
        await deleteSupplierRequest(requestId);
      }
    });
  }
});

async function fetchAppointments() {
  requests = [];
  const token = localStorage.getItem("jwt");

  let response = await fetch("/api/appointments?is_approved=pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load appointments");
  }

  const appointments = data.appointments;

  //adauga appointmenturile in array-ul cu cele pending din front
  requests = appointments.map((appointment) => ({
    id: appointment.id,
    productName: appointment.title,
    problemDescription: appointment.description,
    dateTime: convertDateFormat(appointment.appointment_date),
    mediaUrls: [...appointment.files],
    status: appointment.is_approved.toLowerCase(),
    adminComment: appointment.admin_review || "",
  }));

  response = await fetch("/api/appointments?is_approved=approved", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  data = await response.json();

  if (!response.ok) {
    throw new Error(date.error || "Error fetching appointments");
  }

  const approvedAppointments = data.appointments;

  occupiedAppointments = approvedAppointments.map((appointment) => {
    const completeDate = new Date(appointment.appointment_date);
    return {
      date: completeDate.toLocaleDateString("ro-RO"),
      time: completeDate.toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      clientName: appointment.title,
    };
  });
}

function convertDateFormat(date) {
  return new Date(date).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendReviewToServer(appointment) {
  const review = {
    is_approved: appointment.status,
    admin_review: appointment.adminComment,
  };
  const token = localStorage.getItem("jwt");
  const response = await fetch(`/api/appointments/${appointment.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      is_approved: review.is_approved,
      admin_review: review.admin_review,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data.error || "Error adding review");
    return;
  }

  alert("Review adaugat cu succes");
}

async function fetchOrders() {
  supplierRequests = [];
  const token = localStorage.getItem("jwt");

  let response = await fetch("/api/orders", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error on fetching orders");
  }

  const orders = data.orders;

  supplierRequests = orders.map((order) => ({
    id: order.id,
    supplierName: order.provider,
    partName: order.supply_name,
    description: order.description,
  }));
}
