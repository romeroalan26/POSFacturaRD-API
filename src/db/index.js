const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Configuración optimizada para un sistema POS
  max: 20, // máximo número de clientes en el pool
  min: 4,  // mínimo número de clientes en el pool
  idleTimeoutMillis: 30000, // tiempo máximo que un cliente puede estar inactivo
  connectionTimeoutMillis: 2000, // tiempo máximo para conectar
  maxUses: 7500, // número máximo de veces que se puede usar una conexión
});

// Eventos del pool
pool.on('connect', () => {
  console.log('Nueva conexión establecida con la base de datos');
});

pool.on('error', (err, client) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

// Función para ejecutar transacciones
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  transaction
};
