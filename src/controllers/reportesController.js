const db = require('../db');

const obtenerVentasDiarias = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT
        TO_CHAR(fecha, 'YYYY-MM-DD') AS dia,
        COUNT(*) AS total_ventas,
        SUM(total)::numeric(10,2) AS total_monto
      FROM ventas
      GROUP BY TO_CHAR(fecha, 'YYYY-MM-DD')
      ORDER BY dia DESC;
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener reporte diario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT
        p.id,
        p.nombre,
        SUM(vp.cantidad) AS total_vendido,
        SUM(vp.cantidad * vp.precio_unitario)::numeric(10,2) AS total_ingresos
      FROM productos p
      JOIN venta_productos vp ON p.id = vp.producto_id
      GROUP BY p.id, p.nombre
      ORDER BY total_vendido DESC;
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const obtenerResumenPorMetodoPago = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT
        metodo_pago,
        COUNT(*) AS total_ventas,
        SUM(total)::numeric(10,2) AS total_monto
      FROM ventas
      GROUP BY metodo_pago
      ORDER BY total_monto DESC;
    `);

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
