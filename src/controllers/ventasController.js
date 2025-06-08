const db = require('../db');

const registrarVenta = async (req, res) => {
  const { productos, metodo_pago } = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Debe enviar al menos un producto' });
  }

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const total = productos.reduce((sum, p) => sum + p.precio_unitario * p.cantidad, 0);

    const ventaRes = await client.query(
      'INSERT INTO ventas (total, metodo_pago) VALUES ($1, $2) RETURNING id',
      [total, metodo_pago]
    );

    const ventaId = ventaRes.rows[0].id;

    for (const prod of productos) {
      await client.query(
        'INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [ventaId, prod.producto_id, prod.cantidad, prod.precio_unitario]
      );

      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [prod.cantidad, prod.producto_id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ mensaje: 'Venta registrada', venta_id: ventaId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar venta:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  } finally {
    client.release();
  }
};

const obtenerVentas = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT v.id, v.fecha, v.total, v.metodo_pago,
        json_agg(
          json_build_object(
            'producto_id', vp.producto_id,
            'cantidad', vp.cantidad,
            'precio_unitario', vp.precio_unitario
          )
        ) AS productos
      FROM ventas v
      LEFT JOIN venta_productos vp ON v.id = vp.venta_id
      GROUP BY v.id
      ORDER BY v.fecha DESC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  registrarVenta,
  obtenerVentas,
};
