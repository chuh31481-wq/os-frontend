// Yeh Cloudflare Function GitHub se wapas aane wale user ko handle karega
export async function onRequest(context) {
    try {
        // Step 1: GitHub se milne wale temporary 'code' ko URL se nikalna
        const url = new URL(context.request.url);
        const code = url.searchParams.get('code');

        if (!code) {
            throw new Error("Authorization code not found.");
        }

        // Step 2: Is 'code' ko istemal karke GitHub se 'Access Token' haasil karna
        const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
        const GITHUB_CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET;

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
            }),
        });

        const tokenData = await tokenResponse.json();
        if (tokenData.error) {
            throw new Error(tokenData.error_description);
        }
        const accessToken = tokenData.access_token;

        // Step 3: 'Access Token' ka istemal karke user ki GitHub profile haasil karna
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`,
                'User-Agent': 'Dispatch-OS-App',
            },
        });

        const githubUser = await userResponse.json();
        const githubUsername = githubUser.login; // User ka GitHub username

        // Step 4: (Sab se ahem) Check karna ke kya yeh user hamari 'users.json' file mein hai?
        // Yeh logic hum agle step mein add karenge. Abhi ke liye, hum farz kar lete hain ke user authorized hai.
        
        // TODO: Add logic to check if 'githubUsername' exists in dispatch-os-db/users.json

        // Step 5: User ko kamyabi se dashboard par bhej dena
        // Hum user ke browser mein ek "cookie" set kar rahe hain taake woh login rahe.
        const headers = new Headers();
        headers.set('Location', '/dashboard.html'); // Dashboard par bhejo
        headers.set('Set-Cookie', `auth_token=${accessToken}; HttpOnly; Secure; Path=/; Max-Age=86400`); // 1 din ke liye cookie

        return new Response(null, {
            status: 302, // 302 ka matlab hai "Redirect"
            headers: headers,
        });

    } catch (error) {
        console.error("Callback Error:", error);
        // Agar koi bhi masla ho, to user ko error message ke sath login page par wapas bhejo
        return Response.redirect(`/?error=${encodeURIComponent(error.message)}`, 302);
    }
}
