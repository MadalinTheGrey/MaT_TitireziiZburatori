const form = document.getElementById("form-register-app");

form.addEventListener("submit", async (eventObject) => {
  eventObject.preventDefault();

  const datetimeInput = document.getElementById("datetime-input").value;
  const app_date = new Date(datetimeInput);
  const today = new Date(Date.now());
  if (app_date <= today) {
    alert("Please select a date and time later than now");
    return;
  }
  const appointment_date = app_date.toISOString();
  const title = document.getElementById("prod-input").value.trim();
  const description = document
    .getElementById("details-problem-input")
    .value.trim();

  const token = localStorage.getItem("jwt");

  try {
    let response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        appointment_date,
        title,
        description,
      }),
    });

    let data = await response.json();

    if (!response.ok) {
      console.error(data.error || "error adding appointment");
      if (response.status === 409) {
        alert(
          "Data si ora aleasa se suprapune cu alte programari. Va rugam sa modificati"
        );
      }
      return;
    }

    const files = document.getElementById("add-file").files;
    if (files.length <= 0) {
      loadAppointments();
      return;
    }
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }
    response = await fetch(`/api/appointments/${data.id}/files`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    data = await response.json();

    if (!response.ok) {
      console.error(data.error || "Failed adding appointment");
    }

    await loadAppointments();
  } catch (error) {
    console.error("Error adding appointment: ", error);
  }
});

async function loadAppointments() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch("/api/appointments", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to load appointments");
    }

    const appointmentsJson = await response.json();
    const container = document.querySelector(".requests-container");
    container.innerHTML = "";

    appointmentsJson.appointments.forEach((appointment) => {
      const card = document.createElement("div");
      card.className = "request-card";

      const title = document.createElement("h3");
      title.textContent = appointment.title;

      const description = document.createElement("p");
      description.textContent = appointment.description;

      const status = document.createElement("span");
      status.className = "status " + appointment.is_approved.toLowerCase();
      status.textContent =
        appointment.is_approved.charAt(0) +
        appointment.is_approved.slice(1).toLowerCase();

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(status);

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadAppointments);
