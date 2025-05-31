import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 3000
    },
    css: {
        devSourcemap: true
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src')
        }
    },
    define: {
        global: 'window'
    },
    build: {
        // Performance optimizations
        target: 'es2015',
        cssMinify: true,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunk for large libraries
                    vendor: ['react', 'react-dom'],
                    // UI libraries chunk
                    ui: ['react-router-dom', '@tanstack/react-query'],
                    // Editor chunk for heavy components
                    editor: ['react-quill', 'highlight.js']
                },
                // Optimize chunk names for caching
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
            }
        },
        // Enable compression
        reportCompressedSize: true,
        // Optimize bundle size
        chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
        // Pre-bundle dependencies for faster dev startup
        include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
    }
})
