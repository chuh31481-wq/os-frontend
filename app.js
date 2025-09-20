document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginButton.addEventListener('click', async function() {
        const email = emailInput.value;
        const password = passwordInput.value;
        errorMessage.textContent = ''; // Purana error message saaf karein

        if (email === "" || password === "") {
            errorMessage.textContent = "Please enter both email and password.";
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            // Login kamyab hone par, dashboard par bhej do
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Error logging in:', error.message);
            errorMessage.textContent = `Login Failed: ${error.message}`;
        }
    });
});
