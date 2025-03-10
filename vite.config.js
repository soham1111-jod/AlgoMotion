import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui-components': [
                        './src/components/ui/select.jsx',
                        './src/components/ui/button.jsx',
                    ],
                    'algorithms': [
                        './src/algorithms/sorting/bubbleSort.js',
                        './src/algorithms/sorting/quickSort.js',
                        './src/algorithms/sorting/mergeSort.js',
                        './src/algorithms/sorting/selectionSort.js',
                        './src/algorithms/sorting/insertionSort.js',
                        './src/algorithms/searching/linearSearch.js',
                        './src/algorithms/searching/binarySearch.js',
                        './src/algorithms/dp/fibonacci.js',
                        './src/algorithms/math/gcd.js',
                        './src/algorithms/graphs/BFS.js',
                        './src/algorithms/graphs/DFS.js',
                    ],
                },
            },
        },
        // Enable minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        // Generate source maps for production
        sourcemap: false,
    },
    // Enable caching
    server: {
        hmr: true,
    },
    // Optimize CSS
    css: {
        devSourcemap: false,
    },
});
