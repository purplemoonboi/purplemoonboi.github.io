import { loadDataFromJson } from "./helper.js";

// Create project card HTML
function injectHTML_ProjectCard(project) {
  return `
<div class="card-container expand">
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
      // Trigger when a section crosses the middle of the screen, which
      // also works for sections taller than the screen on mobile
      { rootMargin: "-50% 0px -50% 0px" },
    );

    // Run the above function for each section
    sections.forEach((sec) => navObserver.observe(sec));
  }

  loadProjectsFromJSON();
  loadExperienceFromJSON();
});
