// Yeh script foran chalegi, DOMContentLoaded ka intezar nahi karegi.

(async function() {
    // Browser se pucho ke kya 'auth_session' naam ki cookie mojood hai?
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('auth_session='));

    if (!cookie) {
        // Agar cookie (login ka "entry pass") mojood nahi hai...
        alert("Access Denied! Please log in to continue.");
        // ...to user ko foran login page par wapas bhej do.
        window.location.href = 'index.html';
    }
    // Agar cookie mojood hai, to kuch mat karo, page ko load hone do.
})();
