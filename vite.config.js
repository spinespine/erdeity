import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    global: {}
  },

  build: {
    rollupOptions: {
      input: {
        app: './index.html',
      },

      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(-1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `erdeity-assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'erdeity-assets/js/[name]-[hash].js',
        entryFileNames: 'erdeity-assets/js/[name]-[hash].js',
    },
  },
  server: {
    open: '/erdeity.html',
  },
}})
