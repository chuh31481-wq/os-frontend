document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateInvoiceBtn');

    generateBtn.addEventListener('click', async function() {
        try {
            // Step 1: Login kiye hue user ki company ka data haasil karna
            const userResponse = await fetch('/user');
            const userData = await userResponse.json();
            if (userResponse.status === 401) throw new Error('You are not logged in.');

            // Step 2: Apni DB repo se company ka 'data_folder' haasil karna
            const dbResponse = await fetch(`https://api.github.com/repos/chuh31481-wq/dispatch-os-db/contents/users.json`, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            });
            const usersDB = await dbResponse.json();
            const companyInfo = usersDB.companies.find(c => c.id === userData.company_id);
            if (!companyInfo) throw new Error('Your company is not configured in the database.');

            // Step 3: Form se invoice ka data haasil karna
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

            // Step 4: Backend ko call karna, lekin is baar company info ke sath
            const triggerResponse = await fetch('/trigger-invoice-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoice_data: invoiceData,
                    company: companyInfo // Company ki poori info (id, name, data_folder) bhejna
                })
            });

            const result = await triggerResponse.json();
            if (!triggerResponse.ok) throw new Error(result.message);

            alert("Success! Your invoice is being generated and stored securely.");

        } catch (error) {
            console.error("Error generating invoice:", error);
            alert(`Error: ${error.message}`);
        }
    });
});
