// Yeh function tab chalega jab poora HTML page load ho jayega
document.addEventListener('DOMContentLoaded', function() {
    
    // --- NAYA LOGOUT LOGIC ---
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', async function() {
            // Supabase ko logout karne ke liye kehna
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error logging out:', error.message);
                alert(`Logout Failed: ${error.message}`);
            } else {
                // Logout kamyab hone par, user ko login page par wapas bhej do
                alert('You have been logged out.');
                window.location.href = 'index.html';
            }
        });
    }
    // --- LOGOUT LOGIC KHATAM ---


    // --- PURANA CODE (Pehle se mojood) ---
    // Dashboard par mojood "Fetch FMCSA Leads" button ka logic
    const fetchLeadsBtn = document.getElementById('fetchFmcsaBtn');
    if (fetchLeadsBtn) {
        fetchLeadsBtn.addEventListener('click', async function() {
            alert('Request sent to fetch FMCSA leads. This may take a few minutes.');
            try {
                const response = await fetch('/trigger-fmcsa-job', { method: 'POST' });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                // Kamyabi ka alert yahan na dein, kyunke kaam background mein ho raha hai
            } catch (error) {
                console.error("Error triggering FMCSA job:", error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // Dashboard par "Recently Generated Invoices" ki list laane ka logic
    async function fetchRecentInvoices() {
        const listElement = document.getElementById('invoice-list');
        if (!listElement) return;

        listElement.innerHTML = '<li>Loading invoices...</li>';

        const REPO_OWNER = "chuh31481-wq";
        const REPO_NAME = "invoice-generator";
        const FOLDER_PATH = "invoices";
        const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`;

        try {
            const response = await fetch(API_URL);
            if (response.status === 404) {
                listElement.innerHTML = "<li>The 'invoices' folder does not exist yet. Generate an invoice first.</li>";
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch from GitHub');
            
            const files = await response.json();
            
            if (files.length === 0) {
                listElement.innerHTML = '<li>No invoices found.</li>';
                return;
            }

            listElement.innerHTML = ''; // List ko saaf karein
            files.reverse().slice(0, 5).forEach(file => { // Sirf 5 sab se nayi files dikhayein
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = file.html_url; // GitHub par file ka link
                link.textContent = file.name;
                link.target = "_blank"; // Naye tab mein kholein
                listItem.appendChild(link);
                listElement.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching invoices:', error);
            listElement.innerHTML = `<li>Error loading invoices: ${error.message}</li>`;
        }
    }

    // Page load hone par invoices ki list foran fetch karein
    fetchRecentInvoices();
});
