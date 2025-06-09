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

const registrarVenta = async (req, res) => {
  const { productos, metodo_pago } = req.body;

  // Validar datos de entrada
  const errores = validarVenta({ productos, metodo_pago });
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Error de validación', errores });
  }

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    let subtotal = 0;
    let itbis_total = 0;
    const ITBIS_RATE = parseFloat(process.env.ITBIS_RATE || '0.18');

    // Verificar existencia, stock y calcular ITBIS
    for (const prod of productos) {
      const productoExistente = await client.query(
        'SELECT id, nombre, precio, stock, con_itbis FROM productos WHERE id = $1',
        [prod.producto_id]
      );

      if (productoExistente.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          mensaje: 'Error de validación',
          errores: [`El producto con ID ${prod.producto_id} no existe`]
        });
      }

      const producto = productoExistente.rows[0];

      // Verificar stock
      if (producto.stock < prod.cantidad) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          mensaje: 'Error de validación',
          errores: [`Stock insuficiente para el producto ${producto.nombre}. Stock disponible: ${producto.stock}`]
        });
      }

      // Convertir precios a números para la comparación
      const precioActual = parseFloat(producto.precio);
      const precioEnviado = parseFloat(prod.precio_unitario);

      // Verificar precio con tolerancia
      const diferenciaPrecio = Math.abs(precioActual - precioEnviado);
      const tolerancia = 0.01;

      if (diferenciaPrecio > tolerancia) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          mensaje: 'Error de validación',
          errores: [
            `El precio del producto "${producto.nombre}" ha cambiado. Precio actual: ${precioActual.toFixed(2)}, Precio enviado: ${precioEnviado.toFixed(2)}`
          ]
        });
      }

      // Calcular subtotal e ITBIS
      const productoSubtotal = precioEnviado * prod.cantidad;
      subtotal += productoSubtotal;
      if (producto.con_itbis === true) {
        itbis_total += productoSubtotal * ITBIS_RATE;
      }
    }

    // Redondear a 2 decimales
    subtotal = parseFloat(subtotal.toFixed(2));
    itbis_total = parseFloat(itbis_total.toFixed(2));
    const total_final = parseFloat((subtotal + itbis_total).toFixed(2));

    const ventaRes = await client.query(
      'INSERT INTO ventas (subtotal, itbis_total, total_final, metodo_pago) VALUES ($1, $2, $3, $4) RETURNING id',
      [subtotal, itbis_total, total_final, metodo_pago.toLowerCase()]
    );

    const ventaId = ventaRes.rows[0].id;

    for (const prod of productos) {
      await client.query(
        'INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [ventaId, prod.producto_id, prod.cantidad, parseFloat(prod.precio_unitario)]
      );

      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [prod.cantidad, prod.producto_id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Venta registrada',
      venta_id: ventaId,
      subtotal,
      itbis_total,
      total_final,
      itbis_rate: ITBIS_RATE
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar venta:', error);

    // Determinar el tipo de error y responder apropiadamente
    if (error.code === '23505') { // Violación de restricción única
      res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['Ya existe una venta con los mismos datos']
      });
    } else if (error.code === '23503') { // Violación de clave foránea
      res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['Uno de los productos no existe en la base de datos']
      });
    } else if (error.code === '22P02') { // Error de tipo de dato
      res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['Tipo de dato inválido en uno de los campos']
      });
    } else {
      // Para otros errores, enviar un mensaje más descriptivo
      res.status(500).json({
        mensaje: 'Error del servidor',
        detalle: error.message,
        codigo: error.code
      });
    }
  } finally {
    client.release();
  }
};

const obtenerVentas = async (req, res) => {
  try {
    // Obtener parámetros de paginación y filtros
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Construir la consulta base
    let query = `
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
    `;

    // Agregar filtros si existen
    const whereConditions = [];
    const queryParams = [];
    let paramIndex = 1;

    if (req.query.fecha_inicio) {
      whereConditions.push(`v.fecha >= $${paramIndex}`);
      queryParams.push(req.query.fecha_inicio);
      paramIndex++;
    }

    if (req.query.fecha_fin) {
      whereConditions.push(`v.fecha <= $${paramIndex}`);
      queryParams.push(req.query.fecha_fin);
      paramIndex++;
    }

    if (req.query.metodo_pago) {
      whereConditions.push(`v.metodo_pago = $${paramIndex}`);
      queryParams.push(req.query.metodo_pago.toLowerCase());
      paramIndex++;
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Agregar agrupación y ordenamiento
    query += ' GROUP BY v.id ORDER BY v.fecha DESC';

    // Agregar paginación
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const resultado = await db.query(query, queryParams);

    // Obtener el total de registros para la paginación
    const countQuery = `
      SELECT COUNT(DISTINCT v.id) 
      FROM ventas v
      ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
    `;
    const totalResult = await db.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(totalResult.rows[0].count);

    res.json({
      ventas: resultado.rows,
      paginacion: {
        total,
        pagina_actual: page,
        total_paginas: Math.ceil(total / limit),
        registros_por_pagina: limit
      }
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  registrarVenta,
  obtenerVentas,
};
