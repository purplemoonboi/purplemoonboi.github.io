import { loadDataFromJson } from "./helper.js";

// Create project card HTML
function injectHTML_ProjectCard(project) {
  return `
<div class="card-container">
        <a href="project.html?id=${project.id}">
        <div>
            <img src="${project.thumbnail}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        </div>
    </a>
</div>
`.trim();
}

function injectHTML_ExperienceCard(experience) {
  return `
<div class="card-container">
        <div>
            <h2>${experience.title}</h2>
            <p>${experience.description}</p>
        </div>
</div>
`.trim();
}

function injectHTML_Card(context, containerID, fnHTMLInjectionCallback) {
  const container = document.getElementById(containerID);
  container.innerHTML = context.map(fnHTMLInjectionCallback).join("");
}

// Load and display featured projects
async function loadProjectsFromJSON() {
  const projects = await loadDataFromJson("data/projects.json");
  const featured = projects.filter((p) => p.featured === true);
  injectHTML_Card(featured, "project-list", injectHTML_ProjectCard);
}

async function loadExperienceFromJSON() {
  const experience = await loadDataFromJson("data/certifications.json");
  const employment = experience.filter((p) => p.type === 0);
  const education = experience.filter((p) => p.type === 1);

  injectHTML_Card(employment, "employment-list", injectHTML_ExperienceCard);
  injectHTML_Card(education, "education-list", injectHTML_ExperienceCard);
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

  // Get a list of all HTML tags 
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  const fadeSection = document.querySelectorAll(".section-fade");

  if ("IntersectionObserver" in window) {

    // Create a function object which iterates over the list 
    // of section objects, conducts a visibility test 
    // and updates the section's class to visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.15, // % of the section must be visible
        rootMargin: "0px 0px -10% 0px", // trigger slightly before entering
      },
    );

    // Run the above function object for each section
    fadeSection.forEach((section) => observer.observe(section));

    // Update the navigation link highlight to whichever
    // section the user is currently viewing.
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            
            const id = entry.target.getAttribute("id");

            // Iterate over each nav link object and remove
            // the active tag.
            navLinks.forEach((link) => link.classList.remove("active"));
            
            // Update whichever nav-link matches the current visible
            // section - using the section's id and checking the 
            // nav link's href label which should match
            document
              .querySelector(`.nav-link[href="#${id}"]`)
              .classList.add("active");
          }
        });
      },
      { threshold: 0.5 },
    );

    // Run the above function for each section
    sections.forEach((sec) => navObserver.observe(sec));
  }

  loadProjectsFromJSON();
  loadExperienceFromJSON();

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
