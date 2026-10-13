# projects/ — base flow + white-label brands

```
projects/
├── myphil-base-flow/   ← the base flow. SOURCE OF TRUTH. Do not brand this folder.
└── jnj-caplyta/        ← white-label: J&J CAPLYTA, a full copy of the base flow, re-branded
```

Each brand is a **complete standalone copy** of `myphil-base-flow` with its own
`package.json` / `npm run dev`. They share the design system at the repo root
(`../../components`, `../../tokens`, `../../assets`) via the `@ds` Vite alias —
only brand-owned CSS variables are overridden per brand.

A shared-code white-label system (BrandProvider, `brand.json`, a `virtual:brand`
module) was designed and then dropped in favour of this copy-per-brand approach.
Don't resurrect it without talking to the team first.

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

3. `npm install && npm run build` must pass, then `npm run dev` and walk the flow.

Watch out for blanket find-and-replace on the brand name: component identifiers
and filenames (`PhilRxAppHeader`) match the same string as the display text and
will be silently broken by a careless sweep. Rename those deliberately.

See `projects/jnj-caplyta/README.md` for a worked example, including a Playwright
walkthrough script that asserts no base-brand string survives the rebrand.
