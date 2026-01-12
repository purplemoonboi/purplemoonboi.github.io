
// Load projects from JSON file
async function loadProjectData() {
    const response = await fetch('data/projects.json');
    const projects = await response.json();
    return projects;
}

// Create project card HTML
function createProjectCard(project) {
    return `
<div class="project-card">
    <a href="project.html?id=${project.id}">
        <img src="${project.image}" alt="${project.title}">
        <div class="project-card-content">
            <h3 class="project-card-title">${project.title}</h3>
            <p class="project-card-desc">${project.description}</p>
        </div>
    </a>
</div>
`.trim();
}

// Render project list to the DOM
function renderProjectList(projects, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = projects.map(createProjectCard).join('');
}

// Load and display featured projects
async function loadFeaturedProjects() {
    const projects = await loadProjectData();
    const featured = projects.filter(p => p.featured === true);
    renderProjectList(featured, 'project-list');
}

// Load and display all projects
async function loadAllProjects() {
    const projects = await loadProjectData();
    renderProjectList(projects, 'project-list');
}