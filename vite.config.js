import {defineConfig, splitVendorChunkPlugin} from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl'

const apiHost = 'https://musikbot.elite12.de';
// const apiHost = 'http://localhost:8080';

const secure = apiHost.includes('https');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgrPlugin(), basicSsl(), splitVendorChunkPlugin()],
    server: {
        port: 3000,
        // Required to work with oauth provider
        https: true,
        proxy: {
            '/api': {
                target: apiHost,
                changeOrigin: secure,
                secure,
            },
            '/api/sock': {
                target: apiHost,
                ws: true,
                secure,
                changeOrigin: secure,
            }
        },
    },
    preview: {
        port: 3000
    },
    build: {
        outDir: 'build'
    },
    resolve: {
        // Required for react-moment: https://github.com/vitejs/vite/issues/7376
        mainFields: []
    }
});
