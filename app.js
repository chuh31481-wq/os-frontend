// Yeh code tab chalega jab poora HTML page load ho jayega
document.addEventListener('DOMContentLoaded', function() {

    // 1. HTML se zaroori cheezon ko pakarna
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // 2. Login button par "click" ka jasoos (event listener) lagana
    loginButton.addEventListener('click', async function() {
        
        // 3. Button dabane par, form se values haasil karna
        const email = emailInput.value;
        const password = passwordInput.value;

        // 4. Check karna ke user ne kuch likha hai ya nahi
        if (email === "" || password === "") {
            alert("Please enter both email and password.");
            return; // Function ko yahin rok do
        }

        // --- YAHAN ASAL SUPABASE LOGIC HAI ---
        try {
            // Supabase ko login karne ke liye kehna
            // 'supabase' object hamari supabase-client.js file se aa raha hai
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Agar Supabase se koi error aaye (jaise ghalat password)
                throw error;
            }

            // Agar login kamyab ho jaye
            alert('Login Successful! Redirecting to dashboard...');
            // User ko dashboard.html page par bhej do
            window.location.href = 'dashboard.html';

        } catch (error) {
            // Error ko user ko dikhana
            console.error('Error logging in:', error.message);
            alert(`Login Failed: ${error.message}`);
        }
    });
});
