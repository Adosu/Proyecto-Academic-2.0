const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/apuntes',
    createProxyMiddleware({
      target: process.env.APUNTES_URL,
      changeOrigin: true,
      pathRewrite: { '^/apuntes': '' },
      logLevel: 'debug',

      onError: (err, req, res) => {
        console.error('❌ Error al conectar con Apuntes Service:', err.message);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Apuntes Service no responde' });
        }
      },
    })
  );
};
