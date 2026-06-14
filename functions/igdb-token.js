export async function onRequest(context) {
  const clientId     = context.env.TWITCH_CLIENT_ID;
  const clientSecret = context.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: 'Missing Twitch credentials in environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Step 1: get access token from Twitch
    const tokenRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: 'POST' }
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return new Response(
        JSON.stringify({ error: `Twitch token error: ${err}` }),
        { status: tokenRes.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: query IGDB for upcoming releases (next 30 days)
    const now  = Math.floor(Date.now() / 1000);
    const in30 = now + (30 * 24 * 60 * 60);

    const body = `
      fields name, cover.url, platforms.id, platforms.name, genres.name, release_dates.date, release_dates.platform;
      where release_dates.date >= ${now}
        & release_dates.date <= ${in30}
        & category = 0
        & version_parent = null;
      sort release_dates.date asc;
      limit 80;
    `;

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
      },
      body,
    });

    if (!igdbRes.ok) {
      const err = await igdbRes.text();
      return new Response(
        JSON.stringify({ error: `IGDB error: ${err}` }),
        { status: igdbRes.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const games = await igdbRes.json();

    return new Response(
      JSON.stringify({ games }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
