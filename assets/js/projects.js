import { loadDataFromJson } from "./helper.js"

// Create project card HTML
function createProjectCard(project) {
    return `
<div class="card-container">
        <a href="project.html?id=${project.id}">
        <img src="${project.image}" alt="${project.title}">
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
    container.innerHTML = projects.map(creator).join('');
}

// Load and display featured projects
async function loadFeaturedProjectData() {
    const projects = await loadDataFromJson('data/projects.json');
    const featured = projects.filter(p => p.featured === true);
    renderCards(featured, 'project-list', createProjectCard);
}

// Load and display all projects
async function loadAllProjectData() {
    const projects = await loadDataFromJson('data/projects.json');
    renderCards(projects, 'project-list', createProjectCard);
}

async function loadAllExperienceData() {
    const experience = await loadDataFromJson('data/certifications.json');
    
    const employment = experience.filter(p=> p.type === 0)
    const education = experience.filter(p=> p.type === 1)
    const certifications = experience.filter(p=> p.type === 2)

    renderCards(employment, 'employment-list', createExperienceCard);
    renderCards(education, 'education-list', createExperienceCard);
    renderCards(certifications, 'certification-list', createExperienceCard);
}

document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector('main');
    const sections = document.querySelectorAll('section');

    const navbar = document.querySelector(".nav-bar");
    const navLinks = document.querySelectorAll(".nav-link");
    const fadeSection = document.querySelectorAll(".fade-section"); 

    if ('IntersectionObserver' in window) {

        // Do visiblity check for each major section of the 
        // index page. If intersecting, add the 'visible' class
        // to that section - rendering the section visible.
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } 
        });
        }, {
            threshold: 0.15,                // 15% of the section must be visible
            rootMargin: "0px 0px -10% 0px"  // trigger slightly before entering
        });

        fadeSection.forEach(section => observer.observe(section));

        // Update the navigation link highlight to whichever 
        // section the user is currently viewing. 
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach(link => link.classList.remove("active"));
                    document.querySelector(`.nav-link[href="#${id}"]`).classList.add("active");
                }
            });
        }, {threshold: 0.5});
    
        sections.forEach(sec => navObserver.observe(sec));
    }

    // Update the highlight animation so they animate in/out
    // with respect to the scroll direction.
    let prevScrollY = main.scrollTop;
    main.addEventListener("scroll", () => {
        const currentScrollY = main.scrollTop;

        if(currentScrollY > prevScrollY)
        {
            navbar.classList.add("scroll-up");
            navbar.classList.remove("scroll-down");
        }
        else
        {
            navbar.classList.add("scroll-down");
            navbar.classList.remove("scroll-up");
        }

        prevScrollY = currentScrollY;
    });


    loadFeaturedProjectData();
    loadAllExperienceData();
});