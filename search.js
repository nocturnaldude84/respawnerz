// search.js — Respawnerz client-side search
// Update this array every time you publish a new article.

const ARTICLES = [
  {
    title: "GTA 6 Is Warping the Entire Industry Around It",
    url: "gta6-hype-industry-impact-2026.html",
    excerpt: "Two trailers. Zero paid ads. And every major publisher quietly moving their release dates out of the way.",
    category: "News",
    categoryClass: "cat-news",
    date: "Jun 12, 2026",
    readTime: "5 min",
    image: "assets/respawnerz.webp",
    tags: ["gta vi", "gta 6", "rockstar", "news", "industry"]
  },
  {
    title: "Gears of War: E-Day Gets a Gameplay Reveal, Release Date, and Collector's Edition",
    url: "gears-of-war-eday-gameplay-reveal.html",
    excerpt: "First real gameplay. A release date of October 6. A $299 Collector's Edition. And a confirmation it stays on Xbox. The full breakdown from the Xbox Games Showcase.",
    category: "News",
    categoryClass: "cat-news",
    date: "Jun 08, 2026",
    readTime: "10 min",
    image: "assets/gearsofwareday.webp",
    tags: ["gears of war", "eday", "xbox", "gameplay", "showcase", "release date"]
  },
  {
    title: "MW4 DMZ First Look: The Hajin Exclusion Zone Trailer Fully Broken Down",
    url: "mw4-dmz-first-look-trailer-breakdown.html",
    excerpt: "DMZ is back and built from the ground up. New map, narrative context, a bounty system, and interconnected systems that actually talk to each other.",
    category: "Trailers",
    categoryClass: "cat-trailers",
    date: "Jun 07, 2026",
    readTime: "8 min",
    image: "assets/MW4-DMZ-INITIAL-INTEL-006.webp",
    tags: ["mw4", "modern warfare 4", "dmz", "call of duty", "trailer", "fps"]
  },
  {
    title: "Call of Duty: Modern Warfare 4 - Everything We Know About the Campaign, Multiplayer, and Vault Edition",
    url: "mw4-everything-we-know.html",
    excerpt: "Makarov dies in mission two. Kill Block regenerates with 500+ configurations. The most promising MW preview in years, with the rough edges still visible.",
    category: "News",
    categoryClass: "cat-news",
    date: "Jun 06, 2026",
    readTime: "12 min",
    image: "assets/codmw4.webp",
    tags: ["mw4", "modern warfare 4", "call of duty", "campaign", "multiplayer", "vault edition"]
  },
  {
    title: "Tomb Raider: Legacy of Atlantis - Everything We Know From the New Trailer",
    url: "tomb-raider-legacy-of-atlantis-blog.html",
    excerpt: "A full ground-up reimagining in UE5. Delayed to February 12, 2027. Three editions, a T-Rex statue, and the classic Lara rebuilt with modern fidelity.",
    category: "News",
    categoryClass: "cat-news",
    date: "Jun 06, 2026",
    readTime: "9 min",
    image: "assets/tombraideratlantis.webp",
    tags: ["tomb raider", "lara croft", "atlantis", "ue5", "trailer", "2027"]
  },
  {
    title: "Clockwork Revolution - The Heist Trailer: Steampunk Avalon, Time Travel Consequences, and a 2027 Xbox Exclusive",
    url: "clockwork-revolution-heist-trailer.html",
    excerpt: "InXile showed gameplay, a full cast, the villain's strategy, and locked in a 2027 release. More ambitious than most trailers let on.",
    category: "Trailers",
    categoryClass: "cat-trailers",
    date: "Jun 06, 2026",
    readTime: "10 min",
    image: "assets/clockworkrevolutionheist.webp",
    tags: ["clockwork revolution", "inxile", "xbox", "steampunk", "trailer", "2027", "showcase"]
  },
  {
    title: "TES6 Skips Another Showcase. Xbox Finally Explained Why.",
    url: "elder-scrolls-6-xbox-update-2026.html",
    excerpt: "Matt Booty says he watched Elder Scrolls 6 being played. It looks amazing. Still no trailer. Also: ESO's Thieves Guild returns July 8.",
    category: "News",
    categoryClass: "cat-news",
    date: "Jun 12, 2026",
    readTime: "9 min",
    image: "assets/elder-scrolls-6-xbox-2026.webp",
    tags: ["elder scrolls 6", "tes6", "bethesda", "xbox", "showcase", "eso"]
  },
  {
    title: "The Legend of Zelda: Ocarina of Time Remake Confirmed. What Nintendo Does Next Matters",
    url: "zelda-ocarina-of-time-remake.html",
    excerpt: "Nintendo finally pulled the trigger on a full Ocarina of Time rebuild for Switch 2. Now comes the harder question: what kind of remake is it?",
    category: "News",
    categoryClass: "cat-news",
    date: "Jun 11, 2026",
    readTime: "9 min",
    image: "assets/zelda-ocarina-of-time-remake.webp",
    tags: ["zelda", "ocarina of time", "nintendo", "switch 2", "remake", "rpg"]
  }
];

// ─── Search Logic ──────────────────────────────────────────────────

function searchArticles(query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/);

  return ARTICLES.filter(article => {
    const haystack = [
      article.title,
      article.excerpt,
      article.category,
      ...article.tags
    ].join(" ").toLowerCase();

    return terms.every(term => haystack.includes(term));
  });
}

// ─── Header Search Box (all pages) ────────────────────────────────

(function initHeaderSearch() {
  const input = document.querySelector(".header-search input");
  if (!input) return;

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const q = this.value.trim();
      if (q.length > 0) {
        window.location.href = "search.html?q=" + encodeURIComponent(q);
      }
    }
  });
})();
