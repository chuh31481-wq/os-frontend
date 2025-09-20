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

    // "Generate Invoice" button ka naya, Supabase wala logic
    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            try {
                // Step 1: Pata lagao ke kaunsa user login hai (security ke liye)
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Authentication Error. You are not logged in. Please log in again.");

                // Step 2: Form se invoice ka data haasil karna
                const invoiceNumber = document.getElementById('invoiceNumber').value;
                const clientName = document.getElementById('clientName').value;
                const itemDescription = document.getElementById('itemDescription').value;
                const itemAmount = parseFloat(document.getElementById('itemAmount').value);

                // Check karna ke zaroori fields khaali na hon
                if (!invoiceNumber || !clientName || !itemAmount) {
                    alert("Please fill at least Invoice Number, Client Name, and Amount.");
                    return;
                }

                alert("Saving your invoice data to the database...");

                // Step 3: Supabase ki 'invoices' table mein naya record daalna
                const { data, error } = await supabase
                    .from('invoices')
                    .insert([
                        { 
                            // user_id yahan likhne ki zaroorat nahi, kyunke humne table mein usay 'default auth.uid()' set kiya hai.
                            invoice_number: invoiceNumber, 
                            client_name: clientName,
                            item_description: itemDescription,
                            amount: itemAmount
                        }
                    ])
                    .select(); // .select() likhne se Supabase naya banaya hua record wapas deta hai

                if (error) throw error; // Agar Supabase se error aaye, to usay pakro

                console.log("Invoice saved successfully:", data);
                alert("Success! Your invoice has been saved to the database. You can see it on the dashboard.");
                
                // User ko wapas dashboard par bhej dena
                window.location.href = 'dashboard.html';

            } catch (error) {
                console.error("Error saving invoice:", error.message);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // Page load hone par user ki info foran dikhayein
    displayUserInfo();
});
