import { loadDataFromJson } from "./helper.js"

// Get ID from URL
function getProjectIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Find project by ID
async function getProjectFromJSON(id) {
    const projects = await loadDataFromJson('data/projects.json');
    return projects.find(p => p.id === id);
}

function resolveMediaElement(media) {

    // Check if media is defined and has a type
    if (media.type === "video" && media.source) {
        return `<div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${media.source}?rel=0"
                            title="YouTube video player"
                            allow="accelerometer; 
                            autoplay; 
                            clipboard-write; 
                            encrypted-media; 
                            gyroscope; 
                            picture-in-picture"
                            allowfullscreen>
                    </iframe>
                </div>`.trim();
    }
    else if (media.type === "image" && media.source) {
        return `<div class="flex"><img src="${media.source}" alt="${media.alt}"></img></div>`.trim();
    }
    return ``;
}

function injectProjectPageHTML(project) {

    // Build content blocks
    let content = ``;

    for (let entry of project.content) {
        const titleHTML = `<h2>${entry.title}</h2>`;
        const mediaHTML = resolveMediaElement(entry.media);
        const descHTML = entry.description
            ? `<p>${entry.description}</p>`
            : ``;

            if (titleHTML && mediaHTML && descHTML) {
            content += `<section>
                            <div class="section-container project-container ">
                                ${titleHTML}
                                ${mediaHTML}
                                ${descHTML}
                            </div>
                        </section>`.trim();
            }
    }

    // Retrieve the container where the project content will be injected
    const container = document.getElementById('project');

    // Resolve the overview media element
    const media = resolveMediaElement(project.media);

    // Construct the scroll down indicator HTML
    const scrollDownIndicator = content ? `
    <div class="scroll-indicator">
        <span class="scroll-text">Scroll down</span>
        <span class="scroll-arrow">&#x2193;</span>
    </div>`.trim() : ``;

    // Inject the constructed HTML into the container
    container.innerHTML = `
    <section>    
        <div class="section-container project-container">
            ${media}
            <h1>${project.title}</h1>
            <p>${project.overview}</p>
            ${scrollDownIndicator}
        </div>
    </section>
    ${content}`.trim();
}

async function initProjectPage() {

    // Get the project ID from the URL
    const id = getProjectIDFromURL();

    // Fetch the project data based on the ID
    const project = await getProjectFromJSON(id);

    if (!project) {
        console.log("[ERROR] Unrecognised project id.")
        return;
    }

    // Inject the project page HTML
    injectProjectPageHTML(project);
}

// Wait for the DOM to load before initializing the project page
document.addEventListener("DOMContentLoaded", () => {
    initProjectPage();
});

