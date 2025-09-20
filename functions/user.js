export async function onRequest(context) {
    try {
        const cookie = context.request.headers.get('Cookie');
        if (!cookie || !cookie.includes('auth_session=')) {
            throw new Error('Not authenticated');
        }

        const sessionCookie = cookie.split(';').find(c => c.trim().startsWith('auth_session='));
        const sessionData = JSON.parse(atob(sessionCookie.split('=')[1]));

        const safeUserData = {
            github_id: sessionData.github_id,
            company_id: sessionData.company_id,
            role: sessionData.role
        };

        return new Response(JSON.stringify(safeUserData), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
