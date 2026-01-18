import { loadDataFromJson } from "./helper.js"

// Get ID from URL
function getProjectIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Find project by ID
async function loadProjectById(id) {
    const projects = await loadDataFromJson('data/projects.json');
    return projects.find(p => p.id === id);
}

// Render project detail page
function renderProjectDetail(project) {
    const container = document.getElementById('project-content');
    container.innerHTML = `
        <div class="project-container">
            <h1>${project.title}</h1>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
            ${project.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
            <div class="tag-container">
                ${project.tags.map(tag => `<span class="tag-item">${tag}</span>`).join(' ')}
            </div>
        </div>
    `.trim();
}

// Main loader
async function loadProjectDetail() {
    const id = getProjectIdFromURL();
    const project = await loadProjectById(id);

    if (!project) {
        console.log("[ERROR] Unrecognised project id.")
        return;
    }

    renderProjectDetail(project);
}

loadProjectDetail();
