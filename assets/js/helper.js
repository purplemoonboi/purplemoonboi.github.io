// Load data from JSON file
export async function loadDataFromJson(filepath) {
    const response = await fetch(filepath);
    const projects = await response.json();
    return projects;
}