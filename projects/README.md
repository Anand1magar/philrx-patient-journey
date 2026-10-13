# projects/ — base flow + white-label brands

```
projects/
├── myphil-base-flow/   ← the base flow. SOURCE OF TRUTH. Do not brand this folder.
└── jnj-caplyta/        ← white-label: J&J CAPLYTA, a full copy of the base flow, re-branded
```

Each brand is a **complete standalone copy** of `myphil-base-flow` with its own
`package.json` / `npm run dev`. Only brand-owned CSS variables, the screen set,
and the copy are changed per brand.

A shared-code white-label system (BrandProvider, `brand.json`, a `virtual:brand`
module) was designed and then dropped in favour of this copy-per-brand approach.
Don't resurrect it without talking to the team first.

## Two ways a brand resolves `@ds`

| Mode | `@ds` points at | Use when |
|---|---|---|
| **Shared** | the repo root (`../../components`, `tokens`, `assets`) | the brand lives only in this monorepo |
| **Vendored** | the brand's own `ds/` folder | the brand ships to the client as its own repo and deploys separately |

`myphil-base-flow` is shared. `jnj-caplyta` is **vendored** — J&J gets a dedicated
repo, so that project carries the ~365 KB slice of the design system it imports
and builds with no monorepo present. Its `scripts/vendor-ds.mjs` regenerates that
folder from the root; run it after any shared design-system change.

Pick vendored only when the brand genuinely ships separately. It freezes the
design system for that brand, which is the point for a client handoff and a
liability otherwise.

## Shared reference material

`reference/` at the repo root holds material every brand draws on — currently
`reference/autocomms/`, the SMS/email copy with its three tone variants
(Motivational / Professional / Friendly) and the rules for each. A brand picks
one tone and records the choice in its own README. Vendored brands get a copy of
`reference/` alongside their `ds/`.

## Run a brand

    cd projects/<brand-name>
    npm install
    npm run dev

Two brands running at once land on different ports — Vite picks the next free
one and prints it. Check the `<title>` if you're unsure which is which.

## Make a new white-label brand

1. Copy the base flow to a folder named after the brand:

       cp -R projects/myphil-base-flow "projects/<brand-name>"
       rm -rf "projects/<brand-name>"/{node_modules,dist,.vite}

2. In the copy, change only:
   - **`package.json`** / **`package-lock.json`** → `"name"`
   - **`index.html`** → `<title>`
   - **`src/brand-theme.css`** (new file, imported in `src/main.jsx` right after
     `@ds/styles.css`) → override `--sky`, `--sky-hover`, `--sky-disabled`,
     `--sky-tint`, `--secondary`, `--brand-accent`, `--header-tagline`.
     "auto" shades derive from the primary (~+20% / +60% / +95% toward white for
     hover / disabled / tint).
   - **`src/components/BrandHeader.jsx`** and **`BrandAppHeader.jsx`** → brand
     logo and tagline color. Screens import
     `BrandHeader as MyPhilHeader` so each call site is a one-line import swap.
   - **`src/assets/<brand>-logo.svg`** → the brand logo (or a placeholder)
   - **screen text** the client asked to change (drug name, pharmacy name,
     account label, …) — edit the strings directly in the screen files
   - **`src/pageRegistry.js`** → the screen set and order for this client; point
     each screen's primary button at the next route; delete unused
     `src/pages/*` and `src/components/*`
   - **`src/flow/flowData.js`** → the navigator's stage/screen metadata, so the
     side panel matches the real routes
   - **SMS/email copy** → pick a tone column from `reference/autocomms/` and
     apply it consistently; record the choice in the brand's README

3. If the brand ships as its own repo, vendor its dependencies:

       node scripts/vendor-ds.mjs

   Copy `projects/jnj-caplyta/scripts/vendor-ds.mjs` as the starting point and
   repoint `@ds` in `vite.config.js` at the generated `ds/` folder.

4. `npm install && npm run build` must pass, then `npm run dev` and walk the flow.

Watch out for blanket find-and-replace on the brand name: component identifiers
and filenames (`PhilRxAppHeader`) match the same string as the display text and
will be silently broken by a careless sweep. Rename those deliberately.

See `projects/jnj-caplyta/README.md` for a worked example, including a Playwright
walkthrough script that asserts no base-brand string survives the rebrand.
