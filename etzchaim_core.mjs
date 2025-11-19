// etzchaim_core.mjs
// -----------------------------------------------------------------------------
// Core building blocks for the Etz Chaim / LuminaNexus UI
// This file is a "vault" of essentials so we can safely delete or rewrite
// heavy API/index files later, without losing the important pieces.
// -----------------------------------------------------------------------------

/* ---------------- Shared styles & HTML shell ---------------- */

export const STYLE = `
:root{
  --bg1:#030715;
  --bg2:#0a1733;
  --accent:#d88419;
  --text:#f6f3ea;
  --muted:#d9d3c4;
  --gold:#f6d36b;
}
body{
  margin:0;
  font-family:Georgia,serif;
  color:var(--text);
  background:
    radial-gradient(1200px 700px at 50% -10%, rgba(246,211,107,.12), transparent 60%),
    linear-gradient(180deg,var(--bg2),var(--bg1));
}
a{color:#ffd57a;text-decoration:none}
footer{
  padding:16px;
  color:#bdb6a0;
  text-align:center;
}
.hero{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:6rem 1rem;
  background:
    radial-gradient(1000px 600px at 50% 10%, rgba(246,211,107,.12), transparent 60%);
}
h1{
  font-size:clamp(2.6rem,5.5vw,4.4rem);
}
.cta{
  display:inline-block;
  background:#d88419;
  color:#1b1200;
  padding:.95rem 1.3rem;
  border-radius:12px;
  font-weight:700;
}
.cta:hover{background:#f09b2b}
.stage{
  max-width:980px;
  margin:1rem auto;
  height:calc(100vh - 90px);
}
svg{
  display:block;
  height:100%;
  width:auto;
  margin:0 auto;
}
.orb-wrap{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:2rem 1rem;
}
.orb{
  position:relative;
  width:min(980px,94vw);
  aspect-ratio:1/1;
  border-radius:18px;
  background:linear-gradient(180deg, rgba(8,16,34,.7), rgba(3,6,15,.95));
}
.center{
  position:absolute;
  left:50%;
  top:50%;
  width:36%;
  height:36%;
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:radial-gradient(circle at 40% 35%, #fff4d6, #f6d36b 45%, #b88a2b 85%);
}
.center h3{
  position:absolute;
  inset:auto 0 24% 0;
  margin:0;
  text-align:center;
  color:#1b1200;
}
.center small{
  position:absolute;
  inset:auto 0 12% 0;
  text-align:center;
  color:#1b1200;
}
.sat{
  position:absolute;
  width:20%;
  height:20%;
  border-radius:50%;
  background:radial-gradient(circle at 40% 35%, #fff4d6, #f6d36b 45%, #b88a2b 85%);
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:6px;
  color:#1b1200;
  font-weight:700;
}
.sat span{font-size:.9rem}
.sat.top{left:50%;top:13%;transform:translate(-50%,-50%)}
.sat.tl{left:21%;top:32%;transform:translate(-50%,-50%)}
.sat.bl{left:21%;top:70%;transform:translate(-50%,-50%)}
.sat.bot{left:50%;top:86%;transform:translate(-50%,-50%)}
.sat.br{left:79%;top:70%;transform:translate(-50%,-50%)}
.sat.tr{left:79%;top:32%;transform:translate(-50%,-50%)}
.hot{
  position:absolute;
  display:block;
  border-radius:50%;
  background:rgba(255,255,255,0);
}
.wrap{
  max-width:900px;
  margin:2rem auto;
  padding:0 1rem;
  text-align:center;
}
`;

