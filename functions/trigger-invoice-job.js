// Cloudflare Functions ka format thora mukhtalif hai
export async function onRequest(context) {
    // 1. Zaroori GitHub details set karna
    const GITHUB_TOKEN = context.env.GITHUB_PAT; // Token ko Cloudflare se haasil karna

    const REPO_OWNER = "chuh31481-wq";
    const REPO_NAME = "invoice-generator";

    const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

    try {
        // Frontend se bheja gaya data haasil karna
        const invoiceData = await context.request.json();

        // 2. GitHub Actions ko trigger karna
        const response = await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cloudflare-Worker', // GitHub ko batana ke hum kahan se aa rahe hain
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'generate-invoice-event',
                client_payload: { invoice_data: invoiceData }
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        // Frontend ko kamyabi ka jawab bhejna
        return new Response(JSON.stringify({ message: "Successfully triggered invoice workflow!" }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Error: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
