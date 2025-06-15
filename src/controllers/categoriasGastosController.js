const db = require('../db');
const { validationResult } = require('express-validator');

// Validar datos de la categoría
const validarCategoria = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const { page = 1, size = 10, buscar = '', is_active } = req.query;
        const offset = (page - 1) * size;

        let query = `
            SELECT * FROM categorias_gastos
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
            FROM categorias_gastos
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

// Obtener una categoría específica
const obtenerCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM categorias_gastos WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({ mensaje: 'Error al obtener la categoría' });
    }
};

// Crear nueva categoría
const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const result = await db.query(
            'INSERT INTO categorias_gastos (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre, descripcion]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ mensaje: 'Error al crear la categoría' });
    }
};

// Actualizar una categoría
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, is_active } = req.body;

        const result = await db.query(
            'UPDATE categorias_gastos SET nombre = $1, descripcion = $2, is_active = $3 WHERE id = $4 RETURNING *',
            [nombre, descripcion, is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
    }
};

// Eliminar una categoría
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay gastos asociados
        const gastosResult = await db.query('SELECT COUNT(*) FROM gastos WHERE categoria_id = $1', [id]);
        if (parseInt(gastosResult.rows[0].count) > 0) {
            return res.status(400).json({
                mensaje: 'No se puede eliminar la categoría porque tiene gastos asociados'
            });
        }

        const result = await db.query('DELETE FROM categorias_gastos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
    }
};

module.exports = {
    validarCategoria,
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}; 