// Simple HTML shell that any route can reuse
export function shell(title, bodyHtml) {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title} — LuminaNexus</title>
<style>${STYLE}</style>
</head><body>
${bodyHtml}
<footer>© ${new Date().getFullYear()} LuminaNexus.org</footer>
</body></html>`;
}

/* ---------------- Etz Chaim map core ---------------- */

// Display names for Sefirot
export const MAP = {
  keter:   { he:"כֶּתֶר",   en:"Keter" },
  chochmah:{ he:"חָכְמָה", en:"Chochmah" },
  binah:   { he:"בִּינָה",  en:"Binah" },
  chesed:  { he:"חֶסֶד",   en:"Chesed" },
  gevurah: { he:"גְּבוּרָה",en:"Gevurah" },
  tiferet: { he:"תִּפְאֶרֶת",en:"Tiferet" },
  netzach: { he:"נֵצַח",   en:"Netzach" },
  hod:     { he:"הוֹד",    en:"Hod" },
  yesod:   { he:"יְסוֹד",   en:"Yesod" },
  malchut: { he:"מַלְכוּת", en:"Malchut" }
};

// Coordinates for the Sefirot nodes
export const XY = {
  keter:   [500,110],
  chochmah:[340,260],
  binah:   [660,260],
  chesed:  [320,470],
  gevurah: [680,470],
  tiferet: [500,590],
  netzach: [360,780],
  hod:     [640,780],
  yesod:   [500,900],
  malchut: [500,1080]
};

// Generates the Etz Chaim SVG (no framework needed)
export function etzSvg() {
  const connections = [
    ["keter","chochmah"],
    ["keter","binah"],
    ["keter","tiferet"],
    ["chochmah","binah"],
    ["chochmah","chesed"],
    ["binah","gevurah"],
    ["chesed","tiferet"],
    ["gevurah","tiferet"],
    ["chesed","netzach"],
    ["gevurah","hod"],
    ["netzach","yesod"],
    ["hod","yesod"],
    ["tiferet","yesod"],
    ["yesod","malchut"]
  ];

  const lines = connections.map(([a,b]) => {
    const [x1,y1] = XY[a];
    const [x2,y2] = XY[b];
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
      stroke="rgba(255,245,200,.35)" stroke-width="2"/>`;
  }).join("");

  const nodes = Object.entries(MAP).map(([id,m]) => {
    const [x,y] = XY[id];
    // Default hrefs we used before; can change in a future app
    const href =
      id === "malchut" ? "/malchut" :
      id === "yesod"   ? "/yesod"   :
      id === "binah"   ? "/binah"   :
      `/${id}`;

    return `<a xlink:href="${href}">
      <g>
        <circle cx="${x}" cy="${y}" r="44" fill="#f6d36b"/>
        <text x="${x}" y="${y-26}" text-anchor="middle" font-size="14" fill="#000">${m.he}</text>
        <text x="${x}" y="${y+22}" text-anchor="middle" font-size="12" fill="#000">${m.en}</text>
      </g>
    </a>`;
  }).join("");

  return `<div class="stage"><svg viewBox="0 0 1000 1300">${lines}${nodes}</svg></div>`;
}

/* ---------------- Orb pages: Malchut, Yesod, Binah stub ---------------- */

// Malchut: community / nodes / announcements hub
export function malchutOrb() {
  return `
<div class="orb-wrap">
  <div class="orb">
    <div class="center">
      <h3>Malchut</h3>
      <small>מַלְכוּת • Kingship</small>
    </div>

    <div class="sat top"><span>Create Node</span></div>
    <div class="sat tr"><span>Join Node</span></div>
    <div class="sat br"><span>Announcements</span></div>
    <div class="sat bot"><span>Chat &amp; Groups</span></div>
    <div class="sat bl"><span>Events</span></div>
    <div class="sat tl"><span>LuminaNation</span></div>

    <!-- Hotspot links -->
    <a class="hot" style="left:50%;top:50%;width:36%;height:36%;transform:translate(-50%,-50%)" href="/malchut/describe"></a>
    <a class="hot" style="left:50%;top:13%;width:20%;height:20%;transform:translate(-50%,-50%)" href="/malchut/create-node"></a>
    <a class="hot" style="left:79%;top:32%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/malchut/join-node"></a>
    <a class="hot" style="left:79%;top:70%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/announcements"></a>
    <a class="hot" style="left:50%;top:86%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/malchut/chat"></a>
    <a class="hot" style="left:21%;top:70%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/events"></a>
    <a class="hot" style="left:21%;top:32%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/luminanation"></a>
  </div>
</div>
<div class="wrap">
  <a class="cta" href="/etzchaim">← Back</a>
</div>`;
}

