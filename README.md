# UK eSIM & Number Transfer Wizard

Guides users through eSIM QR setup, UK PAC code transfer, and common error triage. All carrier specifics live in `/rules/*.json` so you can change copy and links without touching code.

## What you get
- Static vanilla HTML/JS app that runs fully client-side
- Router with three flows: Scan QR, Get/Use PAC, Error Triage
- Seed carrier rules for O2, EE, Vodafone, and Three
- Jest tests covering rules integrity and flow basics
- GitHub Action for lint + test and optional Pages deploy

## Quick start
1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Start a dev server: `npm run dev` then open http://localhost:5173
4. Edit `/rules/*.json` to update steps, links, or error codes per carrier

## Editing carrier rules
- `rules/o2.json`, `rules/ee.json`, etc. hold metadata, flow steps, and support links.
- Validate changes locally with `npm test` (JSON schema + basic assertions).

## Deployment
- GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint + tests on pushes/PRs.
- Enable GitHub Pages (or point Netlify) at the repo to host the static output.

## Structure
```
.
├─ index.html
├─ assets/
│  └─ styles.css
├─ src/
│  ├─ app.js
│  ├─ router.js
│  ├─ ui.js
│  ├─ rules.js
│  └─ carriers.js
├─ rules/
│  ├─ o2.json
│  ├─ ee.json
│  ├─ vodafone.json
│  ├─ three.json
│  └─ schema.json
├─ tests/
│  ├─ rules.spec.js
│  └─ flow.spec.js
├─ package.json
├─ jest.config.js
├─ netlify.toml
└─ .github/workflows/ci.yml
```

### Private Preview (Codespaces)
- Open the repo in **GitHub Codespaces**.
- It auto-starts the preview and opens your browser (port **5173**).
- If it didn’t open: open the **Ports** panel and click the **globe** on 5173.
- Manual start: `npm run preview:root`
- Stop: `Ctrl + C` in the terminal.

**Deploying to Netlify:** deploy the **repo root** (same structure you previewed). No `/docs` mirror needed.
