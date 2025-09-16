// Yeh Netlify Function ka handler hai
exports.handler = async function(event, context) {
    // 1. Frontend se bheje gaye data ko haasil karna
    const invoiceData = JSON.parse(event.body);

    // 2. Zaroori GitHub details set karna
    const GITHUB_TOKEN = process.env.GITHUB_PAT; // Token ko Netlify se secure tareeqe se haasil karna

    // --- YAHAN SAHI DETAILS DAALEIN ---
    const REPO_OWNER = "johnmichael16725-ship-it"; // Backend repo ka owner
    const REPO_NAME = "-i-generator-service";      // Backend repo ka naam

    const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

    // 3. GitHub Actions ko trigger karne ke liye API call bhejna
    try {
        const response = await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'generate-invoice-event',
                client_payload: {
                    invoice_data: invoiceData
                }
            })
        });

        // Agar GitHub API se koi bhi error aaye to usay wazeh tor par dikhana
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`GitHub API Error: ${response.status}`, errorBody);
            throw new Error(`GitHub API responded with ${response.status}. Check the function logs on Netlify.`);
        }

        // Frontend ko kamyabi ka jawab bhejna
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Successfully triggered the invoice generation workflow!" })
        };

    } catch (error) {
        console.error("Error triggering workflow:", error);
        // Frontend ko nakami ka wazeh jawab bhejna
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};
