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
    console.error("Eroare la decodificarea token-ului JWT:", error);
    localStorage.removeItem("jwt");
  }

  const logoutLink = document.getElementById("Logout");
  if (isLoggedIn) {
    contulMeuLink.textContent = "Contul Meu";
    if (userRole === "client") {
      contulMeuLink.href = "/ContulMeuClient/ContulMeuClient.html";
    } else if (userRole === "admin") {
      contulMeuLink.href = "/Adminpage/adminpage.html";
    }
    logoutLink.style.display = "block";
  } else {
    contulMeuLink.textContent = "Login";
    contulMeuLink.href = "/Login/login.html";
    logoutLink.style.display = "none";
  }

  logoutLink.addEventListener("click", () => {
    localStorage.removeItem("jwt");
    window.location.href = "/HomePage/homepage.html";
  });
}

function verifyAuth() {
  const token = localStorage.getItem("jwt");
  if (
    !token &&
    (window.location.pathname === "/ContulMeuClient/ContulMeuClient.html" ||
      window.location.pathname === "/Adminpage/adminpage.html" ||
      window.location.pathname === "/Supplies/supplies.html")
  ) {
    window.location.pathname = "/Login/login.html";
  } else if (token) {
    const decoded = jwt_decode(token);
    if (
      !decoded.roles.includes("admin") &&
      (window.location.pathname === "/Adminpage/adminpage.html" ||
        window.location.pathname === "/Supplies/supplies.html")
    ) {
      window.location.pathname = "/HomePage/homepage.html";
    }

    if (
      !decoded.roles.includes("client") &&
      window.location.pathname === "/ContulMeuClient/ContulMeuClient.html"
    ) {
      window.location.pathname = "/HomePage/homepage.html";
    }
  }
}

document.addEventListener("DOMContentLoaded", verifyAuth);
document.addEventListener("DOMContentLoaded", includeHTML);
