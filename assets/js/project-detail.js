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

function resolveMediaElement(media){
    // Resolve media element based on type, returns either a video-clip or an image.
    if(media.type==="video" && media.source){
        return `<div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${media.source}?rel=0"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                </div>`.trim();
    }
    else if (media.type==="image" && media.source) {
        return `<div class="flex"><img src="${media.source}" alt="${media.alt}"></img></div>`.trim();
    }
    return ``;
}

function renderProjectDetail(project) {
    const container = document.getElementById('project-content');

    // Main media (video or image)
    const overview = resolveMediaElement(project.media);

    // Build content blocks
    let content = ``;

    for (let entry of project.content) {
        const titleHTML = `<h2>${entry.title}</h2>`;
        const mediaHTML = resolveMediaElement(entry.media);
        const descHTML = entry.description 
            ? `<p>${entry.description}</p>` 
            : ``;

        content +=  titleHTML + `<div >` + mediaHTML + descHTML + `</div>`;
    }

    // Inject into DOM
    container.innerHTML = `
        <div class="project-container">
            <h1>${project.title}</h1>
            ${overview}
            <p>${project.overview}</p>
            ${content}
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

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll(".nav-link");
    const fadeSection = document.querySelectorAll(".fade-section"); 

    loadProjectDetail();
});

