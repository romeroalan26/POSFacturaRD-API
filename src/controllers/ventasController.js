const db = require('../db');
require('dotenv').config();

// Validaciones
const validarVenta = (venta) => {
  const errores = [];
  const metodosPagoValidos = ['efectivo', 'tarjeta', 'transferencia'];

  if (!Array.isArray(venta.productos) || venta.productos.length === 0) {
    errores.push('Debe enviar al menos un producto');
    return errores;
  }

  if (!venta.metodo_pago) {
    errores.push('El método de pago es obligatorio');
  } else if (!metodosPagoValidos.includes(venta.metodo_pago.toLowerCase())) {
    errores.push(`Método de pago inválido. Debe ser uno de: ${metodosPagoValidos.join(', ')}`);
  }

  for (const [index, producto] of venta.productos.entries()) {
    if (!producto.producto_id) {
      errores.push(`El producto ${index + 1} no tiene ID`);
    }
    if (!producto.cantidad || producto.cantidad <= 0) {
      errores.push(`La cantidad del producto ${index + 1} debe ser mayor a 0`);
    }
    if (!producto.precio_unitario || producto.precio_unitario <= 0) {
      errores.push(`El precio unitario del producto ${index + 1} debe ser mayor a 0`);
    }
  }

  return errores;
};

const getPagination = (req) => {
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const size = parseInt(req.query.size) > 0 ? parseInt(req.query.size) : 10;
  const offset = (page - 1) * size;
  return { page, size, offset };
};

