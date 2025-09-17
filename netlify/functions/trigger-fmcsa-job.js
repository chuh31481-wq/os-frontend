// Yeh Netlify Function ka handler hai
exports.handler = async function(event, context) {
    // 1. Zaroori GitHub details set karna
    const GITHUB_TOKEN = process.env.GITHUB_PAT; // Token ko Netlify se secure tareeqe se haasil karna

    // --- YAHAN APNI BACKEND REPO KI SAHI DETAILS DAALEIN ---
    const REPO_OWNER = "chuh31481-wq";      // Aapka GitHub username
    const REPO_NAME = "fmcsa-result";       // Aapki backend repo ka naam

    const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

    // 2. GitHub Actions ko trigger karne ke liye API call bhejna
    try {
        // Hum 'dispatcher.yml' ko trigger kar rahe hain
        await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'run-dispatcher-from-frontend', // Yeh naam 'dispatcher.yml' se match hona chahiye
                client_payload: {
                    // Aap yahan se batch_size jaisi cheezein bhi bhej sakte hain
                    batch_size: "100" 
                }
            })
        });

        // Frontend ko kamyabi ka jawab bhejna
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Successfully triggered the FMCSA Dispatcher workflow!" })
        };

    } catch (error) {
        console.error("Error triggering workflow:", error);
        // Frontend ko nakami ka jawab bhejna
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error: ${error.message}` })
        };
    }
};
