// Is function ko body ke aakhir mein chalana hai
(function() {
    // --- YAHAN "JASOOS" LAGAYA GAYA HAI ---
    console.log("Auth Guard is running...");
    console.log("Current cookies found by Auth Guard:", document.cookie);

    // Browser se pucho ke kya 'auth_session' naam ki cookie mojood hai?
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('auth_session='));

    if (!cookie) {
        // Agar cookie (login ka "entry pass") mojood nahi hai...
        console.error("Auth Guard: Cookie not found! Access Denied.");
        alert("Access Denied! Please log in to continue.");
        // ...to user ko foran login page par wapas bhej do.
        window.location.href = 'index.html';
    } else {
        // Agar cookie mil gayi hai
        console.log("Auth Guard: Cookie found! Access Granted.");
    }
})();
