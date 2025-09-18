document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            // Yeh Client ID aapke GitHub OAuth App ki hai.
            // Isay yahan likhne mein koi security risk nahi, yeh public hoti hai.
            const GITHUB_CLIENT_ID = 'YAHAN_APNI_GITHUB_CLIENT_ID_PASTE_KAREIN';
            
            // User ko GitHub ke authorization page par bhejna
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=read:user`;
        } );
    }
});
