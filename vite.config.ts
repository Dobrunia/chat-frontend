// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import posthtml from '@vituum/vite-plugin-posthtml';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
  root,
  plugins: [posthtml()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      plugins: [dynamicImportVars()],
      input: {
        main: resolve(root, 'index.html'),
        profile_page: resolve(root, 'pages', 'profile_page', 'profile.html'),
        messenger_page: resolve(root, 'pages', 'messenger_page', 'messenger.html'),
        world_news_page: resolve(root, 'pages', 'world_news_page', 'world_news_page.html'),
        friends_page: resolve(root, 'pages', 'friends_page', 'friends.html'),
        music_page: resolve(root, 'pages', 'music_page', 'music.html'),
        cat_page: resolve(root, 'pages', 'cat_page', 'cat.html'),
        things_page: resolve(root, 'pages', 'things_page', 'things.html'),
        program_1: resolve(root, 'pages', 'things_page', 'programs', '1', '1.html'),
        program_memory: resolve(root, 'pages', 'things_page', 'programs', 'memory_numbers', 'memory_numbers.html'),
        program_puzzle: resolve(root, 'pages', 'things_page', 'programs', 'puzzle', 'puzzle.html'),
        donate_page: resolve(root, 'pages', 'donate_page', 'donate.html'),
        about_project_page: resolve(root, 'pages', 'about_project_page', 'about_project.html'),
      },
    },
  },
});
