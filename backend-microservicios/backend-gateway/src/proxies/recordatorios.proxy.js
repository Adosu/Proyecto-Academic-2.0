const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/recordatorios',
    createProxyMiddleware({
      target: process.env.RECORDATORIOS_URL,
      changeOrigin: true,
      pathRewrite: { '^/recordatorios': '' },
      logLevel: 'debug',

      onError: (err, req, res) => {
        console.error('❌ Error al conectar con Recordatorios Service:', err.message);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Recordatorios Service no responde' });
        }
      },
    })
  );
};
