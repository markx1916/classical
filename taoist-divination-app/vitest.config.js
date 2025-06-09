// vitest.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true, // Use Vitest global APIs
    environment: 'happy-dom', // Or 'jsdom' if happy-dom causes issues
    coverage: { // Optional: configure code coverage
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
  },
});
