// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import posthtml from '@vituum/vite-plugin-posthtml';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
  root,
  plugins: [posthtml()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        // text: resolve(root, 'test', 'test.html'),
      },
    },
  },
});
