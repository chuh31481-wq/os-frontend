// Is function ko foran chalana hai, lekin andar thora sa delay add karna hai
(function() {
    // 100 milliseconds (0.1 second) ka chota sa waqfa (delay)
    // Yeh browser ko cookie process karne ke liye kaafi waqt de dega.
    setTimeout(() => {
        // Browser se pucho ke kya 'auth_session' naam ki cookie mojood hai?
        const cookie = document.cookie.split(';').find(c => c.trim().startsWith('auth_session='));

        if (!cookie) {
            // Agar cookie (login ka "entry pass") ab bhi mojood nahi hai...
            alert("Access Denied! Please log in to continue.");
            // ...to user ko foran login page par wapas bhej do.
            window.location.href = 'index.html';
        }
        // Agar cookie mojood hai, to kuch mat karo, page ko load hone do.
        // User mehfooz hai aur andar aa sakta hai.
    }, 100); // 100ms ka delay

})();
