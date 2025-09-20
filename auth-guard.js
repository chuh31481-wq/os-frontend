// Yeh hamara naya, Supabase-based "Security Guard" hai.
// Isay har mehfooz page ke shuru mein (head mein) lagana hai.
(async function() {
    try {
        // Supabase se pucho ke kya koi user login hai?
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Agar Supabase kehta hai ke koi user login nahi hai...
            console.error("Auth Guard: No active session found by Supabase. Access Denied.");
            alert("Access Denied! Please log in to continue.");
            // ...to user ko foran login page par wapas bhej do.
            window.location.href = 'index.html';
        } else {
            // Agar user login hai, to console mein uska email dikhao (testing ke liye)
            console.log(`Auth Guard: Access Granted. User: ${user.email}`);
        }
    } catch (error) {
        console.error("Auth Guard Error:", error);
        alert("An error occurred while checking authentication. Redirecting to login page.");
        window.location.href = 'index.html';
    }
})();