const registrarVenta = async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const { productos, metodo_pago } = req.body;

    // Validar que el método de pago sea válido
    if (!['efectivo', 'tarjeta', 'transferencia'].includes(metodo_pago)) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['Método de pago inválido']
      });
    }

    // Validar que haya productos
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['Debe incluir al menos un producto']
      });
    }

    // Obtener información de productos y validar stock
    const productosInfo = [];
    let subtotal = 0;
    let itbis_total = 0;

    for (const item of productos) {
      const { rows: [producto] } = await client.query(
        'SELECT id, nombre, precio, precio_compra, stock, con_itbis FROM productos WHERE id = $1',
        [item.producto_id]
      );

      if (!producto) {
        throw new Error(`Producto no encontrado: ${item.producto_id}`);
      }

      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto: ${producto.nombre}`);
      }

      const precio_total = producto.precio * item.cantidad;
      const itbis_producto = producto.con_itbis ? (precio_total * 0.18) : 0;

      productosInfo.push({
        ...producto,
        cantidad: item.cantidad,
        precio_total,
        itbis_producto
      });

      subtotal += precio_total;
      itbis_total += itbis_producto;
    }

    const total_final = subtotal + itbis_total;

    // Insertar la venta
    const { rows: [venta] } = await client.query(
      `INSERT INTO ventas (total, metodo_pago, subtotal, itbis_total, total_final, usuario_id, fecha)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP AT TIME ZONE 'America/Santo_Domingo')
       RETURNING id, fecha, total, metodo_pago, subtotal, itbis_total, total_final, usuario_id`,
      [total_final, metodo_pago, subtotal, itbis_total, total_final, req.user.id]
    );

    // Insertar productos de la venta y actualizar stock
    const ventaProductos = [];
    let ganancia_total_venta = 0;

    for (const item of productosInfo) {
      // Insertar en venta_productos con el precio_compra del producto
      const { rows: [ventaProducto] } = await client.query(
        `INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario, precio_compra)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING venta_id, producto_id, cantidad, precio_unitario, precio_compra`,
        [venta.id, item.id, item.cantidad, item.precio, item.precio_compra]
      );

      // Calcular ganancias
      const ganancia_unitaria = item.precio - item.precio_compra;
      const ganancia_total = ganancia_unitaria * item.cantidad;
      const margen_ganancia = (ganancia_unitaria / item.precio_compra) * 100;

      ventaProductos.push({
        ...ventaProducto,
        ganancia_unitaria,
        ganancia_total,
        margen_ganancia
      });

      ganancia_total_venta += ganancia_total;

      // Actualizar stock
      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [item.cantidad, item.id]
      );
    }

    // Calcular margen promedio
    const margen_promedio = ventaProductos.reduce((acc, curr) => acc + curr.margen_ganancia, 0) / ventaProductos.length;

    // Obtener información del usuario
    const { rows: [usuario] } = await client.query(
      'SELECT id, nombre, email FROM usuarios WHERE id = $1',
      [req.user.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      data: {
        ...venta,
        productos: ventaProductos,
        ganancia_total_venta,
        margen_promedio,
        usuario
      },
      mensaje: 'Venta registrada exitosamente'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar venta:', error);
    res.status(400).json({
      mensaje: 'Error de validación',
      errores: [error.message]
    });
  } finally {
    client.release();
  }
};

const obtenerVentas = async (req, res) => {
  try {
    const { page = 1, size = 10, fecha_inicio, fecha_fin, metodo_pago } = req.query;
    const offset = (page - 1) * size;

    let query = `
      WITH venta_ganancias AS (
        SELECT 
          venta_id,
          ROUND((precio_unitario - precio_compra) * cantidad, 2) as ganancia_total,
          CASE 
            WHEN precio_compra > 0 THEN ROUND(((precio_unitario - precio_compra) / precio_compra * 100), 2)
            ELSE 0 
          END as margen_ganancia
        FROM venta_productos
      )
      SELECT v.*, 
             COALESCE(SUM(vg.ganancia_total), 0) as ganancia_total_venta,
             ROUND(AVG(vg.margen_ganancia), 2) as margen_promedio,
             u.id as usuario_id,
             u.nombre as usuario_nombre,
             u.email as usuario_email
      FROM ventas v
      LEFT JOIN venta_ganancias vg ON v.id = vg.venta_id
      LEFT JOIN usuarios u ON v.usuario_id = u.id
    `;

    const queryParams = [];
    const conditions = [];

    if (fecha_inicio) {
      queryParams.push(fecha_inicio);
      conditions.push(`v.fecha::date >= $${queryParams.length}::date AT TIME ZONE 'America/Santo_Domingo'`);
    }

    if (fecha_fin) {
      queryParams.push(fecha_fin);
      conditions.push(`v.fecha::date <= $${queryParams.length}::date AT TIME ZONE 'America/Santo_Domingo'`);
    }

    if (metodo_pago) {
      queryParams.push(metodo_pago);
      conditions.push(`v.metodo_pago = $${queryParams.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY v.id, u.id ORDER BY v.fecha DESC';

    // Obtener total de registros
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM (
        SELECT v.id
        FROM ventas v
        ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
        GROUP BY v.id
      ) as subquery
    `;
    const { rows: [{ total = 0 }] } = await db.query(countQuery, queryParams);

    // Obtener ventas con paginación
    queryParams.push(size, offset);
    query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
    const { rows: ventas } = await db.query(query, queryParams);

    // Obtener productos de cada venta
    for (const venta of ventas) {
      const { rows: productos } = await db.query(
        `SELECT vp.*, 
                ROUND((vp.precio_unitario - vp.precio_compra), 2) as ganancia_unitaria,
                ROUND((vp.precio_unitario - vp.precio_compra) * vp.cantidad, 2) as ganancia_total,
                CASE 
                  WHEN vp.precio_compra > 0 THEN ROUND(((vp.precio_unitario - vp.precio_compra) / vp.precio_compra * 100), 2)
                  ELSE 0 
                END as margen_ganancia
         FROM venta_productos vp
         WHERE vp.venta_id = $1`,
        [venta.id]
      );
      venta.productos = productos;
      venta.usuario = {
        id: venta.usuario_id,
        nombre: venta.usuario_nombre,
        email: venta.usuario_email
      };
      delete venta.usuario_id;
      delete venta.usuario_nombre;
      delete venta.usuario_email;
    }

    // Calcular totales del período
    const { rows: [{ ganancia_total_periodo, margen_promedio_periodo }] } = await db.query(
      `WITH venta_ganancias AS (
        SELECT 
          ROUND((precio_unitario - precio_compra) * cantidad, 2) as ganancia_total,
          CASE 
            WHEN precio_compra > 0 THEN ROUND(((precio_unitario - precio_compra) / precio_compra * 100), 2)
            ELSE 0 
          END as margen_ganancia
        FROM venta_productos vp
        JOIN ventas v ON v.id = vp.venta_id
        ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
      )
      SELECT 
        COALESCE(SUM(ganancia_total), 0) as ganancia_total_periodo,
        ROUND(AVG(margen_ganancia), 2) as margen_promedio_periodo
      FROM venta_ganancias`,
      queryParams.slice(0, -2)
    );

    res.json({
      data: ventas,
      page: parseInt(page),
      size: parseInt(size),
      totalElements: parseInt(total),
      totalPages: Math.ceil(total / size),
      ganancia_total_periodo,
      margen_promedio_periodo
    });

  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      mensaje: 'Error al obtener ventas',
      error: error.message
    });
  }
};

const obtenerVenta = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows: [venta] } = await db.query(
      `WITH venta_ganancias AS (
        SELECT 
          venta_id,
          ROUND((precio_unitario - precio_compra) * cantidad, 2) as ganancia_total,
          CASE 
            WHEN precio_compra > 0 THEN ROUND(((precio_unitario - precio_compra) / precio_compra * 100), 2)
            ELSE 0 
          END as margen_ganancia
        FROM venta_productos
      )
      SELECT v.*, 
             COALESCE(SUM(vg.ganancia_total), 0) as ganancia_total_venta,
             ROUND(AVG(vg.margen_ganancia), 2) as margen_promedio,
             u.id as usuario_id,
             u.nombre as usuario_nombre,
             u.email as usuario_email
      FROM ventas v
      LEFT JOIN venta_ganancias vg ON v.id = vg.venta_id
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.id = $1
      GROUP BY v.id, u.id`,
      [id]
    );

    if (!venta) {
      return res.status(404).json({
        mensaje: 'Venta no encontrada'
      });
    }

    const { rows: productos } = await db.query(
      `SELECT vp.*, 
              p.nombre as nombre_producto,
              c.nombre as categoria_nombre,
              ROUND((vp.precio_unitario - vp.precio_compra), 2) as ganancia_unitaria,
              ROUND((vp.precio_unitario - vp.precio_compra) * vp.cantidad, 2) as ganancia_total,
              CASE 
                WHEN vp.precio_compra > 0 THEN ROUND(((vp.precio_unitario - vp.precio_compra) / vp.precio_compra * 100), 2)
                ELSE 0 
              END as margen_ganancia
       FROM venta_productos vp
       JOIN productos p ON p.id = vp.producto_id
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE vp.venta_id = $1`,
      [id]
    );

    venta.productos = productos;
    venta.usuario = {
      id: venta.usuario_id,
      nombre: venta.usuario_nombre,
      email: venta.usuario_email
    };
    delete venta.usuario_id;
    delete venta.usuario_nombre;
    delete venta.usuario_email;

    res.json({
      data: venta
    });

  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      mensaje: 'Error al obtener venta',
      error: error.message
    });
  }
};

const eliminarVenta = async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Validar que la venta existe
    const { rows: [venta] } = await client.query(
      'SELECT * FROM ventas WHERE id = $1',
      [id]
    );

    if (!venta) {
      return res.status(404).json({
        mensaje: 'Venta no encontrada'
      });
    }

    // Obtener los productos de la venta
    const { rows: productosVenta } = await client.query(
      'SELECT * FROM venta_productos WHERE venta_id = $1',
      [id]
    );

    // Devolver el stock de los productos
    for (const producto of productosVenta) {
      await client.query(
        'UPDATE productos SET stock = stock + $1 WHERE id = $2',
        [producto.cantidad, producto.producto_id]
      );
    }

    // Eliminar los productos de la venta
    await client.query('DELETE FROM venta_productos WHERE venta_id = $1', [id]);

    // Eliminar la venta
    await client.query('DELETE FROM ventas WHERE id = $1', [id]);

    await client.query('COMMIT');

    res.json({
      mensaje: 'Venta eliminada exitosamente',
      data: {
        venta,
        productos: productosVenta
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar venta:', error);
    res.status(500).json({
      mensaje: 'Error al eliminar venta',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  registrarVenta,
  obtenerVentas,
  obtenerVenta,
  eliminarVenta
};
