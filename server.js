require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4100;

// Manejo de errores globales
process.on('uncaughtException', err => {
  console.error('❌ Excepción no atrapada:', err);
});

process.on('unhandledRejection', reason => {
  console.error('❌ Rechazo de promesa no manejado:', reason);
});

// Iniciar servidor Express
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor POS corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Error al iniciar el servidor:', err);
});
