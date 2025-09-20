export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const code = url.searchParams.get('code');
        if (!code) throw new Error("Authorization code not found.");

        const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
        const GITHUB_CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET;

        // GitHub se Access Token haasil karna
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code: code }),
        });
        const tokenData = await tokenResponse.json();
        if (tokenData.error) throw new Error(tokenData.error_description);
        const accessToken = tokenData.access_token;

        // Access Token se user ki profile haasil karna
        const userResponse = await fetch('https://api.github.com/user', {
            headers: { 'Authorization': `token ${accessToken}`, 'User-Agent': 'Dispatch-OS-App' },
        });
        const githubUser = await userResponse.json();
        const githubUsername = githubUser.login;

        // --- YAHAN KOI TABDEELI NAHI ---
        // users.json se user ko verify karna
        const DB_TOKEN = context.env.DATABASE_ACCESS_KEY;
        const DB_REPO_OWNER = 'chuh31481-wq';
        const DB_REPO_NAME = 'dispatch-os-db';
        const USERS_FILE_URL = `https://api.github.com/repos/${DB_REPO_OWNER}/${DB_REPO_NAME}/contents/users.json`;

        const usersFileResponse = await fetch(USERS_FILE_URL, {
            headers: { 'Authorization': `token ${DB_TOKEN}`, 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'Dispatch-OS-App' }
        });
        if (!usersFileResponse.ok) {
            throw new Error(`Could not access the user database. Status: ${usersFileResponse.status}`);
        }
        
        const usersDB = await usersFileResponse.json();
        const authorizedUser = usersDB.users.find(user => user.github_id.toLowerCase() === githubUsername.toLowerCase());

        if (!authorizedUser) {
            throw new Error("Access Denied. Your GitHub account is not authorized.");
        }

        // --- YAHAN ASAL TABDEELI HAI ---
        // Hum ab 'btoa' ka istemal nahi kar rahe. Hum sirf Access Token ko cookie mein save kar rahe hain.
        const headers = new Headers();
        headers.set('Location', '/dashboard.html');
        headers.set('Set-Cookie', `auth_session=${accessToken}; HttpOnly; Secure; Path=/; Max-Age=86400`); // 1 din ke liye cookie

        return new Response(null, { status: 302, headers: headers });

    } catch (error) {
        console.error("Callback Error:", error);
        return Response.redirect(`/?error=${encodeURIComponent(error.message)}`, 302);
    }
}
