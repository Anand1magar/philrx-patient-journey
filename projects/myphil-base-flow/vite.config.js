import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': repoRoot,
    },
  },
  server: {
    // Opens straight to /flow, the entry point for reviewing the patient
    // journey — root "/" redirects there client-side (see src/App.jsx).
    open: true,
  },
});
