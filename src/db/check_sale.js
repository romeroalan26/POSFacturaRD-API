const db = require('./index');

async function checkSale() {
    try {
        const query = `
      SELECT 
        v.id,
        v.subtotal,
        v.itbis_total,
        v.total_final,
        v.metodo_pago,
        v.fecha,
        json_agg(
          json_build_object(
            'producto_id', vp.producto_id,
            'cantidad', vp.cantidad,
            'precio_unitario', vp.precio_unitario,
            'subtotal_producto', vp.cantidad * vp.precio_unitario
          )
        ) as productos
      FROM ventas v
      LEFT JOIN venta_productos vp ON v.id = vp.venta_id
      WHERE v.id = 9
      GROUP BY v.id
    `;

        const result = await db.pool.query(query);
        console.log('Detalles de la venta:');
        console.log(JSON.stringify(result.rows[0], null, 2));
    } catch (error) {
        console.error('Error al consultar la venta:', error);
    } finally {
        process.exit();
    }
}

checkSale(); 