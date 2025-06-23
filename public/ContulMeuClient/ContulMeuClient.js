const form = document.getElementById("form-register-app");

form.addEventListener("submit", async (eventObject) => {
  eventObject.preventDefault();

  const datetimeInput = document.getElementById("datetime-input").value;
  const appointment_date = new Date(datetimeInput).toISOString();
  const name = document.getElementById("prod-input").value.trim();
  const descriere = document
    .getElementById("details-problem-input")
    .value.trim();

  try {
    let response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_date, name, descriere }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "error adding appointment");
      return;
    }

    response = await fetch(`/api/appointments/${data.id}/files`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: JSON.stringify({ appointment_date, name, descriere }),
    });
  } catch (error) {
    console.error("Error adding appointment: ", error);
    alert("An error occured while adding appointment");
  }
});
