// Yeh function tab chalega jab poora HTML page load ho jayega
document.addEventListener('DOMContentLoaded', function() {
    
    // Dashboard par mojood "Fetch FMCSA Leads" button ka logic
    const fetchLeadsBtn = document.getElementById('fetchLeadsBtn');
    if (fetchLeadsBtn) {
        fetchLeadsBtn.addEventListener('click', async function() {
            alert('Request sent to fetch FMCSA leads. This may take a few minutes.');
            try {
                const response = await fetch('/trigger-fmcsa-job', { method: 'POST' });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
            } catch (error) {
                console.error("Error triggering FMCSA job:", error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // Dashboard par "Recently Generated Invoices" ki list laane ka naya, smart logic
    async function fetchMyCompanyInvoices() {
        const listElement = document.getElementById('invoice-list');
        if (!listElement) return;

        listElement.innerHTML = '<li>Loading your invoices...</li>';

        try {
            // Step 1: Pata lagao ke kaunsa user login hai
            const userResponse = await fetch('/user');
            if (!userResponse.ok) throw new Error('Authentication error. Please log in again.');
            const userData = await userResponse.json();
            const myCompanyId = userData.company_id;

            // --- YAHAN ASAL TABDEELI HAI ---
            // Step 2: DB repo se company ka 'data_folder' haasil karo (Authorization header ke sath)
            // Hum yahan direct GitHub API ko call nahi kar rahe, balke ek naye "information desk" function ko call karenge
            const companyInfoResponse = await fetch(`/get-company-info?company_id=${myCompanyId}`);
            if (!companyInfoResponse.ok) throw new Error('Could not load your company information.');
            const myCompany = await companyInfoResponse.json();
            
            const FOLDER_PATH = `${myCompany.data_folder}/invoices`;

            // Step 3: Sirf apni company ke folder se invoices ki list laao
            // Iske liye bhi hum ek naya, secure function banayenge
            const invoicesResponse = await fetch(`/list-files?path=${FOLDER_PATH}`);
            if (invoicesResponse.status === 404) {
                listElement.innerHTML = `<li>No invoices found for ${myCompany.name}.</li>`;
                return;
            }
            if (!invoicesResponse.ok) throw new Error('Failed to fetch your invoices from the database.');
            
            const files = await invoicesResponse.json();
            
            if (files.length === 0) {
                listElement.innerHTML = '<li>No invoices found.</li>';
                return;
            }

            listElement.innerHTML = ''; // List ko saaf karein
            files.reverse().slice(0, 5).forEach(file => { // Sirf 5 sab se nayi files dikhayein
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = file.html_url;
                link.textContent = file.name;
                link.target = "_blank";
                listItem.appendChild(link);
                listElement.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching invoices:', error);
            listElement.innerHTML = `<li>Error: ${error.message}</li>`;
        }
    }

    // Page load hone par user ki company ki invoices foran fetch karein
    fetchMyCompanyInvoices();
});
