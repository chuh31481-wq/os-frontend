document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateInvoiceBtn');

    generateBtn.addEventListener('click', async function() {
        // 1. Form se tamam data haasil karna
        const invoiceData = {
            company_name: document.getElementById('companyName').value,
            company_address: document.getElementById('companyAddress').value,
            client_name: document.getElementById('clientName').value,
            client_address: document.getElementById('clientAddress').value,
            invoice_number: document.getElementById('invoiceNumber').value,
            invoice_date: document.getElementById('invoiceDate').value,
            items: [
                {
                    description: document.getElementById('itemDescription').value,
                    amount: parseFloat(document.getElementById('itemAmount').value)
                }
            ],
            // Total ko calculate karna
            total: parseFloat(document.getElementById('itemAmount').value),
            notes: "Thank you for your business. Payment is due within 30 days."
        };

        // Check karna ke zaroori fields khaali na hon
        if (!invoiceData.client_name || !invoiceData.invoice_number || !invoiceData.items[0].description || !invoiceData.items[0].amount) {
            alert("Please fill all the required fields.");
            return;
        }

        alert("Sending data to generate invoice... This might take a moment.");

        // 2. Middleman (Netlify Function) ko API call bhejna
        // Yeh function abhi humne banaya nahi hai, lekin hum call likh rahe hain.
        try {
            const response = await fetch('/.netlify/functions/trigger-invoice-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoiceData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Success! Your invoice generation has started. It will appear in the main dashboard soon.");
            } else {
                // Agar Netlify function se error aaye
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            // Agar network ya koi aur masla ho
            console.error("Error triggering invoice job:", error);
            alert("A network error occurred. Please try again.");
        }
    });
});
