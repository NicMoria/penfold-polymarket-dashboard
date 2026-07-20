# Penfold · Event Risk Monitor

A single-file dashboard of Polymarket prediction markets **scored for relevance to Penfold's business** — metal-concentrate trade: China demand, shipping lanes, LatAm policy, USD financing, sanctions regimes. Markets below relevance 50/100 (sports, crypto, party primaries) are scored, logged and excluded on the page.

- **Curation:** market selection, relevance scores and rationales by the Fable desk model.
- **Odds — live, no VPN.** The Polymarket domain is TLS-blocked by some ISPs (incl. Swiss), so a viewer's browser can't hit the API directly. The page fetches live odds every 60 s and, when the direct call is blocked, **relays through a read-only CORS proxy** that reaches the API from an unblocked network. A committed same-origin `data.json` snapshot paints instantly and is the fallback if every relay is down. The header shows the last successful fetch (LIVE vs SNAPSHOT).
- **Design:** Moria neo-industrial brand system.

## Files

| File | Role |
|---|---|
| `index.html` | The dashboard. Board metadata + embedded snapshot + live fetch/relay logic. |
| `data.json` | Committed odds snapshot (instant paint + last-resort fallback). |
| `scripts/refresh.mjs` | Optional: refetch odds and rewrite `data.json` (Node 20, run anywhere unblocked). |
| `.github/workflows/refresh.yml` | Optional scheduled refresh of `data.json`; **not yet pushed** (needs the `workflow` token scope). Live odds don't depend on it — the in-page relay handles refresh. |

Live: https://nicmoria.github.io/penfold-polymarket-dashboard/
