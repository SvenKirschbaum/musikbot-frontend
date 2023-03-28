// noinspection NpmUsedModulesInstalled
const {createProxyMiddleware} = require('http-proxy-middleware');

// const host = 'https://musikbot.elite12.de';
const host = 'http://localhost:8080';
const secure = host.includes('https');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api/sock', {
            target: host,
            ws: true,
            secure,
            changeOrigin: secure,
        })
    );
    app.use(
        createProxyMiddleware('/api', {
            target: host,
            secure,
            changeOrigin: secure,
        })
    );
};
