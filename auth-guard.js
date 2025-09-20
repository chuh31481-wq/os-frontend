// Is function ko body ke aakhir mein chalana hai
(function() {
    // Browser se pucho ke kya 'auth_session' naam ki cookie mojood hai?
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('auth_session='));

    if (!cookie) {
        // Agar cookie (login ka "entry pass") mojood nahi hai...

        // --- YAHAN ASAL "JASOOSI" HAI ---
        // Hum tamam mojooda cookies ko error message mein hi dikha denge
        const allCookies = document.cookie || "No cookies found";
        alert(`Access Denied! Please log in.\n\nDEBUG INFO:\nCookies found by guard: [${allCookies}]`);
        
        // ...to user ko foran login page par wapas bhej do.
        window.location.href = 'index.html';
    }
    // Agar cookie mil gayi hai, to kuch mat karo, page ko load hone do.
    
})();
