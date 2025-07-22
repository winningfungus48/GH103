import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/GH103/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and React Router into their own chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'helmet-vendor': ['react-helmet-async'],
          // Group game components together
          'games': [
            './src/games/numberle',
            './src/games/wordle', 
            './src/games/shapele',
            './src/games/simonle',
            './src/games/colorle',
            './src/games/mathle',
            './src/games/puzzlele',
            './src/games/memoryle'
          ]
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Minify options - use esbuild for better performance
    minify: 'esbuild',
    target: 'es2015'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async']
  }
})
