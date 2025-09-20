document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateInvoiceBtn');
    const welcomeUserSpan = document.getElementById('welcome-user');
    const logoutButton = document.getElementById('logoutButton');

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

    // "Generate Invoice" button ka naya, smart logic
    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            try {
                // Step 1: Pata lagao ke kaunsa user login hai
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Authentication Error. Please log in again.");

                // Step 2: Form se invoice ka data haasil karna
                const invoiceData = {
                    company_name: document.getElementById('companyName').value,
                    company_address: document.getElementById('companyAddress').value,
                    client_name: document.getElementById('clientName').value,
                    client_address: document.getElementById('clientAddress').value,
                    invoice_number: document.getElementById('invoiceNumber').value,
                    invoice_date: document.getElementById('invoiceDate').value,
                    items: [{
                        description: document.getElementById('itemDescription').value,
                        amount: parseFloat(document.getElementById('itemAmount').value)
                    }],
                    total: parseFloat(document.getElementById('itemAmount').value),
                    notes: "Thank you for your business. Payment is due within 30 days."
                };

                if (!invoiceData.client_name || !invoiceData.invoice_number) {
                    alert("Please fill all required fields.");
                    return;
                }

                alert("Sending data to generate invoice... This might take a moment.");

                // Step 3: Cloudflare Function ko call karna, lekin is baar user ki info ke sath
                const response = await fetch('/trigger-invoice-job', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // Hum ab 2 cheezein bhej rahe hain:
                        user_id: user.id,      // User ki unique ID
                        invoice_data: invoiceData // Asal invoice ka data
                    })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message);

                alert("Success! Your invoice generation has started. It will appear in the main dashboard soon.");

            } catch (error) {
                console.error("Error generating invoice:", error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // Page load hone par user ki info foran dikhayein
    displayUserInfo();
});
