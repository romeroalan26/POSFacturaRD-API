const { pool } = require('../db');

// Obtener todos los gastos
const obtenerGastos = async (req, res) => {
    try {
        const { page = 1, size = 10, fecha_inicio, fecha_fin, categoria_id } = req.query;
        const offset = (page - 1) * size;

        let query = `
            SELECT g.id, g.monto, g.descripcion, g.categoria_id, g.fecha, g.usuario_id,
                   c.nombre as categoria_nombre,
                   u.nombre as usuario_nombre,
                   u.email as usuario_email
            FROM gastos g
            LEFT JOIN categorias_gastos c ON g.categoria_id = c.id
            LEFT JOIN usuarios u ON g.usuario_id = u.id
        `;

        const queryParams = [];
        const conditions = [];

        if (fecha_inicio) {
            queryParams.push(fecha_inicio);
            conditions.push(`g.fecha::date >= $${queryParams.length}::date`);
        }

        if (fecha_fin) {
            queryParams.push(fecha_fin);
            conditions.push(`g.fecha::date <= $${queryParams.length}::date`);
        }

        if (categoria_id) {
            queryParams.push(categoria_id);
            conditions.push(`g.categoria_id = $${queryParams.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Obtener total de registros
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM gastos g
            ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
        `;
        const { rows: [{ total }] } = await pool.query(countQuery, queryParams);

        // Obtener gastos con paginación
        query += ' ORDER BY g.fecha DESC';
        queryParams.push(size, offset);
        query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
        const { rows: gastos } = await pool.query(query, queryParams);

        // Formatear la respuesta para incluir la información del usuario
        const gastosFormateados = gastos.map(gasto => ({
            ...gasto,
            usuario: gasto.usuario_id ? {
                id: gasto.usuario_id,
                nombre: gasto.usuario_nombre,
                email: gasto.usuario_email
            } : null
        }));

        res.json({
            data: gastosFormateados,
            page: parseInt(page),
            size: parseInt(size),
            totalElements: parseInt(total),
            totalPages: Math.ceil(total / size)
        });

    } catch (error) {
        console.error('Error al obtener gastos:', error);
        res.status(500).json({ mensaje: 'Error al obtener gastos' });
    }
};

// Obtener un gasto específico
const obtenerGasto = async (req, res) => {
    try {
        const { id } = req.params;

        const { rows: [gasto] } = await pool.query(
            `SELECT g.*, c.nombre as categoria_nombre
       FROM gastos g
       LEFT JOIN categorias_gastos c ON g.categoria_id = c.id
       WHERE g.id = $1`,
            [id]
        );

        if (!gasto) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        res.json({
            data: gasto
        });

    } catch (error) {
        console.error('Error al obtener gasto:', error);
        res.status(500).json({
            mensaje: 'Error al obtener gasto',
            error: error.message
        });
    }
};

// Crear nuevo gasto
const crearGasto = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { monto, descripcion, categoria_id, fecha } = req.body;

        // Validar datos requeridos
        if (!monto || !descripcion || !categoria_id) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['Monto, descripción y categoría son requeridos']
            });
        }

        // Validar que la categoría existe
        const { rows: [categoria] } = await client.query(
            'SELECT id FROM categorias_gastos WHERE id = $1',
            [categoria_id]
        );

        if (!categoria) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['Categoría no encontrada']
            });
        }

        // Insertar el gasto con el usuario_id
        const { rows: [gasto] } = await client.query(
            `INSERT INTO gastos (monto, descripcion, categoria_id, fecha, usuario_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [monto, descripcion, categoria_id, fecha || new Date(), req.user.id]
        );

        // Obtener información del usuario
        const { rows: [usuario] } = await client.query(
            'SELECT id, nombre, email FROM usuarios WHERE id = $1',
            [req.user.id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            data: {
                ...gasto,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email
                }
            },
            mensaje: 'Gasto registrado exitosamente'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear gasto:', error);
        res.status(400).json({
            mensaje: 'Error de validación',
            errores: [error.message]
        });
    } finally {
        client.release();
    }
};

// Actualizar un gasto
const actualizarGasto = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { monto, descripcion, categoria_id, fecha } = req.body;

        // Validar datos requeridos
        if (!monto || !descripcion || !categoria_id) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['Monto, descripción y categoría son requeridos']
            });
        }

        // Validar que el gasto existe
        const { rows: [gastoExistente] } = await client.query(
            'SELECT id FROM gastos WHERE id = $1',
            [id]
        );

        if (!gastoExistente) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        // Validar que la categoría existe
        const { rows: [categoria] } = await client.query(
            'SELECT id FROM categorias_gastos WHERE id = $1',
            [categoria_id]
        );

        if (!categoria) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['Categoría no encontrada']
            });
        }

        // Actualizar el gasto
        const { rows: [gasto] } = await client.query(
            `UPDATE gastos 
       SET monto = $1, descripcion = $2, categoria_id = $3, fecha = $4
       WHERE id = $5
       RETURNING *`,
            [monto, descripcion, categoria_id, fecha || new Date(), id]
        );

        await client.query('COMMIT');

        res.json({
            data: gasto,
            mensaje: 'Gasto actualizado exitosamente'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar gasto:', error);
        res.status(400).json({
            mensaje: 'Error de validación',
            errores: [error.message]
        });
    } finally {
        client.release();
    }
};

// Eliminar un gasto
const eliminarGasto = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;

        // Validar que el gasto existe
        const { rows: [gasto] } = await client.query(
            'SELECT id FROM gastos WHERE id = $1',
            [id]
        );

        if (!gasto) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        // Eliminar el gasto
        await client.query('DELETE FROM gastos WHERE id = $1', [id]);

        await client.query('COMMIT');

        res.json({
            mensaje: 'Gasto eliminado exitosamente'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar gasto',
            error: error.message
        });
    } finally {
        client.release();
    }
};

module.exports = {
    obtenerGastos,
    obtenerGasto,
    crearGasto,
    actualizarGasto,
    eliminarGasto
};
