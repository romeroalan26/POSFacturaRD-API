-- Saneamiento de la base de datos: eliminar ventas, venta_productos y productos demo

-- 1. Borrar todos los registros de venta_productos y ventas
DELETE FROM venta_productos;
DELETE FROM ventas;

-- 2. Borrar todos los productos (ajusta el WHERE si solo quieres borrar productos demo)
DELETE FROM productos;

-- 3. (Opcional) Reiniciar los contadores de ID
-- ALTER SEQUENCE productos_id_seq RESTART WITH 1;
-- ALTER SEQUENCE ventas_id_seq RESTART WITH 1;
-- ALTER SEQUENCE venta_productos_id_seq RESTART WITH 1; -- si existe 