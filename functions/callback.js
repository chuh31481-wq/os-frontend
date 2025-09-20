export async function onRequest(context) {
    try {
        // ... (upar ka tamam code bilkul waisa hi rahega) ...
        const url = new URL(context.request.url);
        const code = url.searchParams.get('code');
        if (!code) throw new Error("Authorization code not found.");

        // ... (GitHub se token aur user haasil karne ka code) ...
        const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
        const GITHUB_CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET;
        // ... (fetch calls) ...
        const githubUser = await userResponse.json();
        const githubUsername = githubUser.login;

        // ... (users.json parhne ka code) ...
        const authorizedUser = usersDB.users.find(user => user.github_id.toLowerCase() === githubUsername.toLowerCase());

        if (!authorizedUser) {
            throw new Error("Access Denied. Your GitHub account is not authorized.");
        }

        // --- YAHAN "JASOOS" LAGAYA GAYA HAI ---
        console.log(`User ${githubUsername} is authorized. Setting cookie and redirecting to /dashboard.html`);

        const headers = new Headers();
        headers.set('Location', '/dashboard.html');
        const userData = {
            github_id: githubUsername,
            company_id: authorizedUser.company_id,
            role: authorizedUser.role
        };
        // Cookie ko Base64 mein encode karna
        const cookieValue = btoa(JSON.stringify(userData));
        headers.set('Set-Cookie', `auth_session=${cookieValue}; HttpOnly; Secure; Path=/; Max-Age=86400`);

        return new Response(null, { status: 302, headers: headers });

    } catch (error) {
        // --- YAHAN BHI "JASOOS" LAGAYA GAYA HAI ---
        console.error("Callback function failed:", error.message);
        return Response.redirect(`/?error=${encodeURIComponent(error.message)}`, 302);
    }
}
