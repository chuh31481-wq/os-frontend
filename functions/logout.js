export async function onRequest(context) {
    const headers = new Headers();
    headers.set('Location', '/'); 
    headers.set('Set-Cookie', `auth_session=; HttpOnly; Secure; Path=/; Max-Age=0`);
    return new Response(null, {
        status: 302,
        headers: headers,
    });
}
