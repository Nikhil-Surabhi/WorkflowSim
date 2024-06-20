const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (app) => {
    app.use(
        '/oauth',
        createProxyMiddleware({
            target: 'https://github.com/login',
            changeOrigin: true,
        })
    );
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:9229',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        })
    );

    app.use(
        '/socket.io',
        createProxyMiddleware({
            target: 'http://localhost:9229',
            changeOrigin: true
        })
    );
}
