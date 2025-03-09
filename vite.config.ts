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
    }
})
