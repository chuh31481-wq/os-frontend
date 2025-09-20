// Yeh function DB repo ke kisi bhi folder se files ki list la kar dega
export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const folderPath = url.searchParams.get('path');
        if (!folderPath) throw new Error("Folder path is missing.");

        const DB_TOKEN = context.env.GITHUB_MASTER_PAT;
        const DB_REPO_OWNER = 'chuh31481-wq';
        const DB_REPO_NAME = 'dispatch-os-db';
        const API_URL = `https://api.github.com/repos/${DB_REPO_OWNER}/${DB_REPO_NAME}/contents/${folderPath}`;

        const response = await fetch(API_URL, {
            headers: { 'Authorization': `token ${DB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Dispatch-OS-App' }
        });

        if (response.status === 404) {
            return new Response(JSON.stringify([]), { // Agar folder na mile, to khaali list bhejo
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

        const files = await response.json();
        return new Response(JSON.stringify(files), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
