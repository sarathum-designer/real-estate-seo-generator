# Kendra: an evidence ledger for India's GCC ecosystem

A strategy deck and a working prototype for a single source of truth on India's Global Capability Centres (GCCs).

## What's here

```text
gcc/index.html                 Working prototype (single file, no build step)
gcc/deck/index.html            The deck as a web page (arrow keys or click to navigate)
gcc/deck/Kendra-GCC-deck.pdf   The same deck as a 20-page PDF
gcc/deck/img/                  Prototype screenshots used in the deck
```

Open `gcc/index.html` or `gcc/deck/index.html` in a browser. On the Vercel deployment they are served at `/gcc/` and `/gcc/deck/`.

## The argument in one paragraph

GCC data isn't missing; it's unresolved. One Nasscom–Zinnov study counts 2,117 GCCs and 3,728 centres, and no report publishes the list behind its number. Kendra builds that list as a ledger of entities, claims, sources and confidence, using AI to read and match documents and plain formulas for every number a user sees. Service providers pay first for signals of who is coming next. Entrants get the index and location fit free, which is where the trust comes from. Provider money buys access and a profile, never a ranking.

## Prototype views

| View | What it shows |
| --- | --- |
| How many GCCs? | Every published count side by side, with unit and date, and how the ledger gets to one auditable number |
| Registry | Entities with aliases, claims, sources and confidence; conflicting claims stay visible |
| Coming next | Pre-entry and expansion signals scored from filings, hiring, space and state MoUs |
| Location fit | Cities ranked against adjustable mandate weights, with state GCC policies and data gaps |
| Provider records | Claimed GCC clients compared with evidence-linked deliveries |
| Ingest a source | A document goes in; typed claims, the entity match and a ledger diff come out |
| Ask Kendra | A tool-using AI analyst that answers only from the ledger and shows which tools it called |

### AI engine

The prototype picks the first engine that's available:

1. **Claude inside claude.ai**, when opened as a published artifact. This uses the viewer's account.
2. **Anthropic API key**, pasted in the Ask Kendra panel. The key is stored only in that browser.
3. **Offline rule engine**, so the demo always works.

Ask Kendra runs as an agent loop. Claude calls `market_counts`, `search_registry`, `compare_cities`, `rank_cities`, `find_providers` and `upcoming_gccs`, which are the same functions the views use.

## Data honesty

- **Market figures are real and cited.** Sources are Nasscom–Zinnov, EY, ANSR, ICRA, ANAROCK and state policy summaries, linked in the app. The FY26 Nasscom–Zinnov figures come from secondary reporting of the study.
- **Rents and the 1–5 city scores are working estimates.** The app labels them that way.
- **Company, provider and signal records are fictional sample data.** They show how the pipeline works without making false claims about real companies.
