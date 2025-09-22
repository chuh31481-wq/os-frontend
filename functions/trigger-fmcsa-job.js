// Is function ka kaam GitHub Actions workflow ko trigger karna hai.

export async function onRequestPost(context) {
  // Environment se zaroori maloomat haasil karna
  const GITHUB_REPO = context.env.GITHUB_REPO; // "chuh31481-wq/fmcsa-result-"
  const GITHUB_PAT = context.env.GITHUB_PAT;   // Aapka Personal Access Token

  // Check karna ke tamam "keys" mojood hain
  if (!GITHUB_REPO || !GITHUB_PAT) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Configuration error: GitHub environment variables are not set in Cloudflare.",
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // GitHub API ka address
  const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;

  // Yeh 'event_type' bilkul dispatcher.yml wale naam se match karna chahiye
  const body = {
    event_type: 'run-fmcsa-job-from-frontend', 
  };

  try {
    // GitHub API ko request bhejna
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_PAT}`,
        'User-Agent': 'Cloudflare-Worker-Trigger', // Ek pehchan ke liye
      },
      body: JSON.stringify(body ),
    });

    // Check karna ke GitHub ne request qubool ki ya nahi
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Kamyabi ka paigham wapas bhejna
    return new Response(
      JSON.stringify({ success: true, message: 'Successfully triggered the FMCSA dispatcher workflow.' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error triggering GitHub workflow:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
