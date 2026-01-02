const app = require('./src/app');
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Auth Service corriendo en http://localhost:${PORT}`);
});
