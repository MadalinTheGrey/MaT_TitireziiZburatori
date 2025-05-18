document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formular-inscriere");
  const formMessage = document.getElementById("form-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const datetimeInput = document.getElementById("datetime-input").value;

    const selectedDateTime = new Date(datetimeInput).toISOString();

    //prone to change after backend design
    //just as an example
    fetch("/check-event-overlap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ datetime: selectedDateTime }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.overlap) {
          messageElement.style.display = "block";
          messageElement.textContent =
            "There is already an event scheduled at that time. Please choose a different time.";
        } else {
          messageElement.style.display = "none";
          alert("Event scheduled successfully!");
        }
      })
      .catch((error) => {
        console.error("Error checking event overlap:", error);
      });
  });
});
