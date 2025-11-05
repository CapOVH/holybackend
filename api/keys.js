// GET /api/keys

export const GET = async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://capovh.github.io',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  const apiUrl = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/contents/${process.env.GITHUB_PATH}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return new Response(
      JSON.stringify({ content }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://capovh.github.io',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://capovh.github.io',
        },
      }
    );
  }
};
