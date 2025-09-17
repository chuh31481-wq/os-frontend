document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.getElementById('signupButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    signupButton.addEventListener('click', async function() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email === "" || password === "") {
            alert("Please enter both email and password.");
            return;
        }
        if (password.length < 6) {
            alert("Password should be at least 6 characters long.");
            return;
        }

        try {
            // Supabase mein naya user banane ka function
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                throw error;
            }

            // Kamyabi par user ko batana
            alert('Success! Please check your email to verify your account.');
            // User ko login page par bhej dena
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error signing up:', error.message);
            alert(`Sign Up Failed: ${error.message}`);
        }
    });
});
