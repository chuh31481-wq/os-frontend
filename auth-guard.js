// Is function ko 'DOMContentLoaded' ke event par chalana hai
// Iska matlab hai: "Jab poora HTML page browser mein load ho jaye, tab yeh code chalao."
document.addEventListener('DOMContentLoaded', function() {

    // Browser se pucho ke kya 'auth_session' naam ki cookie mojood hai?
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('auth_session='));

    if (!cookie) {
        // Agar cookie (login ka "entry pass") mojood nahi hai...
        alert("Access Denied! Please log in to continue.");
        // ...to user ko foran login page par wapas bhej do.
        window.location.href = 'index.html';
    }
    // Agar cookie mojood hai, to kuch mat karo, page ko load hone do.
    // User mehfooz hai aur andar aa sakta hai.
    
});
