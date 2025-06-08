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

const obtenerVentasDiarias = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    // Validar fechas
    const errores = validarFechas(fecha_inicio, fecha_fin);
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Error de validación', errores });
    }

    // Construir la consulta
    let query = `
      SELECT
        TO_CHAR(fecha, 'YYYY-MM-DD') AS dia,
        COUNT(*) AS total_ventas,
        SUM(total)::numeric(10,2) AS total_monto
      FROM ventas
    `;

    const queryParams = [];
    const whereConditions = [];

    if (fecha_inicio) {
      whereConditions.push(`fecha >= $1`);
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
      GROUP BY TO_CHAR(fecha, 'YYYY-MM-DD')
      ORDER BY dia DESC
    `;

    const resultado = await db.query(query, queryParams);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener reporte diario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, limite = 10 } = req.query;

    // Validar fechas
    const errores = validarFechas(fecha_inicio, fecha_fin);
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Error de validación', errores });
    }

    // Validar límite
    const limiteNum = parseInt(limite);
    if (isNaN(limiteNum) || limiteNum <= 0) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['El límite debe ser un número positivo']
      });
    }

    // Construir la consulta
    let query = `
      SELECT
        p.id,
        p.nombre,
        SUM(vp.cantidad) AS total_vendido,
        SUM(vp.cantidad * vp.precio_unitario)::numeric(10,2) AS total_ingresos
      FROM productos p
      JOIN venta_productos vp ON p.id = vp.producto_id
      JOIN ventas v ON vp.venta_id = v.id
    `;

    const queryParams = [];
    const whereConditions = [];

    if (fecha_inicio) {
      whereConditions.push(`v.fecha >= $1`);
      queryParams.push(fecha_inicio);
    }

    if (fecha_fin) {
      whereConditions.push(`v.fecha <= $${queryParams.length + 1}`);
      queryParams.push(fecha_fin);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    query += `
      GROUP BY p.id, p.nombre
      ORDER BY total_vendido DESC
      LIMIT $${queryParams.length + 1}
    `;
    queryParams.push(limiteNum);

    const resultado = await db.query(query, queryParams);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const obtenerResumenPorMetodoPago = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    // Validar fechas
    const errores = validarFechas(fecha_inicio, fecha_fin);
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Error de validación', errores });
    }

    // Construir la consulta
    let query = `
      SELECT
        metodo_pago,
        COUNT(*) AS total_ventas,
        SUM(total)::numeric(10,2) AS total_monto
      FROM ventas
    `;

    const queryParams = [];
    const whereConditions = [];

    if (fecha_inicio) {
      whereConditions.push(`fecha >= $1`);
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
    `;

    const resultado = await db.query(query, queryParams);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener resumen por método de pago:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  obtenerVentasDiarias,
  obtenerProductosMasVendidos,
  obtenerResumenPorMetodoPago,
};
