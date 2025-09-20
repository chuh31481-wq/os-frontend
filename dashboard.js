document.addEventListener('DOMContentLoaded', function() {
    
    // User ka naam navbar mein dikhana
    async function displayUserInfo() {
        const welcomeUser = document.getElementById('welcome-user');
        try {
            const response = await fetch('/user');
            if (!response.ok) return;
            const userData = await response.json();
            if (welcomeUser) {
                welcomeUser.textContent = `Welcome, ${userData.github_id}!`;
            }
        } catch (error) {
            if (welcomeUser) welcomeUser.textContent = 'Welcome!';
        }
    }

    // FMCSA Leads button ka logic
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

    // User ki company ke invoices laane ka logic
    async function fetchMyCompanyInvoices() {
        const listElement = document.getElementById('invoice-list');
        if (!listElement) return;
        listElement.innerHTML = '<li>Loading your invoices...</li>';

        try {
            const userResponse = await fetch('/user');
            if (!userResponse.ok) throw new Error('Authentication error. Please log in again.');
            const userData = await userResponse.json();
            
            const dbResponse = await fetch(`https://api.github.com/repos/chuh31481-wq/dispatch-os-db/contents/users.json`, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            });
            if (!dbResponse.ok) throw new Error('Could not load company database.');
            const usersDB = await dbResponse.json();
            const myCompany = usersDB.companies.find(c => c.id === userData.company_id);
            if (!myCompany) throw new Error('Your company is not configured in the database.');
            
            const FOLDER_PATH = `${myCompany.data_folder}/invoices`;
            const API_URL = `https://api.github.com/repos/chuh31481-wq/dispatch-os-db/contents/${FOLDER_PATH}`;
            
            const invoicesResponse = await fetch(API_URL);
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

            listElement.innerHTML = '';
            files.reverse().slice(0, 5).forEach(file => {
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

    // Page load hone par dono kaam foran shuru karein
    displayUserInfo();
    fetchMyCompanyInvoices();
});
