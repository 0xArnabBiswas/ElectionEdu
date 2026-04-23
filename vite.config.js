import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          chatbot: ['./modules/chatbot.js'],
          ui: ['./modules/timeline.js', './modules/quiz.js', './modules/eligibility.js', './modules/stats.js'],
          particles: ['./modules/particles.js'],
        },
      },
    },
  },
});
