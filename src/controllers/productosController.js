const db = require('../db');

// Validaciones
const validarProducto = (producto, esActualizacion = false) => {
  const errores = [];

  // Solo validar nombre si se proporciona o si no es actualización
  if (!esActualizacion || producto.nombre !== undefined) {
    if (!producto.nombre || producto.nombre.trim().length === 0) {
      errores.push('El nombre es obligatorio');
    } else if (producto.nombre.length > 100) {
      errores.push('El nombre no puede tener más de 100 caracteres');
    }
  }

  // Solo validar precio si se proporciona o si no es actualización
  if (!esActualizacion || producto.precio !== undefined) {
    if (producto.precio === undefined || producto.precio === null) {
      errores.push('El precio es obligatorio');
    } else if (typeof producto.precio !== 'number' || producto.precio <= 0) {
      errores.push('El precio debe ser un número positivo');
    }
  }

  // Validar precio_compra si se proporciona o si no es actualización
  if (!esActualizacion || producto.precio_compra !== undefined) {
    if (producto.precio_compra === undefined || producto.precio_compra === null) {
      errores.push('El precio de compra es obligatorio');
    } else if (typeof producto.precio_compra !== 'number' || producto.precio_compra < 0) {
      errores.push('El precio de compra debe ser un número no negativo');
    }
  }

  // Validar que precio_compra sea menor que precio
  if (producto.precio !== undefined && producto.precio_compra !== undefined) {
    if (producto.precio_compra >= producto.precio) {
      errores.push('El precio de compra debe ser menor que el precio de venta');
    }
  }

  // Solo validar stock si se proporciona o si no es actualización
  if (!esActualizacion || producto.stock !== undefined) {
    if (producto.stock === undefined || producto.stock === null) {
      errores.push('El stock es obligatorio');
    } else if (!Number.isInteger(producto.stock) || producto.stock < 0) {
      errores.push('El stock debe ser un número entero no negativo');
    }
  }

  // Validar stock_minimo si se proporciona
  if (producto.stock_minimo !== undefined && producto.stock_minimo !== null) {
    if (!Number.isInteger(Number(producto.stock_minimo)) || Number(producto.stock_minimo) < 0) {
      errores.push('El stock mínimo debe ser un número entero no negativo');
    }
    // Validar que stock_minimo no sea mayor que el stock actual
    if (producto.stock !== undefined && producto.stock_minimo > producto.stock) {
      errores.push('El stock mínimo no puede ser mayor que el stock actual');
    }
  }

  // Validar que con_itbis sea un booleano si se proporciona
  if (producto.con_itbis !== undefined && producto.con_itbis !== null) {
    if (typeof producto.con_itbis !== 'boolean') {
      errores.push('El campo con_itbis debe ser true o false');
    }
  }

  // Validar categoria_id si se proporciona
  if (producto.categoria_id !== undefined && producto.categoria_id !== null) {
    if (!Number.isInteger(Number(producto.categoria_id))) {
      errores.push('El ID de categoría debe ser un número entero');
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

// Obtener productos
const obtenerProductos = async (req, res) => {
  const { page = 1, size = 10, categoria_id, buscar } = req.query;
  const offset = (page - 1) * size;

  try {
    let query = `
      SELECT p.*, 
             c.nombre as categoria_nombre,
             (p.precio::numeric - p.precio_compra::numeric) as ganancia_unitaria,
             CASE 
               WHEN p.precio_compra::numeric = 0 THEN 0
               ELSE ((p.precio::numeric - p.precio_compra::numeric) / p.precio_compra::numeric * 100)
             END as margen_ganancia
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (categoria_id) {
      query += ` AND p.categoria_id = $${paramIndex}`;
      values.push(categoria_id);
      paramIndex++;
    }

    if (buscar) {
      query += ` AND p.nombre ILIKE $${paramIndex}`;
      values.push(`%${buscar}%`);
      paramIndex++;
    }

    // Obtener total de elementos
    const countQuery = `
      SELECT COUNT(*) 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
      ${categoria_id ? ` AND p.categoria_id = $1` : ''}
      ${buscar ? ` AND p.nombre ILIKE $${categoria_id ? '2' : '1'}` : ''}
    `;
    const countValues = [];
    if (categoria_id) countValues.push(categoria_id);
    if (buscar) countValues.push(`%${buscar}%`);

    const totalResult = await db.query(countQuery, countValues);
    const totalElements = parseInt(totalResult.rows[0].count);

    // Agregar ordenamiento y paginación
    query += ` ORDER BY p.is_active DESC, p.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(size, offset);

    const result = await db.query(query, values);

    res.json({
      data: result.rows,
      page: parseInt(page),
      size: parseInt(size),
      totalElements,
      totalPages: Math.ceil(totalElements / size),
      categoria_id: categoria_id ? parseInt(categoria_id) : null,
      buscar: buscar || null
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Insertar producto
const crearProducto = async (req, res) => {
  const { nombre, precio, precio_compra, stock, con_itbis, categoria_id, imagen, stock_minimo } = req.body;

  // Validar campos obligatorios
  const errores = validarProducto({ nombre, precio, precio_compra, stock, con_itbis, categoria_id, stock_minimo });
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Error de validación', errores });
  }

  try {
    // Verificar si ya existe un producto con el mismo nombre
    const productoExistente = await db.query(
      'SELECT id FROM productos WHERE nombre = $1',
      [nombre.trim()]
    );

    if (productoExistente.rows.length > 0) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['Ya existe un producto con este nombre']
      });
    }

    // Verificar si la categoría existe
    if (categoria_id) {
      const categoriaExistente = await db.query(
        'SELECT id FROM categorias WHERE id = $1',
        [categoria_id]
      );

      if (categoriaExistente.rows.length === 0) {
        return res.status(400).json({
          mensaje: 'Error de validación',
          errores: ['La categoría especificada no existe']
        });
      }
    }

    const query = `
      INSERT INTO productos (nombre, precio, precio_compra, stock, con_itbis, categoria_id, imagen, stock_minimo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *, (SELECT nombre FROM categorias WHERE id = $6) as categoria_nombre;
    `;

    // Convertir con_itbis a booleano explícitamente
    const conItbisBoolean = con_itbis === true || con_itbis === 'true' || con_itbis === 1;

    const values = [
      nombre.trim(),
      precio,
      precio_compra,
      stock,
      conItbisBoolean,
      categoria_id || null,
      imagen || null,
      stock_minimo || 10 // Valor por defecto de 10 si no se proporciona
    ];

    const resultado = await db.query(query, values);
    res.status(201).json({
      data: resultado.rows[0],
      mensaje: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      mensaje: 'Error al crear producto',
      error: error.message
    });
  }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, precio_compra, stock, con_itbis, categoria_id, imagen, is_active } = req.body;

  // Validar ID
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: ['ID de producto inválido']
    });
  }

  // Validar campos (pasando true para indicar que es una actualización)
  const errores = validarProducto({ nombre, precio, precio_compra, stock, con_itbis, categoria_id }, true);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Error de validación', errores });
  }

  try {
    // Verificar si el producto existe
    const productoExistente = await db.query(
      'SELECT id, nombre, precio, precio_compra FROM productos WHERE id = $1',
      [id]
    );

    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Verificar si la categoría existe
    if (categoria_id) {
      const categoriaExistente = await db.query(
        'SELECT id FROM categorias WHERE id = $1',
        [categoria_id]
      );

      if (categoriaExistente.rows.length === 0) {
        return res.status(400).json({
          mensaje: 'Error de validación',
          errores: ['La categoría especificada no existe']
        });
      }
    }

    // Solo verificar nombre duplicado si se está actualizando el nombre
    if (nombre) {
      const nombreDuplicado = await db.query(
        'SELECT id FROM productos WHERE nombre = $1 AND id != $2',
        [nombre.trim(), id]
      );

      if (nombreDuplicado.rows.length > 0) {
        return res.status(400).json({
          mensaje: 'Error de validación',
          errores: ['Ya existe un producto con este nombre']
        });
      }
    }

    // Construir la consulta de actualización dinámicamente
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      updates.push(`nombre = $${paramIndex}`);
      values.push(nombre.trim());
      paramIndex++;
    }

    if (precio !== undefined) {
      updates.push(`precio = $${paramIndex}`);
      values.push(precio);
      paramIndex++;
    }

    if (precio_compra !== undefined) {
      updates.push(`precio_compra = $${paramIndex}`);
      values.push(precio_compra);
      paramIndex++;
    }

    if (stock !== undefined) {
      updates.push(`stock = $${paramIndex}`);
      values.push(stock);
      paramIndex++;
    }

    if (con_itbis !== undefined) {
      updates.push(`con_itbis = $${paramIndex}`);
      values.push(con_itbis === true || con_itbis === 'true' || con_itbis === 1);
      paramIndex++;
    }

    if (categoria_id !== undefined) {
      updates.push(`categoria_id = $${paramIndex}`);
      values.push(categoria_id);
      paramIndex++;
    }

    if (imagen !== undefined) {
      updates.push(`imagen = $${paramIndex}`);
      values.push(imagen);
      paramIndex++;
    }

    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      values.push(is_active === true || is_active === 'true' || is_active === 1);
      paramIndex++;
    }

    if (req.body.stock_minimo !== undefined) {
      updates.push(`stock_minimo = $${paramIndex}`);
      values.push(req.body.stock_minimo);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['No se proporcionaron campos para actualizar']
      });
    }

    values.push(id);
    const query = `
      UPDATE productos 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *, (SELECT nombre FROM categorias WHERE id = categoria_id) as categoria_nombre;
    `;

    const resultado = await db.query(query, values);
    res.json({
      data: resultado.rows[0],
      mensaje: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  // Validar ID
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: ['ID de producto inválido']
    });
  }

  try {
    // Verificar si el producto existe
    const productoExistente = await db.query(
      'SELECT id FROM productos WHERE id = $1',
      [id]
    );

    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Verificar si el producto está asociado a ventas
    const ventasAsociadas = await db.query(
      'SELECT COUNT(*) FROM venta_productos WHERE producto_id = $1',
      [id]
    );

    if (parseInt(ventasAsociadas.rows[0].count) > 0) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['No se puede eliminar el producto porque está asociado a ventas existentes']
      });
    }

    const resultado = await db.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    );

    res.json({
      data: resultado.rows[0],
      mensaje: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
