const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/cursos',
    createProxyMiddleware({
      target: process.env.CURSOS_URL,
      changeOrigin: true,
      pathRewrite: { '^/cursos': '' },
      logLevel: 'debug',

      onError: (err, req, res) => {
        console.error('❌ Error al conectar con Cursos Service:', err.message);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Cursos Service no responde' });
        }
      },
    })
  );
};
