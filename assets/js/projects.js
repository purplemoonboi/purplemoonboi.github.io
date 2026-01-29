import { loadDataFromJson } from "./helper.js";

// Create project card HTML
function createProjectCard(project) {
  return `
<div class="card-container">
        <a href="project.html?id=${project.id}">
        <img src="${project.thumbnail}" alt="${project.title}">
        <div class="card-content">
            <h3 class="card-title">${project.title}</h3>
            <p class="card-desc">${project.description}</p>
        </div>
    </a>
</div>
`.trim();
}

function createExperienceCard(experience) {
  return `
<div class="card-container">
        <div class="card-content">
            <h3 class="card-title">${experience.title}</h3>
            <p class="card-desc">${experience.description}</p>
        </div>
</div>
`.trim();
}

// Render project list to the DOM
function renderCards(projects, containerId, creator) {
  const container = document.getElementById(containerId);
  container.innerHTML = projects.map(creator).join("");
}

// Load and display featured projects
async function loadFeaturedProjectData() {
  const projects = await loadDataFromJson("data/projects.json");
  const featured = projects.filter((p) => p.featured === true);
  renderCards(featured, "project-list", createProjectCard);
}

// Load and display all projects
async function loadAllProjectData() {
  const projects = await loadDataFromJson("data/projects.json");
  renderCards(projects, "project-list", createProjectCard);
}

async function loadAllExperienceData() {
  const experience = await loadDataFromJson("data/certifications.json");

  const employment = experience.filter((p) => p.type === 0);
  const education = experience.filter((p) => p.type === 1);
  const certifications = experience.filter((p) => p.type === 2);

  renderCards(employment, "employment-list", createExperienceCard);
  renderCards(education, "education-list", createExperienceCard);
  renderCards(certifications, "certification-list", createExperienceCard);
}

function validatePhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Convert +44 format to 0 format
  let normalised = cleaned;
  if (cleaned.startsWith("44")) {
    normalised = "0" + cleaned.slice(2);
  }

  // Must be exactly 11 digits and start with 0
  if (!/^0\d{10}$/.test(normalised)) {
    return false;
  }

  // Mobile numbers must start with 07
  return /^07\d{9}$/.test(normalised);
}

function validateEmail(email) {
  // Define the JS Regex pattern for a valid email address
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
}

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const navLinks = document.querySelectorAll(".nav-link");
  const fadeSection = document.querySelectorAll(".fade-section");

  if ("IntersectionObserver" in window) {
    // Do visiblity check for each major section of the
    // index page. If intersecting, add the 'visible' class
    // to that section - rendering the section visible.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.15, // 15% of the section must be visible
        rootMargin: "0px 0px -10% 0px", // trigger slightly before entering
      },
    );

    fadeSection.forEach((section) => observer.observe(section));

    // Update the navigation link highlight to whichever
    // section the user is currently viewing.
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => link.classList.remove("active"));
            document
              .querySelector(`.nav-link[href="#${id}"]`)
              .classList.add("active");
          }
        });
      },
      { threshold: 0.5 },
    );

    sections.forEach((sec) => navObserver.observe(sec));
  }

  loadFeaturedProjectData();
  loadAllExperienceData();

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Clear error messages
      const errorElements = document.querySelectorAll(".error-message");
      errorElements.forEach((el) => (el.textContent = ""));

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      let isValid = true;

      // Validate Name
      if (name === "") {
        document.getElementById("name-error").textContent = "Name is required.";
        document.getElementById("name-error").style.display = "block";
        isValid = false;
      } //

      // Validate Email
      if (!validateEmail(email)) {
        document.getElementById("email-error").textContent =
          "A valid email is required.";
        document.getElementById("email-error").style.display = "block";
        isValid = false;
      }

      // Validate Phone (optional)
      if (!validatePhoneNumber(phone)) {
        document.getElementById("phone-error").textContent =
          "Valid phone number is required.";
        document.getElementById("phone-error").style.display = "block";
        isValid = false;
      }

      // Validate Message
      if (message === "") {
        document.getElementById("message-error").textContent =
          "Message cannot be empty.";
        document.getElementById("message-error").style.display = "block";
        isValid = false;
      }

      if (isValid) {
        // Simulate form submission
        alert("Form submitted successfully!");
        document.getElementById("contact-form").reset();
      }
    });
});
