// Yeh code tab chalega jab poora dashboard page load ho jayega
document.addEventListener('DOMContentLoaded', function() {
    
    console.log("Dashboard script loaded. Fetching invoices...");
    // Page load hone par foran invoices ki list fetch karein
    fetchInvoices();

    // Logout button ka logic
    const logoutButton = document.getElementById('logoutButton');
    if(logoutButton) {
        logoutButton.addEventListener('click', function() {
            alert("Logout functionality will be added later.");
            // Yahan baad mein user ko login page par wapas bhejne ka code aayega
            // window.location.href = 'index.html';
        });
    }

    // --- YAHAN NAYA LOGIC ADD HUA HAI ---
    // "Fetch FMCSA Leads" button ka logic
    const fetchLeadsBtn = document.getElementById('fetchLeadsBtn');
    if (fetchLeadsBtn) {
        fetchLeadsBtn.addEventListener('click', async function() {
            alert("Sending request to fetch FMCSA leads... This may take a few minutes.");
            try {
                // Naye Cloudflare Function ko call karna
                const response = await fetch('/trigger-fmcsa-job', { method: 'POST' });
                const result = await response.json();
                alert(result.message); // Kamyabi ya nakami ka message dikhana
            } catch (error) {
                console.error("Error triggering FMCSA job:", error);
                alert("Failed to send request. Check the console for details.");
            }
        });
    }
});

// Yeh function GitHub API se invoices ki list haasil karega
async function fetchInvoices() {
    // --- YAHAN APNI INVOICE REPO KI DETAILS UPDATE KAREIN ---
    const REPO_OWNER = "chuh31481-wq";
    const REPO_NAME = "invoice-generator"; // Aapki invoice wali repo ka naam
    const FOLDER_PATH = "invoices";

    const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`;

    const invoiceListElement = document.getElementById('invoice-list');
    if (!invoiceListElement) {
        console.error("Could not find the #invoice-list element on the page.");
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            // Agar repo private ho ya naam ghalat ho to error aayega
            if (response.status === 404) {
                throw new Error(`Repository or folder not found. Check REPO_OWNER, REPO_NAME, and FOLDER_PATH.`);
            }
            throw new Error(`GitHub API responded with ${response.status}`);
        }
        const files = await response.json();

        if (files.length === 0) {
            invoiceListElement.innerHTML = '<li>No invoices found yet.</li>';
            return;
        }

        invoiceListElement.innerHTML = ''; 
        files.forEach(file => {
            if (file.name.endsWith('.pdf')) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${file.download_url}" target="_blank">${file.name}</a> (Size: ${Math.round(file.size / 1024)} KB)`;
                invoiceListElement.appendChild(listItem);
            }
        });

    } catch (error) {
        console.error("Error fetching invoices:", error);
        invoiceListElement.innerHTML = `<li>Error loading invoices: ${error.message}</li>`;
    }
}
