// Simulează datele cererilor. În aplicația reală, acestea ar veni de la un API/bază de date.
const requests = [
  {
    id: 748,
    productName: "Bicicletă Calypso 1000",
    problemDescription:
      "Am intrat cu bicicleta în copacul din imagine și am stricat roata din spate. Mi-aș dori să o reparați și apoi să vopsesc bicicleta în roșu (cuminte după ce se ferește după copacii de mine!)",
    dateTime: "30.02.1999",
    imageUrl:
      "https://images.pexels.com/photos/15603043/pexels-photo-15603043.jpeg",
    status: "pending", // pending, accepted, rejected
    adminComment: "",
  },
  {
    id: 749,
    productName: "Laptop Dell XPS 15",
    problemDescription:
      "Ecranul a început să pâlpâie intermitent, iar bateria se descarcă foarte repede. Am nevoie de el pentru facultate.",
    dateTime: "15.05.2025 10:30",
    imageUrl:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder pentru altă imagine
    status: "pending",
    adminComment: "",
  },
  {
    id: 750,
    productName: "Telefon Samsung Galaxy S23",
    problemDescription:
      "Camera frontală nu mai funcționează după ce mi-a căzut pe jos. De asemenea, sticla de pe spate este spartă.",
    dateTime: "01.06.2025 14:00",
    imageUrl: "https://via.placeholder.com/400x300?text=Telefon+Samsung", // Placeholder pentru altă imagine
    status: "pending",
    adminComment: "",
  },
  {
    id: 751,
    productName: "Frigider Arctic",
    problemDescription:
      "Nu mai răcește deloc, iar becul interior nu se mai aprinde. Alimentele din el s-au stricat.",
    dateTime: "20.06.2025 09:00",
    imageUrl: "https://via.placeholder.com/400x300?text=Frigider+Arctic", // Placeholder
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

let currentRequestIndex = 0; // Indexul cererii curente afișate

// Referințe la elementele DOM
const requestIdElem = document.getElementById("requestId");
const productNameElem = document.getElementById("productName");
const problemDescriptionElem = document.getElementById("problemDescription");
const dateTimeElem = document.getElementById("dateTime");
const adminCommentElem = document.getElementById("adminComment");
const requestImageElem = document.getElementById("requestImage");
const acceptBtn = document.getElementById("acceptBtn");
const refuseBtn = document.getElementById("refuseBtn");

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

/**
 * Funcție pentru a afișa detaliile unei cereri specifice.
 * @param {number} index - Indexul cererii în array-ul `requests`.
 */
function displayRequest(index) {
  if (index < 0 || index >= requests.length) {
    console.warn("Index invalid pentru cerere.");
    return;
  }

  const request = requests[index];

  requestIdElem.textContent = request.id;
  productNameElem.textContent = request.productName;
  problemDescriptionElem.textContent = request.problemDescription;
  dateTimeElem.textContent = request.dateTime;
  adminCommentElem.value = request.adminComment; // Setează valoarea textarea-ului
  requestImageElem.src = request.imageUrl;
  requestImageElem.alt = `Imagine pentru cererea #${request.id}`;

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

// Adaugă event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Afișează prima cerere la încărcarea paginii
  displayRequest(currentRequestIndex);

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
});
