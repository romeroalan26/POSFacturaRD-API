const db = require('../db');

// Validaciones
const validarFechas = (fechaInicio, fechaFin) => {
    const errores = [];
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (fechaInicio && !formatoFecha.test(fechaInicio)) {
        errores.push('Formato de fecha inicio inválido. Use YYYY-MM-DD');
    }

    if (fechaFin && !formatoFecha.test(fechaFin)) {
        errores.push('Formato de fecha fin inválido. Use YYYY-MM-DD');
    }

    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
        errores.push('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    return errores;
};

const getPagination = (req) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const size = parseInt(req.query.size) > 0 ? parseInt(req.query.size) : 10;
    const offset = (page - 1) * size;
    return { page, size, offset };
};

const obtenerVentasDiarias = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const { page, size, offset } = getPagination(req);

        // Validar fechas
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        // Construir la consulta principal
        let query = `
      SELECT
        TO_CHAR(fecha, 'YYYY-MM-DD') AS dia,
        COUNT(*) AS total_ventas,
        SUM(total_final)::numeric(10,2) AS total_monto
      FROM ventas
    `;
        const queryParams = [];
        const whereConditions = [];

        if (fecha_inicio) {
            whereConditions.push(`fecha::date >= $${queryParams.length + 1}::date`);
            queryParams.push(fecha_inicio);
        }
        if (fecha_fin) {
            whereConditions.push(`fecha::date <= $${queryParams.length + 1}::date`);
            queryParams.push(fecha_fin);
        }
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }
        query += `
      GROUP BY TO_CHAR(fecha, 'YYYY-MM-DD')
      ORDER BY dia ASC
      OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}
    `;
        queryParams.push(offset, size);

        // Consulta para contar el total de elementos
        let countQuery = `SELECT COUNT(*) FROM (SELECT 1 FROM ventas`;
        if (whereConditions.length > 0) {
            countQuery += ' WHERE ' + whereConditions.join(' AND ');
        }
        countQuery += ` GROUP BY TO_CHAR(fecha, 'YYYY-MM-DD')) AS sub`;

        const [resultado, countResult] = await Promise.all([
            db.query(query, queryParams),
            db.query(countQuery, queryParams.slice(0, queryParams.length - 2))
        ]);
        const totalElements = parseInt(countResult.rows[0]?.count || 0);
        const totalPages = Math.ceil(totalElements / size);

        // Agregar log para depuración
        console.log('Query params:', queryParams);
        console.log('Resultado:', resultado.rows);

        res.json({
            data: resultado.rows,
            page,
            size,
            totalElements,
            totalPages,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null
        });
    } catch (error) {
        console.error('Error al obtener reporte diario:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerProductosMasVendidos = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, categoria } = req.query;
        const { page, size, offset } = getPagination(req);

        // Validar fechas
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        // Construir la consulta principal
        let query = `
      SELECT
        p.id,
        p.nombre,
        c.nombre as categoria,
        SUM(vp.cantidad) AS total_vendido,
        SUM(v.total_final * (vp.cantidad::float / (
          SELECT SUM(cantidad) 
          FROM venta_productos 
          WHERE venta_id = v.id
        )))::numeric(10,2) AS total_ingresos,
        ROUND(SUM(vp.cantidad * (vp.precio_unitario - vp.precio_compra))::numeric, 2) as ganancia_total,
        ROUND(AVG((vp.precio_unitario - vp.precio_compra))::numeric, 2) as ganancia_unitaria,
        CASE 
          WHEN SUM(vp.cantidad * vp.precio_compra) > 0 
          THEN ROUND((SUM(vp.cantidad * (vp.precio_unitario - vp.precio_compra)) / SUM(vp.cantidad * vp.precio_compra) * 100)::numeric, 2)
          ELSE 0
        END as margen_ganancia,
        COUNT(DISTINCT v.id) as total_ventas
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      JOIN venta_productos vp ON p.id = vp.producto_id
      JOIN ventas v ON vp.venta_id = v.id
    `;
        const queryParams = [];
        const whereConditions = [];

        if (fecha_inicio) {
            whereConditions.push(`v.fecha >= $${queryParams.length + 1}`);
            queryParams.push(fecha_inicio);
        }
        if (fecha_fin) {
            whereConditions.push(`v.fecha <= $${queryParams.length + 1}`);
            queryParams.push(fecha_fin);
        }
        if (categoria) {
            whereConditions.push(`c.nombre = $${queryParams.length + 1}`);
            queryParams.push(categoria);
        }
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }
        query += `
      GROUP BY p.id, p.nombre, c.nombre
      ORDER BY total_vendido DESC
      OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}
    `;
        queryParams.push(offset, size);

        // Consulta para contar el total de elementos
        let countQuery = `
      SELECT COUNT(*) FROM (
        SELECT 1 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        JOIN venta_productos vp ON p.id = vp.producto_id
        JOIN ventas v ON vp.venta_id = v.id
    `;
        if (whereConditions.length > 0) {
            countQuery += ' WHERE ' + whereConditions.join(' AND ');
        }
        countQuery += ` GROUP BY p.id, p.nombre, c.nombre) AS sub`;

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
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            categoria: categoria || null
        });
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerResumenPorMetodoPago = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const { page, size, offset } = getPagination(req);

        // Validar fechas
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        // Consulta principal
        let query = `
      SELECT
        metodo_pago,
        COUNT(*) AS total_ventas,
        SUM(total_final)::numeric(10,2) AS total_monto,
        AVG(total_final)::numeric(10,2) AS promedio_venta,
        MIN(total_final)::numeric(10,2) AS venta_minima,
        MAX(total_final)::numeric(10,2) AS venta_maxima
      FROM ventas
    `;
        const queryParams = [];
        const whereConditions = [];

        if (fecha_inicio) {
            whereConditions.push(`fecha >= $${queryParams.length + 1}`);
            queryParams.push(fecha_inicio);
        }
        if (fecha_fin) {
            whereConditions.push(`fecha <= $${queryParams.length + 1}`);
            queryParams.push(fecha_fin);
        }
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }
        query += `
      GROUP BY metodo_pago
      ORDER BY total_monto DESC
      OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}
    `;
        queryParams.push(offset, size);

        // Consulta para contar el total de elementos
        let countQuery = `SELECT COUNT(*) FROM (SELECT 1 FROM ventas`;
        if (whereConditions.length > 0) {
            countQuery += ' WHERE ' + whereConditions.join(' AND ');
        }
        countQuery += ` GROUP BY metodo_pago) AS sub`;

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
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null
        });
    } catch (error) {
        console.error('Error al obtener resumen por método de pago:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerResumenGeneral = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        let query = `
      SELECT
        COUNT(*) as total_ventas,
        SUM(total_final)::numeric(10,2) as total_ingresos,
        AVG(total_final)::numeric(10,2) as promedio_venta,
        COUNT(DISTINCT DATE(fecha)) as dias_con_ventas,
        (
          SELECT COALESCE(SUM(vp.cantidad), 0)
          FROM venta_productos vp 
          JOIN ventas v ON vp.venta_id = v.id
          WHERE ($1::date IS NULL OR v.fecha::date >= $1::date)
          AND ($2::date IS NULL OR v.fecha::date <= $2::date)
        ) as total_productos_vendidos,
        (
          SELECT COALESCE(SUM((vp.precio_unitario - vp.precio_compra) * vp.cantidad), 0)::numeric(10,2)
          FROM venta_productos vp 
          JOIN ventas v ON vp.venta_id = v.id
          WHERE ($1::date IS NULL OR v.fecha::date >= $1::date)
          AND ($2::date IS NULL OR v.fecha::date <= $2::date)
        ) as ganancia_total,
        (
          SELECT COALESCE(SUM(monto), 0)::numeric(10,2)
          FROM gastos
          WHERE ($1::date IS NULL OR fecha::date >= $1::date)
          AND ($2::date IS NULL OR fecha::date <= $2::date)
        ) as total_gastos
      FROM ventas
      WHERE ($1::date IS NULL OR fecha::date >= $1::date)
      AND ($2::date IS NULL OR fecha::date <= $2::date)
    `;

        const resultado = await db.query(query, [fecha_inicio, fecha_fin]);

        res.json({
            data: resultado.rows[0],
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null
        });
    } catch (error) {
        console.error('Error al obtener resumen general:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerVentasPorHora = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        let query = `
      SELECT
        EXTRACT(HOUR FROM fecha) as hora,
        COUNT(*) as total_ventas,
        SUM(total_final)::numeric(10,2) as total_monto
      FROM ventas
      WHERE ($1::date IS NULL OR fecha >= $1)
      AND ($2::date IS NULL OR fecha <= $2)
      GROUP BY EXTRACT(HOUR FROM fecha)
      ORDER BY hora
    `;

        const resultado = await db.query(query, [fecha_inicio, fecha_fin]);

        res.json({
            data: resultado.rows,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null
        });
    } catch (error) {
        console.error('Error al obtener ventas por hora:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerTendenciaVentas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, intervalo = 'dia' } = req.query;
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        let formatoFecha;
        switch (intervalo) {
            case 'hora':
                formatoFecha = 'YYYY-MM-DD HH24:00';
                break;
            case 'semana':
                formatoFecha = 'IYYY-IW';
                break;
            case 'mes':
                formatoFecha = 'YYYY-MM';
                break;
            default:
                formatoFecha = 'YYYY-MM-DD';
        }

        let query = `
      SELECT
        TO_CHAR(fecha, $3) as periodo,
        COUNT(*) as total_ventas,
        SUM(total_final)::numeric(10,2) as total_monto,
        AVG(total_final)::numeric(10,2) as promedio_venta
      FROM ventas
      WHERE ($1::date IS NULL OR fecha >= $1)
      AND ($2::date IS NULL OR fecha <= $2)
      GROUP BY TO_CHAR(fecha, $3)
      ORDER BY periodo
    `;

        const resultado = await db.query(query, [fecha_inicio, fecha_fin, formatoFecha]);

        res.json({
            data: resultado.rows,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            intervalo
        });
    } catch (error) {
        console.error('Error al obtener tendencia de ventas:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerProductosBajoStock = async (req, res) => {
    try {
        const { page, size, offset } = getPagination(req);

        let query = `
      SELECT
        p.id,
        p.nombre,
        p.stock,
        p.stock_minimo,
        p.precio,
        p.precio_compra,
        c.nombre as categoria,
        COALESCE(SUM(vp.cantidad), 0) as total_vendido_mes,
        (p.stock_minimo - p.stock) as diferencia_stock
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN venta_productos vp ON p.id = vp.producto_id
      LEFT JOIN ventas v ON vp.venta_id = v.id
        AND v.fecha >= CURRENT_DATE - INTERVAL '30 days'
      WHERE p.stock <= p.stock_minimo
      GROUP BY p.id, p.nombre, p.stock, p.stock_minimo, p.precio, p.precio_compra, c.nombre
      ORDER BY diferencia_stock DESC, p.stock ASC
      OFFSET $1 LIMIT $2
    `;

        // Consulta para contar el total de elementos
        const countQuery = `
      SELECT COUNT(*) 
      FROM productos 
      WHERE stock <= stock_minimo
    `;

        const [resultado, countResult] = await Promise.all([
            db.query(query, [offset, size]),
            db.query(countQuery)
        ]);

        const totalElements = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalElements / size);

        res.json({
            data: resultado.rows,
            page,
            size,
            totalElements,
            totalPages
        });
    } catch (error) {
        console.error('Error al obtener productos con bajo stock:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerReporteGanancias = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, producto_id } = req.query;
        const { page, size, offset } = getPagination(req);

        // Validar fechas
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        // Construir la consulta principal
        let query = `
      SELECT 
        p.id as producto_id,
        p.nombre as nombre_producto,
        c.nombre as categoria,
        SUM(vp.cantidad) as cantidad_vendida,
        ROUND(p.precio_compra::numeric, 2) as precio_compra,
        ROUND(AVG(vp.precio_unitario)::numeric, 2) as precio_venta,
        ROUND((AVG(vp.precio_unitario) - p.precio_compra)::numeric, 2) as ganancia_unitaria,
        ROUND(SUM(vp.cantidad * (vp.precio_unitario - p.precio_compra))::numeric, 2) as ganancia_total
      FROM venta_productos vp
      JOIN productos p ON p.id = vp.producto_id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      JOIN ventas v ON v.id = vp.venta_id
    `;
        const queryParams = [];
        const whereConditions = [];

        if (fecha_inicio) {
            whereConditions.push(`v.fecha::date >= $${queryParams.length + 1}::date`);
            queryParams.push(fecha_inicio);
        }
        if (fecha_fin) {
            whereConditions.push(`v.fecha::date <= $${queryParams.length + 1}::date`);
            queryParams.push(fecha_fin);
        }
        if (producto_id) {
            whereConditions.push(`p.id = $${queryParams.length + 1}`);
            queryParams.push(producto_id);
        }
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }
        query += `
      GROUP BY p.id, p.nombre, c.nombre
      ORDER BY ganancia_total DESC
      OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}
    `;
        queryParams.push(offset, size);

        // Consulta para el resumen total
        let resumenQuery = `
      SELECT 
        SUM(vp.cantidad) as total_productos_vendidos,
        ROUND(SUM(vp.cantidad * vp.precio_unitario)::numeric, 2) as total_ventas,
        ROUND(SUM(vp.cantidad * p.precio_compra)::numeric, 2) as total_costos,
        ROUND(SUM(vp.cantidad * (vp.precio_unitario - p.precio_compra))::numeric, 2) as total_ganancias,
        CASE 
          WHEN SUM(vp.cantidad * p.precio_compra) > 0 
          THEN ROUND((SUM(vp.cantidad * (vp.precio_unitario - p.precio_compra)) / SUM(vp.cantidad * p.precio_compra) * 100)::numeric, 2)
          ELSE 0
        END as margen_promedio
      FROM venta_productos vp
      JOIN productos p ON p.id = vp.producto_id
      JOIN ventas v ON v.id = vp.venta_id
    `;
        if (whereConditions.length > 0) {
            resumenQuery += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Consulta para contar el total de elementos
        let countQuery = `
      SELECT COUNT(*) FROM (
        SELECT 1 
        FROM venta_productos vp
        JOIN productos p ON p.id = vp.producto_id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        JOIN ventas v ON v.id = vp.venta_id
    `;
        if (whereConditions.length > 0) {
            countQuery += ' WHERE ' + whereConditions.join(' AND ');
        }
        countQuery += ` GROUP BY p.id, p.nombre, c.nombre) AS sub`;

        const [resultado, resumenResult, countResult] = await Promise.all([
            db.query(query, queryParams),
            db.query(resumenQuery, queryParams.slice(0, queryParams.length - 2)),
            db.query(countQuery, queryParams.slice(0, queryParams.length - 2))
        ]);

        const totalElements = parseInt(countResult.rows[0]?.count || 0);
        const totalPages = Math.ceil(totalElements / size);

        res.json({
            data: resultado.rows,
            resumen: resumenResult.rows[0],
            page,
            size,
            totalElements,
            totalPages,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            producto_id: producto_id || null
        });
    } catch (error) {
        console.error('Error al obtener reporte de ganancias:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerVentasPorCategoria = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const { page, size, offset } = getPagination(req);

        // Validar fechas
        const errores = validarFechas(fecha_inicio, fecha_fin);
        if (errores.length > 0) {
            return res.status(400).json({ mensaje: 'Error de validación', errores });
        }

        // Construir la consulta principal
        let query = `
            SELECT 
                c.id as categoria_id,
                c.nombre as categoria,
                COUNT(DISTINCT v.id) as total_ventas,
                SUM(vp.cantidad) as total_productos_vendidos,
                SUM(vp.cantidad * vp.precio_unitario)::numeric(10,2) as total_ingresos,
                ROUND(AVG(vp.precio_unitario)::numeric, 2) as precio_promedio,
                ROUND(SUM(vp.cantidad * (vp.precio_unitario - p.precio_compra))::numeric, 2) as ganancia_total,
                ROUND((SUM(vp.cantidad * (vp.precio_unitario - p.precio_compra)) / 
                    NULLIF(SUM(vp.cantidad * p.precio_compra), 0) * 100)::numeric, 2) as margen_ganancia
            FROM categorias c
            LEFT JOIN productos p ON p.categoria_id = c.id
            LEFT JOIN venta_productos vp ON vp.producto_id = p.id
            LEFT JOIN ventas v ON v.id = vp.venta_id
        `;

        const queryParams = [];
        const whereConditions = [];

        if (fecha_inicio) {
            whereConditions.push(`v.fecha::date >= $${queryParams.length + 1}::date`);
            queryParams.push(fecha_inicio);
        }
        if (fecha_fin) {
            whereConditions.push(`v.fecha::date <= $${queryParams.length + 1}::date`);
            queryParams.push(fecha_fin);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        query += `
            GROUP BY c.id, c.nombre
            HAVING COUNT(DISTINCT v.id) > 0
            ORDER BY total_ingresos DESC
            OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}
        `;
        queryParams.push(offset, size);

        // Consulta para contar el total de elementos
        let countQuery = `
            SELECT COUNT(*) FROM (
                SELECT c.id
                FROM categorias c
                LEFT JOIN productos p ON p.categoria_id = c.id
                LEFT JOIN venta_productos vp ON vp.producto_id = p.id
                LEFT JOIN ventas v ON v.id = vp.venta_id
                ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
                GROUP BY c.id
                HAVING COUNT(DISTINCT v.id) > 0
            ) AS sub
        `;

        const [resultado, countResult] = await Promise.all([
            db.query(query, queryParams),
            db.query(countQuery, queryParams.slice(0, queryParams.length - 2))
        ]);

        const totalElements = parseInt(countResult.rows[0]?.count || 0);
        const totalPages = Math.ceil(totalElements / size);

        res.json({
            data: resultado.rows,
            page: parseInt(page),
            size: parseInt(size),
            totalElements,
            totalPages,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null
        });

    } catch (error) {
        console.error('Error al obtener ventas por categoría:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

module.exports = {
    obtenerVentasDiarias,
    obtenerProductosMasVendidos,
    obtenerResumenPorMetodoPago,
    obtenerResumenGeneral,
    obtenerVentasPorHora,
    obtenerTendenciaVentas,
    obtenerProductosBajoStock,
    obtenerReporteGanancias,
    obtenerVentasPorCategoria
};
