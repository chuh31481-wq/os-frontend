export async function onRequest(context) {
    const GITHUB_TOKEN = context.env.GITHUB_MASTER_PAT; // Nayi, master key istemal karna
    const REPO_OWNER = "chuh31481-wq";
    const REPO_NAME = "invoice-generator";
    const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

    try {
        const payloadFromFrontend = await context.request.json();
        const response = await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cloudflare-Worker',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'generate-invoice-event',
                client_payload: payloadFromFrontend
            })
        });

        if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);

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
