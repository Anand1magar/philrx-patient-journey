import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @ds resolves inside this project, not up to a monorepo root: this brand ships
// to the client as its own repo and deploys separately, so it carries the slice
// of the design system it uses in ./ds. Regenerate with
// `node scripts/vendor-ds.mjs` from inside the monorepo.
const designSystem = path.resolve(__dirname, 'ds');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': designSystem,
    },
  },
  server: {
    // Opens straight to /flow, the entry point for reviewing the patient
    // journey — root "/" redirects there client-side (see src/App.jsx).
    open: true,
  },
});
