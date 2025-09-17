export async function onRequest(context) {
    const GITHUB_TOKEN = context.env.GITHUB_PAT;

    const REPO_OWNER = "chuh31481-wq";
    const REPO_NAME = "fmcsa-result-";

    const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

    try {
        await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cloudflare-Worker',
            },
            body: JSON.stringify({
                event_type: 'run-dispatcher-from-frontend',
                client_payload: { batch_size: "100" }
            })
        });

        return new Response(JSON.stringify({ message: "Successfully triggered FMCSA workflow!" }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Error: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
