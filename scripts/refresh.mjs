// Refresh Polymarket odds for the curated board and write data.json.
// Runs in GitHub Actions (US runners) — the Gamma API is reachable there even
// though it is TLS-blocked from some networks (e.g. Swiss ISPs). The page reads
// the committed data.json same-origin, so odds stay live for every viewer.
import { writeFile } from "node:fs/promises";

const SLUGS = [
  "will-china-invade-taiwan-before-2027",
  "will-the-us-invade-iran-before-2027",
  "venezuela-leader-end-of-2026",
  "fed-decision-in-july-181",
  "how-many-fed-rate-cuts-in-2026",
  "brazil-presidential-election",
  "xi-jinping-out-before-2027",
  "putin-out-before-2027",
  "netanyahu-out-before-2027",
];

const API = "https://gamma-api.polymarket.com/events?slug=";

function parseEvent(ev) {
  const markets = Array.isArray(ev.markets) ? ev.markets : [];
  const rows = [];
  for (const mk of markets) {
    if (mk.closed) continue;
    let op, on;
    try { op = JSON.parse(mk.outcomePrices || "[]"); on = JSON.parse(mk.outcomes || "[]"); }
    catch { continue; }
    if (!op.length) continue;
    if (markets.length === 1 && on.length === 2 && on[0] === "Yes")
      rows.push({ n: "Yes", p: +op[0] }, { n: "No", p: +op[1] });
    else
      rows.push({ n: mk.groupItemTitle || mk.question, p: +op[0] });
  }
  if (!rows.length) return null;
  if (!(rows.length === 2 && rows[0].n === "Yes")) rows.sort((a, b) => b.p - a.p);
  return {
    outcomes: rows.slice(0, 5),
    volume: +ev.volume || 0,
    volume24hr: +ev.volume24hr || 0,
  };
}

async function fetchSlug(slug) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(API + encodeURIComponent(slug), {
        headers: { "User-Agent": "penfold-event-risk-monitor" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const events = await res.json();
      if (Array.isArray(events) && events[0]) {
        const p = parseEvent(events[0]);
        if (p) return p;
      }
      return null;
    } catch (e) {
      if (attempt === 2) { console.error(`  MISS ${slug}: ${e.message}`); return null; }
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
}

const prices = {};
for (const slug of SLUGS) {
  const p = await fetchSlug(slug);
  if (p) { prices[slug] = p; console.error(`  OK   ${slug}: ${p.outcomes[0].n} ${p.outcomes[0].p.toFixed(3)}`); }
}

if (Object.keys(prices).length < 5) {
  console.error(`Only ${Object.keys(prices).length} markets fetched — refusing to overwrite data.json.`);
  process.exit(1);
}

const data = { fetched_at: new Date().toISOString(), source: "polymarket-gamma", prices };
await writeFile(new URL("../data.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.error(`\nwrote ${Object.keys(prices).length}/${SLUGS.length} markets -> data.json`);
