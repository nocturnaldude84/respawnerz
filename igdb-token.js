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
    const res = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${690unlca6dw5m4l6p5xll66bhw4cnd}&client_secret=${n6iouurc232t0joxvkconpwgkdvayo}&grant_type=client_credentials`,
      { method: 'POST' }
    );

    if (!res.ok) {
      const err = await res.text();
      return new Response(
        JSON.stringify({ error: `Twitch token error: ${err}` }),
        { status: res.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({ access_token: data.access_token, client_id: clientId }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=3600',
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
