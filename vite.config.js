import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      // tách Three.js ra file riêng để trình duyệt lưu đệm lâu dài
      output: { manualChunks: { three: ['three'] } }
    }
  }
});
