const db = require('./index');

async function checkLastSale() {
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
            'precio_unitario', vp.precio_unitario
          )
        ) as productos
      FROM ventas v
      LEFT JOIN venta_productos vp ON v.id = vp.venta_id
      GROUP BY v.id
      ORDER BY v.id DESC 
      LIMIT 1;
    `;

        const result = await db.query(query);
        console.log('Última venta registrada:', JSON.stringify(result.rows[0], null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error al consultar la venta:', error);
        process.exit(1);
    }
}

checkLastSale(); 