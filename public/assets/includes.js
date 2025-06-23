async function includeHTML() {
  const includes = document.querySelectorAll("[data-include]");
  for (const el of includes) {
    const file = el.getAttribute("data-include");
    try {
      const res = await fetch(file);
      const html = await res.text();
      el.innerHTML = html;

      if (file.includes("navbar.html")) {
        updateNavbarLink();
      }
    } catch (err) {
      console.error(`Error loading ${file}`, err);
    }
  }
}

/**
 * actualizeaza sectiunea din navbar cu "Contul Meu" in functie de cine e logat si ce rol are
 * @returns {void}
 */
function updateNavbarLink() {
  const contulMeuLink = document.getElementById("Contul-Meu");
  if (!contulMeuLink) {
    console.warn("Elementul 'Contul-Meu' nu a fost găsit în navbar.");
    return;
  }
  let isLoggedIn = false;
  let userRole = null;

  try {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded && decoded.roles) {
        isLoggedIn = true;
        if (decoded.roles.includes("client")) {
          userRole = "client";
        } else if (decoded.roles.includes("admin")) {
          userRole = "admin";
        }
      }
    }
  } catch (error) {
    console.error("Eroare la decodificarea token-ului JWT:", error); //eroare la decodificare => tratez utilizatorul ca neautentificat
    localStorage.removeItem("jwt"); //sterg tokenul invalid
  }

  if (isLoggedIn) {
    contulMeuLink.textContent = "Contul Meu";
    if (userRole === "client") {
      contulMeuLink.href = "/ContulMeuClient/ContulMeuClient.html";
    } else if (userRole === "admin") {
      contulMeuLink.href = "/Adminpage/adminpage.html";
    }
  } else {
    contulMeuLink.textContent = "Login";
    contulMeuLink.href = "/Login/login.html";
  }
}

document.addEventListener("DOMContentLoaded", includeHTML);
