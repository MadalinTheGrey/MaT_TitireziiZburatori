async function includeHTML() {
  const includes = document.querySelectorAll("[data-include]");
  for (const el of includes) {
    const file = el.getAttribute("data-include");
    try {
      const res = await fetch(file);
      const html = await res.text();
      el.innerHTML = html;
    } catch (err) {
      console.error(`Error loading ${file}`, err);
    }
  }
}
document.addEventListener("DOMContentLoaded", includeHTML);
