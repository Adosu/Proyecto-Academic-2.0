const app = require('./src/app');
const { PORT = 3004 } = process.env;

app.listen(PORT, () => {
  console.log(`🗓️ Recordatorios Service corriendo en http://localhost:${PORT}`);
});
