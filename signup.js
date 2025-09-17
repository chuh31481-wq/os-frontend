document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.getElementById('signupButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    signupButton.addEventListener('click', async function() {
        // YEH LINE CHECK KAREIN: Hum form se email utha rahe hain.
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
            // YEH LINE CHECK KAREIN: Hum 'email' variable ko istemal kar rahe hain.
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                throw error;
            }

            alert('Success! Please check your email to verify your account.');
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error signing up:', error.message);
            alert(`Sign Up Failed: ${error.message}`);
        }
    });
});
