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

    const headers = {
      'Client-ID': clientId,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'text/plain',
    };

    // Step 2: query release_dates directly for next 30 days
    const now  = Math.floor(Date.now() / 1000);
    const in30 = now + (30 * 24 * 60 * 60);

    const releasesBody = `
      fields date, platform.id, platform.name, game.id, game.name, game.cover.url, game.genres.name, game.platforms.id, game.platforms.name;
      where date >= ${now} & date <= ${in30};
      sort date asc;
      limit 80;
    `;

    const releasesRes = await fetch('https://api.igdb.com/v4/release_dates', {
      method: 'POST',
      headers,
      body: releasesBody,
    });

    if (!releasesRes.ok) {
      const err = await releasesRes.text();
      return new Response(
        JSON.stringify({ error: `IGDB release_dates error: ${err}` }),
        { status: releasesRes.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const releases = await releasesRes.json();

    // Deduplicate games by game.id, keeping earliest release date
    const gameMap = new Map();
    for (const r of releases) {
      if (!r.game) continue;
      const id = r.game.id;
      if (!gameMap.has(id)) {
        gameMap.set(id, {
          id,
          name: r.game.name,
          cover: r.game.cover || null,
          genres: r.game.genres || [],
          platforms: r.game.platforms || [],
          releaseDate: r.date || null,
        });
      }
    }

    const games = Array.from(gameMap.values());

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
