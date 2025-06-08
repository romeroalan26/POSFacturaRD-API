const fs = require('fs');
const path = require('path');
const { pool } = require('./index');

async function runMigrations() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Leer y ejecutar la migración de roles
        const rolesMigration = fs.readFileSync(
            path.join(__dirname, 'migrations', 'create_roles_table.sql'),
            'utf8'
        );

        await client.query(rolesMigration);

        await client.query('COMMIT');
        console.log('Migraciones ejecutadas exitosamente');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al ejecutar migraciones:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Ejecutar migraciones si este archivo se ejecuta directamente
if (require.main === module) {
    runMigrations()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = runMigrations; 