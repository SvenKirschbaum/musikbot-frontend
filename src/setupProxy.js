// noinspection NpmUsedModulesInstalled
const {createProxyMiddleware} = require('http-proxy-middleware');

const host = 'https://musikbot.elite12.de';
// const host = 'http://localhost:8080';
const secure = host.includes('https');

module.exports = function (app) {
    app.use(
        '/api', // <-- or whatever path segment precedes your server side routes
        createProxyMiddleware({
            target: host,
            secure,
            changeOrigin: secure,
        })
    );
    app.use(
        '/api/sock', // <-- or whatever path segment precedes your server side routes
        createProxyMiddleware({
            target: host,
            ws: true,
            secure,
            changeOrigin: secure,
        })
    );
};