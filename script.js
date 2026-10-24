/* =========================================================
   LOUISSE KYLE E. GOBIAN — PORTFOLIO INTERACTIONS
   Vanilla JavaScript only.
   ========================================================= */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Show the portrait when profile.jpg is present; otherwise keep the LK initials visible.
  const profilePhoto = document.querySelector(".profile-photo");
  if (profilePhoto) {
    profilePhoto.addEventListener("load", () => profilePhoto.classList.add("photo-loaded"));
    profilePhoto.addEventListener("error", () => profilePhoto.classList.remove("photo-loaded"));
    if (profilePhoto.complete && profilePhoto.naturalWidth > 0) profilePhoto.classList.add("photo-loaded");
  }
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const progressBar = document.querySelector(".scroll-progress");
  const orb = document.getElementById("interactive-orb");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile navigation
  function closeMenu() {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      navLinks.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });
    navItems.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  // Scroll reveal animation; show everything if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Reading progress bar.
  let ticking = false;
  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // Highlight the navigation item for the section currently in view.
  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Interactive 3D-inspired orb. Pointer movement gently tilts the object.
  const heroVisual = document.querySelector(".hero-visual");
  if (orb && heroVisual && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    heroVisual.addEventListener("pointermove", event => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      orb.style.animationPlayState = "paused";
      orb.style.transform = `translateY(-4px) rotateX(${(-y * 18).toFixed(2)}deg) rotateY(${(x * 22).toFixed(2)}deg)`;
    });
    heroVisual.addEventListener("pointerleave", () => {
      orb.style.animationPlayState = "running";
      orb.style.transform = "";
    });
  }

  // Contact form: validates fields, then prepares a message in the visitor's email app.
  // For true server-side form submissions, connect Formspree, EmailJS, or your own backend.
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const recipientEmail = "kylegobian10@gmail.com"; // Replace with your real public email address.

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      formStatus.classList.remove("is-error", "is-success");

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        formStatus.textContent = "Please check the form and complete each required field.";
        formStatus.classList.add("is-error");
        return;
      }

      if (recipientEmail === "your.email@example.com") {
        formStatus.textContent = "Before using the form, replace the placeholder recipient email in script.js with your real email address.";
        formStatus.classList.add("is-error");
        return;
      }

      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const sender = String(data.get("email") || "").trim();
      const subject = String(data.get("subject") || "").trim();
      const message = String(data.get("message") || "").trim();
      const body = `Name: ${name}\nReply email: ${sender}\n\n${message}`;
      const mailto = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      formStatus.textContent = "Your email app should open with the message prepared. Review it and press Send to deliver it.";
      formStatus.classList.add("is-success");
      window.location.href = mailto;
    });
  }

  // Download a basic, printable CV generated from the known portfolio details.
  // Add verified education, contact details, and project information before sharing.
  const downloadCvButton = document.getElementById("download-cv");
  if (downloadCvButton) {
    downloadCvButton.addEventListener("click", () => {
      const cvHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>CV — Louisse Kyle E. Gobian</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;color:#202820;max-width:800px;margin:40px auto;padding:0 32px;line-height:1.55}
  h1{font-size:30px;margin-bottom:4px;color:#143d29}h2{font-size:15px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #a7c9b3;padding-bottom:6px;margin-top:28px}
  .role{color:#23784c;font-weight:bold}.note{padding:12px;background:#f2f7f3;border-left:3px solid #278957;font-size:12px}
  ul{padding-left:20px}.muted{color:#58665d;font-size:13px}
  @media print{body{margin:0 auto;padding:0 10px}.note{background:#fff}}
</style></head><body>
<h1>Louisse Kyle E. Gobian</h1>
<div class="role">IT Student / Aspiring Developer</div>
<p class="muted">Philippines · Email: kylegobian10@gmail.com · (+63)9073272989</p>
<h2>Profile</h2>
<p>IT student and aspiring developer interested in technology, web development, problem-solving, and continuous learning. Building practical skills through coursework and student or personal projects.</p>
<h2>Technical Skills</h2>
<ul><li>Programming Languages: Python, Java, and C++</li><li>Computer Hardware: Basic computer hardware troubleshooting</li><li>Networking: Basic computer networking concepts and troubleshooting</li></ul>
<h2>Education</h2>
<p><strong>Cebu Eastern College, Inc.</strong><br>Bachelor of Science in Information Technology (BSIT) · 2023 - 2027</p>
<h2>Projects</h2>
<p><strong>IRIS - Smart Home Security (Capstone Concept)</strong><br>A proposed AI-assisted home security concept involving facial recognition, predefined behavior analysis, IoT sensors, and a mobile interface. Describe your actual contribution and current project status accurately.</p>

<h2>Certifications & Training</h2>
<p>N/A</p>
<h2>Additional Information</h2>
<p>N/A</p>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;
      const blob = new Blob([cvHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Louisse-Kyle-E-Gobian-CV-template.html";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    });
  }

  // Current year in footer.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Placeholder social links should not jump to the top of the page.
  document.querySelectorAll(".social-placeholder").forEach(link => {
    link.addEventListener("click", event => {
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
        const status = document.createElement("span");
        status.className = "social-hint";
        status.textContent = "Add your real profile URL in index.html.";
        status.style.cssText = "display:block;color:#76f0b6;font-size:10px;margin-top:8px;";
        const parent = link.closest(".contact-details");
        const oldHint = parent.querySelector(".social-hint");
        if (oldHint) oldHint.remove();
        parent.appendChild(status);
      }
    });
  });
});
