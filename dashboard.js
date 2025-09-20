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

    // FMCSA Leads button ka logic (yeh abhi bhi Cloudflare Function ko call karega)
    if (fetchLeadsBtn) {
        fetchLeadsBtn.addEventListener('click', async function() {
            alert('Request sent to fetch FMCSA leads. This process runs in the background and is not connected to Supabase.');
            try {
                // Yeh abhi bhi purane tareeqe se kaam karega, jo bilkul theek hai.
                const response = await fetch('/trigger-fmcsa-job', { method: 'POST' });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
            } catch (error) {
                console.error("Error triggering FMCSA job:", error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // User ke apne invoices Supabase se laane ka logic
    async function fetchMyInvoices(user) {
        if (!invoiceListElement || !user) return; // Agar user login nahi ya list mojood nahi, to kuch mat karo
        invoiceListElement.innerHTML = '<li>Loading your invoices...</li>';

        try {
            // Supabase se pucho: "Mujhe 'invoices' table se woh tamam records do jahan 'user_id' is user ki ID ke barabar ho"
            // Yahi Row Level Security (RLS) ka kamaal hai, lekin hum frontend se bhi filter kar rahe hain.
            const { data: invoices, error } = await supabase
                .from('invoices')
                .select('*') // Tamam columns select karo
                .eq('user_id', user.id) // Sirf is user ka data jahan user_id match ho
                .order('created_at', { ascending: false }) // Naya invoice sab se upar
                .limit(10); // Sirf 10 sab se naye invoices laao

            if (error) throw error; // Agar Supabase se error aaye, to usay pakro

            if (invoices.length === 0) {
                invoiceListElement.innerHTML = '<li>You have not created any invoices yet.</li>';
                return;
            }

            invoiceListElement.innerHTML = ''; // Purani list saaf karo
            invoices.forEach(invoice => {
                const listItem = document.createElement('li');
                // Hum ab Supabase se mila hua data dikha rahe hain
                listItem.textContent = `Invoice #${invoice.invoice_number} for ${invoice.client_name} - Amount: $${invoice.amount}`;
                // Yahan hum baad mein PDF download ka link daalenge
                invoiceListElement.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching invoices:', error);
            invoiceListElement.innerHTML = `<li>Error loading invoices: ${error.message}</li>`;
        }
    }

    // Page load hone par poora process shuru karna
    async function initializeDashboard() {
        const user = await displayUserInfo(); // Pehle user ki info haasil karo
        await fetchMyInvoices(user); // Phir us user ke invoices laao
    }

    initializeDashboard();
});
