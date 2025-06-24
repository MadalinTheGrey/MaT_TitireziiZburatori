const token = localStorage.getItem("jwtToken");
if (!token) {
  window.location.href = "Login/login.html"; // Redirect to login
} else {
  // Optionally decode and check role (if JWT)
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (!payload.roles.includes("admin")) {
    alert("Nu ai permisiunea de a accesa această pagină!");
      window.location.href = "HomePage/homepage.html";
  }
  
    if (!payload.roles.includes("client")) {
        alert("Nu ai permisiunea de a accesa această pagină!");
        window.location.href = "HomePage/homepage.html";
  }
}
