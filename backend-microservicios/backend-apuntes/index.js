const app = require('./src/app');
const { PORT = 3003 } = process.env;

app.listen(PORT, () => {
  console.log(`📝 Apuntes Service corriendo en http://localhost:${PORT}`);
});
