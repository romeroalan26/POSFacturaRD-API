const db = require('../db');

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

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre, precio o stock' });
  }

  try {
    const query = `
      INSERT INTO productos (nombre, precio, stock, con_itbis, categoria)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [nombre, precio, stock, con_itbis || false, categoria || null];

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

  try {
    const resultado = await db.query(
      `UPDATE productos 
       SET nombre = $1, precio = $2, stock = $3, con_itbis = $4, categoria = $5
       WHERE id = $6
       RETURNING *`,
      [nombre, precio, stock, con_itbis, categoria, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Eliminar un producto

const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

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
