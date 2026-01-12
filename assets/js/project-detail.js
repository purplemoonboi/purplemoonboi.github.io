// File: assets/js/project-detail.js

// Get ID from URL
function getProjectIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load JSON data
async function loadProjectsData() {
    const response = await fetch('data/projects.json');
    return await response.json();
}

// Find project by ID
async function loadProjectById(id) {
    const projects = await loadProjectsData();
    return projects.find(p => p.id === id);
}

// Render project detail page
function renderProjectDetail(project) {
    const container = document.getElementById('project-content');

    container.innerHTML = `
        <h1>${project.title}</h1>
        <img src="${project.image}" alt="${project.title}">
        <p class="text-muted">${project.description}</p>

        ${project.content.map(paragraph => `<p>${paragraph}</p>`).join('')}

        <div class="mt-4">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
        </div>
    `;
}

// Main loader
async function loadProjectDetail() {
    const id = getProjectIdFromURL();
    const project = await loadProjectById(id);

    if (!project) {
        document.getElementById('project-content').innerHTML = `
            <h1>Project Not Found</h1>
            <p>The project you're looking for doesn't exist.</p>
        `;
        return;
    }

    renderProjectDetail(project);
}