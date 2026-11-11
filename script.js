document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Context-aware WhatsApp enquiry form.
  const form = document.getElementById("enquiryForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").trim();
      const phone = (data.get("phone") || "").trim();
      const service = data.get("service") || "General enquiry";
      const location = (data.get("location") || "").trim();
      const message = (data.get("message") || "").trim();
      const text = `Hello Xikwembu xa Borehole Jikelelee. My name is ${name}. My contact number is ${phone}. I am enquiring about: ${service}. My location is: ${location}. ${message ? "Additional details: " + message : ""} Please assist me with more information and a quotation.`;
      window.open(`https://wa.me/27627924318?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
  }

  // Pricing buttons create a WhatsApp message with the selected depth and rate.
  document.querySelectorAll(".table-cta").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const depth = link.dataset.depth;
      const price = link.dataset.price;
      const text = `Hello Xikwembu xa Borehole Jikelelee. I am interested in the ${depth} borehole drilling option advertised at ${price}. Please confirm the details, availability and what is included in the quotation.`;
      window.open(`https://wa.me/27627924318?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
  });

  // Any service-specific enquiry link opens WhatsApp with the relevant service prefilled.
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const service = link.dataset.service;
      link.href = `https://wa.me/27627924318?text=${encodeURIComponent("Hello Xikwembu xa Borehole Jikelelee. I would like to enquire about " + service + ". Please assist.")}`;
      link.target = "_blank";
      link.rel = "noopener";
    });
  });
});