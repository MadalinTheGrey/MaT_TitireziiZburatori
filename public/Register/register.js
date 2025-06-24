document
  .getElementById("form-login")
  .addEventListener("submit", async (eventObject) => {
    eventObject.preventDefault();

    const email = document.getElementById("email-input").value.trim();
    const password = document.getElementById("password-input").value.trim();
    const username = document.getElementById("username-input").value.trim();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error || "register failed");
        return;
      }
      window.location.href = "/Login/login.html";
    } catch (error) {
      console.error("Register error: ", error);
    }
  });
