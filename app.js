document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
        errorMessage.textContent = errorParam;
    }

    loginButton.addEventListener('click', async function() {
        const email = emailInput.value;
        const password = passwordInput.value;
        errorMessage.textContent = '';

        if (email === "" || password === "") {
            errorMessage.textContent = "Please enter both email and password.";
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                if (error.message.includes("Email not confirmed")) {
                    throw new Error("Your email is not verified. Please check your inbox (and spam folder).");
                }
                throw error;
            }
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Error logging in:', error.message);
            errorMessage.textContent = `Login Failed: ${error.message}`;
        }
    });
});
