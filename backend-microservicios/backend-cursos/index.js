const app = require('./src/app');
const { PORT = 3002 } = process.env;

app.listen(PORT, () => {
  console.log(`📘 Cursos Service corriendo en http://localhost:${PORT}`);
});
