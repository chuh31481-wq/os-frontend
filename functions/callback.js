export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const code = url.searchParams.get('code');
        if (!code) throw new Error("Authorization code not found.");

        const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
        const GITHUB_CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET;

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code: code }),
        });
        const tokenData = await tokenResponse.json();
        if (tokenData.error) throw new Error(tokenData.error_description);
        const accessToken = tokenData.access_token;

        const userResponse = await fetch('https://api.github.com/user', {
            headers: { 'Authorization': `token ${accessToken}`, 'User-Agent': 'Dispatch-OS-App' },
        });
        const githubUser = await userResponse.json();
        const githubUsername = githubUser.login;

        const DB_TOKEN = context.env.GITHUB_MASTER_PAT;
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

        const headers = new Headers();
        headers.set('Location', '/dashboard.html');
        const userData = {
            github_id: githubUsername,
            company_id: authorizedUser.company_id,
            role: authorizedUser.role
        };
        headers.set('Set-Cookie', `auth_session=${btoa(JSON.stringify(userData))}; HttpOnly; Secure; Path=/; Max-Age=86400`);

        return new Response(null, { status: 302, headers: headers });

    } catch (error) {
        console.error("Callback Error:", error);
        return Response.redirect(`/?error=${encodeURIComponent(error.message)}`, 302);
    }
}
