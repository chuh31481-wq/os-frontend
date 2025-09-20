document.addEventListener('DOMContentLoaded', function() {
    const welcomeUserSpan = document.getElementById('welcome-user');
    const logoutButton = document.getElementById('logoutButton');
    const leadsListElement = document.getElementById('leads-list');
    const refreshLeadsBtn = document.getElementById('refreshLeadsBtn');

    // Naya, Supabase wala Logout Logic
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert(`Logout failed: ${error.message}`);
            } else {
                alert("You have been logged out.");
                window.location.href = 'index.html';
            }
        });
    }

    // User ka naam navbar mein dikhana
    async function displayUserInfo() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && welcomeUserSpan) {
            welcomeUserSpan.textContent = `Welcome, ${user.email}`;
        }
    }

    // GitHub se FMCSA lead files laane ka logic
    async function fetchFmcsaLeads() {
        if (!leadsListElement) return;
        leadsListElement.innerHTML = '<li><p>Loading lead files from GitHub...</p></li>';

        // GitHub repository ki details
        const REPO_OWNER = "chuh31481-wq";
        const REPO_NAME = "fmcsa-result-"; // Aapki repository ka naam
        const FOLDER_PATH = "output"; // Folder jahan CSV files save hoti hain
        const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`;

        try {
            const response = await fetch(API_URL );
            
            // Agar 'output' folder abhi tak nahi bana, to user ko batana
            if (response.status === 404) {
                leadsListElement.innerHTML = "<li><p>The 'output' folder does not exist yet. Run the 'Fetch New FMCSA Leads' job from the dashboard first.</p></li>";
                return;
            }
            if (!response.ok) throw new Error(`Failed to fetch from GitHub. Status: ${response.status}`);
            
            const files = await response.json();
            
            if (!Array.isArray(files) || files.length === 0) {
                leadsListElement.innerHTML = '<li><p>No lead files found in the repository.</p></li>';
                return;
            }

            leadsListElement.innerHTML = ''; // Purani list saaf karo
            
            // Har file ke liye ek list item banana
            files.reverse().forEach(file => { // Nayi file sab se upar
                if (file.type === 'file' && file.name.endsWith('.csv')) {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    
                    // Direct download link
                    link.href = file.download_url; 
                    link.textContent = file.name;
                    // 'download' attribute browser ko batata hai ke file ko direct download karna hai
                    link.setAttribute('download', file.name); 
                    
                    listItem.appendChild(link);
                    leadsListElement.appendChild(listItem);
                }
            });

        } catch (error) {
            console.error('Error fetching FMCSA leads:', error);
            leadsListElement.innerHTML = `<li><p style="color: red;">Error loading lead files: ${error.message}</p></li>`;
        }
    }

    // Refresh button ka logic
    if (refreshLeadsBtn) {
        refreshLeadsBtn.addEventListener('click', fetchFmcsaLeads);
    }

    // Page load hone par dono kaam foran shuru karna
    displayUserInfo();
    fetchFmcsaLeads();
});
