import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';  // Import path for resolving aliases

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@css': path.resolve(__dirname, 'resources/css'),
            '@': '/resources/js',  // Alias '@' to your js directory
        },
    },
});
