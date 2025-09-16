// Yeh line code ko tab chalayegi jab poora HTML page load ho jayega
document.addEventListener('DOMContentLoaded', function() {

    // 1. HTML se zaroori cheezon ko pakarna
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // 2. Login button par "click" ka jasoos (event listener) lagana
    loginButton.addEventListener('click', function() {
        
        // 3. Button dabane par, form se values haasil karna
        const email = emailInput.value;
        const password = passwordInput.value;

        // 4. Check karna ke user ne kuch likha hai ya nahi
        if (email === "" || password === "") {
            alert("Please enter both email and password.");
            return; // Function ko yahin rok do
        }

        // --- YAHAN ASAL TABDEELI HAI ---
        // Abhi ke liye, hum farz kar lete hain ke koi bhi email/password theek hai.
        // Hum sirf test kar rahe hain.
        
        alert('Login Successful! Redirecting to dashboard...');

        // User ko dashboard.html page par bhej do
        window.location.href = 'dashboard.html';

        // Asal login ka logic (GitHub API call) hum baad mein yahan daalenge.
        
    });

});
