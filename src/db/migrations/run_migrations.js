const db = require('../index');

async function runMigration() {
    try {
        const migration = `
      ALTER TABLE ventas
      ADD COLUMN IF NOT EXISTS subtotal numeric(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS itbis_total numeric(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_final numeric(10,2) DEFAULT 0;
    `;

        await db.query(migration);
        console.log('Migración ejecutada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al ejecutar la migración:', error);
        process.exit(1);
    }
}

runMigration(); 