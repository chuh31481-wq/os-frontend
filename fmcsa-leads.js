// Yeh function GitHub API se FMCSA ki CSV files ki list haasil karega
async function fetchFmcsaLeads() {
    // --- YAHAN APNI BACKEND REPO KI SAHI DETAILS DAALEIN ---
    const REPO_OWNER = "chuh31481-wq";      // Aapka GitHub username
    const REPO_NAME = "fmcsa-result-";       // Aapki FMCSA wali backend repo ka naam
    const FOLDER_PATH = "output";           // Folder ka naam jahan CSVs hain

    const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`;

    const leadsListElement = document.getElementById('leads-list');
    if (!leadsListElement) return;

    leadsListElement.innerHTML = '<li>Loading...</li>'; // Loading message dikhana

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Folder not found. Make sure the 'output' folder exists in the '${REPO_NAME}' repository.`);
            }
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        const files = await response.json();

        // GitHub 404 error na de, balke ek message de agar folder khaali ho
        if (files.message && files.message.includes("Not Found")) {
             leadsListElement.innerHTML = '<li>The "output" folder does not exist yet. Run the FMCSA extractor first.</li>';
             return;
        }

        if (!Array.isArray(files) || files.length === 0) {
            leadsListElement.innerHTML = '<li>No lead files found in the "output" folder.</li>';
            return;
        }

        leadsListElement.innerHTML = ''; 
        files.slice().reverse().forEach(file => { // .slice().reverse() taake nayi file upar aaye
            if (file.name.endsWith('.csv')) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${file.download_url}" target="_blank">${file.name}</a> (Size: ${Math.round(file.size / 1024)} KB)`;
                leadsListElement.appendChild(listItem);
            }
        });

    } catch (error) {
        console.error("Error fetching leads:", error);
        leadsListElement.innerHTML = `<li>Error loading leads: ${error.message}</li>`;
    }
}
