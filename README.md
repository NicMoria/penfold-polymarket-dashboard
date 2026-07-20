# Penfold · Event Risk Monitor

A single-file dashboard of Polymarket prediction markets **scored for relevance to Penfold's business** — metal-concentrate trade: China demand, shipping lanes, LatAm policy, USD financing, sanctions regimes. Markets below relevance 50/100 (sports, crypto, party primaries) are scored, logged and excluded.

- **Curation:** market selection, relevance scores and rationales by the Fable desk model.
- **Odds:** embedded snapshot (Polymarket Gamma API, 2026-07-20 19:32 UTC) plus an in-page script that re-prices live against the same API every 60 s when the viewer's network permits. Where the domain is ISP-blocked (e.g. Switzerland), the page holds and labels the snapshot.
- **Design:** Moria neo-industrial brand system.

Live: https://nicmoria.github.io/penfold-polymarket-dashboard/
