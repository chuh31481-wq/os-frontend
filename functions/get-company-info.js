// Yeh function 'users.json' se company ki maloomat la kar dega
export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const companyId = url.searchParams.get('company_id');
        if (!companyId) throw new Error("Company ID is missing.");

        const DB_TOKEN = context.env.GITHUB_MASTER_PAT;
        const DB_REPO_OWNER = 'chuh31481-wq';
        const DB_REPO_NAME = 'dispatch-os-db';
        const USERS_FILE_URL = `https://api.github.com/repos/${DB_REPO_OWNER}/${DB_REPO_NAME}/contents/users.json`;

        const usersFileResponse = await fetch(USERS_FILE_URL, {
            headers: { 'Authorization': `token ${DB_TOKEN}`, 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'Dispatch-OS-App' }
        });
        if (!usersFileResponse.ok) throw new Error("Could not access the user database.");
        
        const usersDB = await usersFileResponse.json();
        const companyInfo = usersDB.companies.find(c => c.id === companyId);
        if (!companyInfo) throw new Error("Company not found.");

        return new Response(JSON.stringify(companyInfo), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
