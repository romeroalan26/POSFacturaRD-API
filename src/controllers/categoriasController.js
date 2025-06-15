const db = require('../db');

// Función auxiliar para paginación
const getPagination = (req) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const size = parseInt(req.query.size) > 0 ? parseInt(req.query.size) : 10;
    const offset = (page - 1) * size;
    return { page, size, offset };
};

// Validaciones
const validarCategoria = (categoria, esActualizacion = false) => {
    const errores = [];

    // Solo validar nombre si se proporciona o si no es actualización
    if (!esActualizacion || categoria.nombre !== undefined) {
        if (!categoria.nombre || categoria.nombre.trim().length === 0) {
            errores.push('El nombre es obligatorio');
        } else if (categoria.nombre.length > 100) {
            errores.push('El nombre no puede tener más de 100 caracteres');
        }
    }

    return errores;
};

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const { page = 1, size = 10, buscar = '', is_active } = req.query;
        const offset = (page - 1) * size;

        let query = `
            SELECT * FROM categorias
            WHERE 1=1
        `;

        const params = [];
        let paramIndex = 1;

        if (buscar) {
            query += ` AND (nombre ILIKE $${paramIndex} OR descripcion ILIKE $${paramIndex})`;
            params.push(`%${buscar}%`);
            paramIndex++;
        }

        if (is_active !== undefined) {
            query += ` AND is_active = $${paramIndex}`;
            params.push(is_active === 'true' || is_active === true);
            paramIndex++;
        }

        // Obtener total de elementos
        const countQuery = `
            SELECT COUNT(*) 
            FROM categorias
            WHERE 1=1
            ${buscar ? `AND (nombre ILIKE $1 OR descripcion ILIKE $1)` : ''}
            ${is_active !== undefined ? `AND is_active = $${buscar ? '2' : '1'}` : ''}
        `;

        const countParams = [];
        if (buscar) countParams.push(`%${buscar}%`);
        if (is_active !== undefined) countParams.push(is_active === 'true' || is_active === true);

        const countResult = await db.query(countQuery, countParams);
        const totalElements = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalElements / size);

        // Agregar ordenamiento y paginación
        query += ` ORDER BY nombre ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(size, offset);

        const result = await db.query(query, params);

        res.json({
            data: result.rows,
            page: parseInt(page),
            size: parseInt(size),
            totalElements,
            totalPages,
            buscar,
            is_active: is_active !== undefined ? (is_active === 'true' || is_active === true) : null
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ mensaje: 'Error al obtener las categorías' });
    }
};

// Crear categoría
const crearCategoria = async (req, res) => {
    const { nombre, descripcion, is_active } = req.body;

    // Validar campos
    if (!nombre || nombre.trim().length === 0) {
        return res.status(400).json({
            mensaje: 'Error de validación',
            errores: ['El nombre es obligatorio']
        });
    }
    if (nombre.length > 100) {
        return res.status(400).json({
            mensaje: 'Error de validación',
            errores: ['El nombre no puede tener más de 100 caracteres']
        });
    }

    try {
        // Verificar si ya existe una categoría con el mismo nombre
        const categoriaExistente = await db.query(
            'SELECT id FROM categorias WHERE nombre = $1',
            [nombre.trim()]
        );

        if (categoriaExistente.rows.length > 0) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['Ya existe una categoría con este nombre']
            });
        }

        const result = await db.query(
            'INSERT INTO categorias (nombre, descripcion, is_active) VALUES ($1, $2, $3) RETURNING *',
            [nombre.trim(), descripcion || null, is_active !== undefined ? is_active : true]
        );

        res.status(201).json({
            data: result.rows[0],
            mensaje: 'Categoría creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ mensaje: 'Error al crear la categoría' });
    }
};

// Actualizar categoría
const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, is_active } = req.body;

    // Validar ID
    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
            mensaje: 'Error de validación',
            errores: ['ID de categoría inválido']
        });
    }

    // Validar campos
    if (nombre !== undefined) {
        if (!nombre || nombre.trim().length === 0) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['El nombre es obligatorio']
            });
        }
        if (nombre.length > 100) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['El nombre no puede tener más de 100 caracteres']
            });
        }
    }

    try {
        // Verificar si la categoría existe
        const categoriaExistente = await db.query(
            'SELECT id FROM categorias WHERE id = $1',
            [id]
        );

        if (categoriaExistente.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        // Verificar si ya existe otra categoría con el mismo nombre
        if (nombre) {
            const nombreDuplicado = await db.query(
                'SELECT id FROM categorias WHERE nombre = $1 AND id != $2',
                [nombre.trim(), id]
            );

            if (nombreDuplicado.rows.length > 0) {
                return res.status(400).json({
                    mensaje: 'Error de validación',
                    errores: ['Ya existe otra categoría con este nombre']
                });
            }
        }

        // Construir la consulta de actualización dinámicamente
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (nombre !== undefined) {
            updates.push(`nombre = $${paramIndex}`);
            values.push(nombre.trim());
            paramIndex++;
        }

        if (descripcion !== undefined) {
            updates.push(`descripcion = $${paramIndex}`);
            values.push(descripcion);
            paramIndex++;
        }

        if (is_active !== undefined) {
            updates.push(`is_active = $${paramIndex}`);
            values.push(is_active === true || is_active === 'true' || is_active === 1);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['No se proporcionaron campos para actualizar']
            });
        }

        values.push(id);
        const query = `
            UPDATE categorias 
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await db.query(query, values);
        res.json({
            data: result.rows[0],
            mensaje: 'Categoría actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
    }
};

// Eliminar categoría
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la categoría existe
        const categoriaExistente = await db.query(
            'SELECT * FROM categorias WHERE id = $1',
            [id]
        );

        if (categoriaExistente.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        // Verificar si hay productos asociados a esta categoría
        const productosAsociados = await db.query(
            'SELECT COUNT(*) FROM productos WHERE categoria_id = $1',
            [id]
        );

        if (parseInt(productosAsociados.rows[0].count) > 0) {
            return res.status(400).json({
                mensaje: 'No se puede eliminar la categoría porque tiene productos asociados'
            });
        }

        // Eliminar la categoría
        await db.query(
            'DELETE FROM categorias WHERE id = $1',
            [id]
        );

        res.json({ mensaje: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
    }
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}; 