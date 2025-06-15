const { pool } = require('../db');
const PDFDocument = require('pdfkit');

// Obtener todos los gastos
const obtenerGastos = async (req, res) => {
    try {
        const { page = 1, size = 10, fecha_inicio, fecha_fin, categoria_id, descripcion } = req.query;
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

        if (descripcion) {
            queryParams.push(`%${descripcion}%`);
            conditions.push(`g.descripcion ILIKE $${queryParams.length}`);
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

const exportarGastos = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, categoria_id } = req.query;

        let query = `
      SELECT 
        g.id,
        g.fecha,
        g.monto,
        g.descripcion,
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

        query += ' ORDER BY g.fecha DESC';

        const { rows: gastos } = await pool.query(query, queryParams);

        // Función para formatear fecha a 'DD-MM-YYYY hh:mm:ss AM/PM'
        function formatearFecha(fecha) {
            if (!fecha) return '';
            const d = new Date(fecha);
            const pad = n => n.toString().padStart(2, '0');
            let hours = d.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(hours)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
        }

        // Crear el contenido CSV
        const headers = [
            'ID',
            'Fecha',
            'Monto',
            'Descripción',
            'Categoría',
            'Usuario'
        ];

        const rows = gastos.map(gasto => [
            gasto.id,
            formatearFecha(gasto.fecha),
            gasto.monto,
            gasto.descripcion,
            gasto.categoria_nombre,
            gasto.usuario_nombre
        ]);

        // Agregar BOM para Excel y configurar codificación UTF-8
        const BOM = '\uFEFF';
        const csvContent = BOM + [
            headers.join(','),
            ...rows.map(row => row.map(cell => {
                // Escapar comillas dobles y asegurar que el valor esté entre comillas
                const escapedCell = String(cell).replace(/"/g, '""');
                return `"${escapedCell}"`;
            }).join(','))
        ].join('\n');

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=gastos.csv');

        res.send(csvContent);

    } catch (error) {
        console.error('Error al exportar gastos:', error);
        res.status(500).json({
            mensaje: 'Error al exportar gastos',
            error: error.message
        });
    }
};

const exportarGastosPDF = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, categoria_id } = req.query;

        let query = `
      SELECT 
        g.id,
        g.fecha,
        g.monto,
        g.descripcion,
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

        query += ' ORDER BY g.fecha DESC';

        const { rows: gastos } = await pool.query(query, queryParams);

        // Crear el documento PDF
        const doc = new PDFDocument();

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=gastos.pdf');

        // Pipe el PDF directamente a la respuesta
        doc.pipe(res);

        // Función para formatear fecha
        function formatearFecha(fecha) {
            if (!fecha) return '';
            const d = new Date(fecha);
            const pad = n => n.toString().padStart(2, '0');
            let hours = d.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(hours)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
        }

        // Título del reporte
        doc.fontSize(20).text('Reporte de Gastos', { align: 'center' });
        doc.moveDown();

        // Información del período
        if (fecha_inicio || fecha_fin) {
            doc.fontSize(12).text('Período:', { continued: true });
            doc.text(` ${fecha_inicio || 'Inicio'} - ${fecha_fin || 'Fin'}`, { align: 'left' });
            doc.moveDown();
        }

        // Resumen al inicio
        doc.fontSize(12).text('Resumen:', { underline: true });
        doc.moveDown();
        doc.fontSize(10);
        const totalGastos = gastos.length;
        const totalMonto = gastos.reduce((sum, g) => sum + Number(g.monto), 0);
        doc.text(`Total de Gastos: ${totalGastos}`);
        doc.text(`Total de Monto: RD$ ${totalMonto.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        doc.moveDown(2);

        // Tabla de gastos
        let y = doc.y;
        const margin = 50;
        const rowHeight = 20;
        const columns = [
            { header: 'ID', width: 50 },
            { header: 'Fecha', width: 150 },
            { header: 'Monto', width: 100 },
            { header: 'Categoría', width: 150 },
            { header: 'Usuario', width: 150 }
        ];

        // Dibujar encabezados
        doc.fontSize(10);
        let x = margin;
        columns.forEach(column => {
            doc.text(column.header, x, y, { width: column.width });
            x += column.width;
        });

        // Dibujar líneas de gastos
        y += rowHeight;
        gastos.forEach(gasto => {
            if (y > 700) { // Nueva página si se alcanza el final
                doc.addPage();
                y = 50;
            }

            x = margin;
            doc.text(gasto.id.toString(), x, y, { width: columns[0].width });
            x += columns[0].width;
            doc.text(formatearFecha(gasto.fecha), x, y, { width: columns[1].width });
            x += columns[1].width;
            doc.text(Number(gasto.monto).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), x, y, { width: columns[2].width });
            x += columns[2].width;
            doc.text(gasto.categoria_nombre || '', x, y, { width: columns[3].width });
            x += columns[3].width;
            doc.text(gasto.usuario_nombre || '', x, y, { width: columns[4].width });

            y += rowHeight;
        });

        // Finalizar el documento
        doc.end();

    } catch (error) {
        console.error('Error al exportar gastos a PDF:', error);
        // Si el stream ya está cerrado, no intentar enviar respuesta
        if (!res.headersSent) {
            res.status(500).json({
                mensaje: 'Error al exportar gastos a PDF',
                error: error.message
            });
        }
    }
};

module.exports = {
    obtenerGastos,
    obtenerGasto,
    crearGasto,
    actualizarGasto,
    eliminarGasto,
    exportarGastos,
    exportarGastosPDF
};