// Yesod: texts / tools / media hub
export function yesodOrb() {
  return `
<div class="orb-wrap">
  <div class="orb">
    <div class="center">
      <h3>Yesod</h3>
      <small>יְסוֹד • Foundation</small>
    </div>

    <div class="sat top"><span>Texts &amp; Resources</span></div>
    <div class="sat tr"><span>Personal Journals</span></div>
    <div class="sat br"><span>Community Knowledge</span></div>
    <div class="sat bot"><span>Multimedia Archives</span></div>
    <div class="sat bl"><span>Gematria &amp; Tools</span></div>
    <div class="sat tl"><span>Search &amp; Discovery</span></div>

    <!-- Hotspot links -->
    <a class="hot" style="left:50%;top:50%;width:36%;height:36%;transform:translate(-50%,-50%)" href="/yesod/describe"></a>
    <a class="hot" style="left:50%;top:13%;width:20%;height:20%;transform:translate(-50%,-50%)" href="/yesod/texts"></a>
    <a class="hot" style="left:79%;top:32%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/yesod/journals"></a>
    <a class="hot" style="left:79%;top:70%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/yesod/knowledge"></a>
    <a class="hot" style="left:50%;top:86%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/yesod/media"></a>
    <a class="hot" style="left:21%;top:70%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/yesod/gematria"></a>
    <a class="hot" style="left:21%;top:32%;width:22%;height:22%;transform:translate(-50%,-50%)" href="/yesod/search"></a>
  </div>
</div>
<div class="wrap">
  <a class="cta" href="/etzchaim">← Back</a>
</div>`;
}

// Binah: future study hub (Torah, Tanakh, Mishnah, Zohar, etc.)
export function binahStub() {
  return `
<div class="wrap">
  <h2>Binah — Understanding</h2>
  <p>
    This node will become a study hub: Torah, Tanakh, Mishnah, Kabbalah, Zohar, Talmud, and more.
    For now, it stands as a marker of the Library yet to unfold.
  </p>
  <a class="cta" href="/etzchaim">← Back</a>
</div>`;
}

/* ---------------- Minimal announcements seed ---------------- */

// Simple in-memory announcements seed (can be adapted to any backend later)
export const seedAnnouncements = [
  {
    id: 1,
    title: "LuminaNexus.org Online",
    body:
      "Welcome to LuminaNexus.org! The sacred hub is now live. Explore the Etz Chaim, walk the Celestial Library of the 231 Gates, and help build local LuminaNodes for tzedakah and chesed.",
    ts: Date.now()
  }
];

// Example helper to render announcements as HTML
export function announcementsHtml(items = seedAnnouncements) {
  const list = items.slice().reverse().map(a => `
    <article class="wrap" style="max-width:900px;text-align:left">
      <h2>${a.title}</h2>
      <p>${a.body}</p>
    </article>
  `).join("");
  return list + `<div class="wrap"><a class="cta" href="/etzchaim">← Back</a></div>`;
}

/* ---------------- Optional: tiny landing snippet ---------------- */

// A minimal home-body snippet you can reuse somewhere if you like:
export function simpleHomeBody() {
  return `
<section class="hero">
  <div>
    <h1>LuminaNexus</h1>
    <p style="max-width:34rem;margin:1rem auto 2rem auto;">
      A quiet sanctuary of light — mapping the Etz Chaim, the 231 Gates, and the living network of LuminaNodes in the world below.
    </p>
    <p>
      <a class="cta" href="/etzchaim">Enter the Etz Chaim</a>
    </p>
  </div>
</section>`;
}
