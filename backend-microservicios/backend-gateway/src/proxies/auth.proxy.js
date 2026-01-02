const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: process.env.AUTH_URL,
      changeOrigin: true,
      pathRewrite: { '^/auth': '' },
      logLevel: 'debug',

      onError: (err, req, res) => {
        console.error('❌ Error al conectar con Auth Service:', err.message);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Auth Service no responde' });
        }
      },
    })
  );
};
