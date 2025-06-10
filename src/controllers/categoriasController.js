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

// Obtener categorías
const obtenerCategorias = async (req, res) => {
    try {
        const { buscar } = req.query;
        const { page, size, offset } = getPagination(req);

        // Construir la consulta base
        let query = 'SELECT * FROM categorias';
        const queryParams = [];
        const whereConditions = [];

        // Agregar filtros si existen
        if (buscar) {
            whereConditions.push(`nombre ILIKE $${queryParams.length + 1}`);
            queryParams.push(`%${buscar}%`);
        }

        // Agregar condiciones WHERE si existen
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Agregar ordenamiento y paginación
        query += ' ORDER BY id';
        query += ` OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}`;
        queryParams.push(offset, size);

        // Consulta para contar el total de elementos
        let countQuery = 'SELECT COUNT(*) FROM categorias';
        if (whereConditions.length > 0) {
            countQuery += ' WHERE ' + whereConditions.join(' AND ');
        }

        const [resultado, countResult] = await Promise.all([
            db.query(query, queryParams),
            db.query(countQuery, queryParams.slice(0, queryParams.length - 2))
        ]);

        const totalElements = parseInt(countResult.rows[0]?.count || 0);
        const totalPages = Math.ceil(totalElements / size);

        res.json({
            data: resultado.rows,
            page,
            size,
            totalElements,
            totalPages,
            buscar: buscar || null
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

// Crear categoría
const crearCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;

    // Validar campos obligatorios
    const errores = validarCategoria({ nombre });
    if (errores.length > 0) {
        return res.status(400).json({ mensaje: 'Error de validación', errores });
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

        const query = `
      INSERT INTO categorias (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING *;
    `;

        const values = [
            nombre.trim(),
            descripcion || null
        ];

        const resultado = await db.query(query, values);
        res.status(201).json({
            data: resultado.rows[0],
            mensaje: 'Categoría creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

// Actualizar categoría
const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

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
            const nombreExistente = await db.query(
                'SELECT id FROM categorias WHERE nombre = $1 AND id != $2',
                [nombre.trim(), id]
            );

            if (nombreExistente.rows.length > 0) {
                return res.status(400).json({
                    mensaje: 'Error de validación',
                    errores: ['Ya existe otra categoría con este nombre']
                });
            }
        }

        // Construir la consulta de actualización
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

        if (updates.length === 0) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['No se proporcionaron campos para actualizar']
            });
        }

        values.push(id);
        const query = `
      UPDATE categorias
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

        const resultado = await db.query(query, values);
        res.json({
            data: resultado.rows[0],
            mensaje: 'Categoría actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

// Eliminar categoría
const eliminarCategoria = async (req, res) => {
    const { id } = req.params;

    // Validar ID
    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
            mensaje: 'Error de validación',
            errores: ['ID de categoría inválido']
        });
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

        // Verificar si la categoría está asociada a productos
        const productosAsociados = await db.query(
            'SELECT COUNT(*) FROM productos WHERE categoria_id = $1',
            [id]
        );

        if (parseInt(productosAsociados.rows[0].count) > 0) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: ['No se puede eliminar la categoría porque tiene productos asociados']
            });
        }

        const resultado = await db.query(
            'DELETE FROM categorias WHERE id = $1 RETURNING *',
            [id]
        );

        res.json({
            data: resultado.rows[0],
            mensaje: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}; 