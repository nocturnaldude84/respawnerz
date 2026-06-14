const CHANNELS = [
  { id: 'UCKy1dAqELo0zrOtPkf0aTMg', name: 'IGN',         badge: 'ign',      maxResults: 12 },
  { id: 'UCpvtp7mH0jtBy3nHpIsM0jQ', name: 'Xbox',        badge: 'xbox',     maxResults: 8  },
  { id: 'UC-2Y8dQb0S6DtpxNgAKoJKA', name: 'PlayStation', badge: 'ps',       maxResults: 8  },
  { id: 'UCGIY_O-8vW4rfX98KlMkvRg', name: 'Nintendo',    badge: 'nintendo', maxResults: 8  },
];

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

export async function onRequest(context) {
  const apiKey = context.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing YOUTUBE_API_KEY environment variable.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const allVideos = [];

    for (const channel of CHANNELS) {
      // Step 1: get uploads playlist ID for this channel (1 quota unit)
      const chRes = await fetch(
        `${YT_BASE}/channels?part=contentDetails&id=${channel.id}&key=${apiKey}`
      );

      if (!chRes.ok) {
        const err = await chRes.text();
        console.error(`Channel fetch failed for ${channel.name}: ${err}`);
        continue;
      }

      const chData = await chRes.json();
      const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsId) {
        console.error(`No uploads playlist found for ${channel.name}`);
        continue;
      }

      // Step 2: get latest videos from uploads playlist (1 quota unit)
      const plRes = await fetch(
        `${YT_BASE}/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${channel.maxResults}&key=${apiKey}`
      );

      if (!plRes.ok) {
        const err = await plRes.text();
        console.error(`Playlist fetch failed for ${channel.name}: ${err}`);
        continue;
      }

      const plData = await plRes.json();
      const items = plData.items || [];

      for (const item of items) {
        const snippet = item.snippet;
        if (!snippet) continue;

        allVideos.push({
          id:          snippet.resourceId?.videoId || '',
          title:       snippet.title || '',
          thumb:       snippet.thumbnails?.maxres?.url
                    || snippet.thumbnails?.high?.url
                    || snippet.thumbnails?.medium?.url
                    || '',
          channelName: channel.name,
          channelId:   channel.id,
          badge:       channel.badge,
          publishedAt: snippet.publishedAt || '',
        });
      }
    }

    // Sort newest first across all channels
    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return new Response(
      JSON.stringify({ videos: allVideos }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
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
