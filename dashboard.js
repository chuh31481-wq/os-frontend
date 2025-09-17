// Yeh code tab chalega jab poora dashboard page load ho jayega
document.addEventListener('DOMContentLoaded', function() {
        
    console.log("Dashboard script loaded. Fetching invoices...");
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
});

// Yeh function GitHub API se invoices ki list haasil karega
async function fetchInvoices() {
    // --- YAHAN APNI DETAILS UPDATE KAREIN ---
    const REPO_OWNER = "chuh31481-wq";              // Aapka GitHub username
    const REPO_NAME = "invoice-generator";         // Aapki backend repo ka naam
    const FOLDER_PATH = "invoices";                // Folder ka naam jahan PDFs hain

    const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`;

    const invoiceListElement = document.getElementById('invoice-list');
    if (!invoiceListElement) {
        console.error("Could not find the #invoice-list element on the page.");
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }
        const files = await response.json();

        if (files.length === 0) {
            invoiceListElement.innerHTML = '<li>No invoices found.</li>';
            return;
        }

        // List ko saaf karke nayi files add karna
        invoiceListElement.innerHTML = ''; 
        files.forEach(file => {
            if (file.name.endsWith('.pdf')) {
                const listItem = document.createElement('li');
                // file.download_url se user direct file download kar sakta hai
                listItem.innerHTML = `<a href="${file.download_url}" target="_blank">${file.name}</a> (Size: ${Math.round(file.size / 1024)} KB)`;
                invoiceListElement.appendChild(listItem);
            }
        });

    } catch (error) {
        console.error("Error fetching invoices:", error);
        invoiceListElement.innerHTML = `<li>Error loading invoices: ${error.message}</li>`;
    }
}
