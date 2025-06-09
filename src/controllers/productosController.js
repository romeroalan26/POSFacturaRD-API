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

  // Solo validar stock si se proporciona o si no es actualización
  if (!esActualizacion || producto.stock !== undefined) {
    if (producto.stock === undefined || producto.stock === null) {
      errores.push('El stock es obligatorio');
    } else if (!Number.isInteger(producto.stock) || producto.stock < 0) {
      errores.push('El stock debe ser un número entero no negativo');
    }
  }

  // Validar que con_itbis sea un booleano si se proporciona
  if (producto.con_itbis !== undefined && producto.con_itbis !== null) {
    if (typeof producto.con_itbis !== 'boolean') {
      errores.push('El campo con_itbis debe ser true o false');
    }
  }

  return errores;
};

// Obtener productos
const obtenerProductos = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM productos ORDER BY id');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Insertar producto
const crearProducto = async (req, res) => {
  const { nombre, precio, stock, con_itbis, categoria } = req.body;

  // Validar campos obligatorios
  const errores = validarProducto({ nombre, precio, stock, con_itbis });
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

    const query = `
      INSERT INTO productos (nombre, precio, stock, con_itbis, categoria)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    // Convertir con_itbis a booleano explícitamente
    const conItbisBoolean = con_itbis === true || con_itbis === 'true' || con_itbis === 1;

    const values = [
      nombre.trim(),
      precio,
      stock,
      conItbisBoolean,
      categoria || null
    ];

    const resultado = await db.query(query, values);
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, con_itbis, categoria } = req.body;

  // Validar ID
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: ['ID de producto inválido']
    });
  }

  // Validar campos (pasando true para indicar que es una actualización)
  const errores = validarProducto({ nombre, precio, stock, con_itbis }, true);
  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Error de validación', errores });
  }

  try {
    // Verificar si el producto existe
    const productoExistente = await db.query(
      'SELECT id, nombre FROM productos WHERE id = $1',
      [id]
    );

    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
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
          errores: ['Ya existe otro producto con este nombre']
        });
      }
    }

    // Construir la consulta dinámicamente basada en los campos proporcionados
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

    if (categoria !== undefined) {
      updates.push(`categoria = $${paramIndex}`);
      values.push(categoria);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: ['Debe proporcionar al menos un campo para actualizar']
      });
    }

    values.push(id);
    const query = `
      UPDATE productos 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const resultado = await db.query(query, values);
    res.json(resultado.rows[0]);
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

    res.json({ mensaje: 'Producto eliminado', producto: resultado.rows[0] });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
