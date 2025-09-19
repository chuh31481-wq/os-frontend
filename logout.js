// Yeh Cloudflare Function user ki login cookie ko delete karega
export async function onRequest(context) {
    const headers = new Headers();

    // User ko login page par wapas bhejo
    headers.set('Location', '/'); 

    // Browser ko hidayat do ke 'auth_session' naam ki cookie ko foran expire kar do
    headers.set('Set-Cookie', `auth_session=; HttpOnly; Secure; Path=/; Max-Age=0`);

    // 302 Redirect response bhejo
    return new Response(null, {
        status: 302,
        headers: headers,
    });
}
