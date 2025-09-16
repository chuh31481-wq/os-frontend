// Yeh Netlify Function ka handler hai
exports.handler = async function(event, context) {
    // 1. Frontend se bheje gaye data ko haasil karna
    const invoiceData = JSON.parse(event.body);

 // 2. Zaroori GitHub details set karna
 const GITHUB_TOKEN = process.env.GITHUB_PAT; // Token ko secure tareeqe se haasil karna
// Is line ko apne naye username se update karein
const REPO_OWNER = "johnmichael16725-ship-it"; 
// Is line ko apni nayi repository ke naam se update karein
const REPO_NAME = "-i-generator-service";
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
            // client_payload ke andar hum frontend ka data bhej rahe hain
            body: JSON.stringify({
                event_type: 'generate-invoice-event',
                client_payload: {
                    invoice_data: invoiceData
                }
            } )
        });

        if (!response.ok) {
            // Agar GitHub API se error aaye
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        // Frontend ko kamyabi ka jawab bhejna
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Successfully triggered the invoice generation workflow!" })
        };

    } catch (error) {
        console.error("Error:", error);
        // Frontend ko nakami ka jawab bhejna
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error triggering workflow: ${error.message}` })
        };
    }
};
