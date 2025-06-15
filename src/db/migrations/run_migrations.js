const fs = require('fs');
const path = require('path');
const db = require('../index');

async function runMigrations() {
    try {
        // Leer y ejecutar la migración de actualización de permisos
        const migrationPath = path.join(__dirname, 'update_roles_permissions.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        await db.query(migrationSQL);
        console.log('Migración de permisos ejecutada exitosamente');

        process.exit(0);
    } catch (error) {
        console.error('Error al ejecutar migraciones:', error);
        process.exit(1);
    }
}

runMigrations(); 