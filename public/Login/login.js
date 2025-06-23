document
  .getElementById("form-login")
  .addEventListener("submit", async (eventObject) => {
    eventObject.preventDefault();

    const email = document.getElementById("email-input").value.trim();
    const password = document.getElementById("password-input").value.trim();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "login failed");
        return;
      }

      localStorage.setItem("jwt", data.jwt);

      alert("Login succesful!");
      updateNavbarLink();
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occured during login");
    }
  });
