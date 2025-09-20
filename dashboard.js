document.addEventListener('DOMContentLoaded', function() {
    const welcomeUser = document.getElementById('welcome-user');
    const logoutButton = document.getElementById('logoutButton');
    const fetchLeadsBtn = document.getElementById('fetchLeadsBtn');
    const invoiceListElement = document.getElementById('invoice-list');

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
        if (user && welcomeUser) {
            welcomeUser.textContent = `Welcome, ${user.email}`;
        }
        return user; // User object ko wapas bhejna taake doosre functions istemal kar sakein
    }

    // FMCSA Leads button ka logic
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
    async function fetchMyCompanyInvoices(user) {
        if (!invoiceListElement || !user) return;
        invoiceListElement.innerHTML = '<li>Loading your invoices...</li>';

        try {
            // Supabase se pucho: "Mujhe 'invoices' table se woh tamam records do jahan 'user_id' is user ki ID ke barabar ho"
            const { data: invoices, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('user_id', user.id) // Sirf is user ka data
                .order('created_at', { ascending: false }) // Naya invoice upar
                .limit(10); // Sirf 10 sab se naye invoices

            if (error) throw error;

            if (invoices.length === 0) {
                invoiceListElement.innerHTML = '<li>No invoices found.</li>';
                return;
            }

            invoiceListElement.innerHTML = '';
            invoices.forEach(invoice => {
                const listItem = document.createElement('li');
                // Hum ab Supabase se data dikha rahe hain
                listItem.textContent = `Invoice #${invoice.invoice_number} for ${invoice.client_name}`;
                // Yahan hum baad mein PDF download ka link daalenge
                invoiceListElement.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching invoices:', error);
            invoiceListElement.innerHTML = `<li>Error: ${error.message}</li>`;
        }
    }

    // Page load hone par poora process shuru karna
    async function initializeDashboard() {
        const user = await displayUserInfo();
        await fetchMyCompanyInvoices(user);
    }

    initializeDashboard();
});
