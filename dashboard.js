document.addEventListener('DOMContentLoaded', function() {
    const welcomeUser = document.getElementById('welcome-user');
    const logoutButton = document.getElementById('logoutButton');

    // Naya, Supabase wala Logout Logic
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault(); // Link ko foran chalne se rokna
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert(`Logout failed: ${error.message}`);
            } else {
                alert("You have been logged out.");
                window.location.href = 'index.html';
            }
        });
    }

    // User ka naam navbar mein dikhana
    async function displayUserInfo() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && welcomeUser) {
            welcomeUser.textContent = `Welcome, ${user.email}`;
        }
    }

    // Baqi tamam functions (fetchInvoices, fetchLeads, etc.) abhi ke liye comment kar diye gaye hain
    // taake koi aur error na aaye. Hum inhein baad mein theek karenge.

    // Page load hone par user ki info foran dikhayein
    displayUserInfo();
});
