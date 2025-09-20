document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateInvoiceBtn');
    const welcomeUserSpan = document.getElementById('welcome-user');
    const logoutButton = document.getElementById('logoutButton');

    // Logout Logic (waisa hi rahega)
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

    // User Info Logic (waisa hi rahega)
    async function displayUserInfo() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && welcomeUserSpan) {
            welcomeUserSpan.textContent = `Welcome, ${user.email}`;
        }
    }

    // "Generate Invoice" button ka naya, PDF wala logic
    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            try {
                // Step 1: User Authentication (waisa hi rahega)
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Authentication Error. Please log in again.");

                // Step 2: Form se data haasil karna (waisa hi rahega)
                const companyName = document.getElementById('companyName').value;
                const companyAddress = document.getElementById('companyAddress').value;
                const clientName = document.getElementById('clientName').value;
                const clientAddress = document.getElementById('clientAddress').value;
                const invoiceNumber = document.getElementById('invoiceNumber').value;
                const invoiceDate = document.getElementById('invoiceDate').value;
                const itemDescription = document.getElementById('itemDescription').value;
                const itemAmount = parseFloat(document.getElementById('itemAmount').value);

                if (!invoiceNumber || !clientName || !itemAmount) {
                    alert("Please fill at least Invoice Number, Client Name, and Amount.");
                    return;
                }

                // --- YAHAN ASAL TABDEELI HAI ---
                // Step 3: PDF Banana (Foran, Browser Mein)
                
                // jsPDF library ko initialize karna
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                // PDF ke andar content likhna
                doc.setFontSize(22);
                doc.text("INVOICE", 105, 20, { align: 'center' });

                doc.setFontSize(12);
                doc.text(companyName, 20, 40);
                doc.text(companyAddress, 20, 45);

                doc.text(`Invoice #: ${invoiceNumber}`, 150, 40);
                doc.text(`Date: ${invoiceDate}`, 150, 45);

                doc.text("Bill To:", 20, 60);
                doc.text(clientName, 20, 65);
                doc.text(clientAddress, 20, 70);

                doc.line(15, 80, 195, 80); // Horizontal line

                doc.text("Description", 20, 90);
                doc.text("Amount", 180, 90, { align: 'right' });
                doc.line(15, 95, 195, 95);

                doc.text(itemDescription, 20, 105);
                doc.text(`$${itemAmount.toFixed(2)}`, 180, 105, { align: 'right' });

                doc.line(15, 120, 195, 120);

                doc.setFontSize(16);
                doc.text("Total:", 140, 130);
                doc.text(`$${itemAmount.toFixed(2)}`, 180, 130, { align: 'right' });

                doc.setFontSize(10);
                doc.text("Thank you for your business. Payment is due within 30 days.", 105, 150, { align: 'center' });

                // PDF ko download karwana
                doc.save(`Invoice-${invoiceNumber}.pdf`);

                // Step 4: Supabase mein data save karna (yeh ab bhi hoga)
                // Hum PDF ka URL save nahi kar rahe, kyunke PDF ab user ke paas hai.
                const { error } = await supabase
                    .from('invoices')
                    .insert([{ 
                        invoice_number: invoiceNumber, 
                        client_name: clientName,
                        item_description: itemDescription,
                        amount: itemAmount
                    }]);

                if (error) throw error;

                alert("Success! Your invoice has been downloaded and the record has been saved.");
                
            } catch (error) {
                console.error("Error during invoice process:", error.message);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // Page load hone par user ki info foran dikhayein
    displayUserInfo();
});
