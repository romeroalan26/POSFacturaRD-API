-- Índices para mejorar el rendimiento de los reportes
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_metodo_pago ON ventas(metodo_pago);
CREATE INDEX IF NOT EXISTS idx_venta_productos_venta_id ON venta_productos(venta_id);
CREATE INDEX IF NOT EXISTS idx_venta_productos_producto_id ON venta_productos(producto_id);

-- Índices compuestos para consultas comunes
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_metodo ON ventas(fecha, metodo_pago);
CREATE INDEX IF NOT EXISTS idx_venta_productos_venta_fecha ON venta_productos(venta_id, producto_id);

-- Comentarios explicativos
COMMENT ON INDEX idx_ventas_fecha IS 'Índice para optimizar filtros por fecha en reportes';
COMMENT ON INDEX idx_ventas_metodo_pago IS 'Índice para optimizar reportes por método de pago';
COMMENT ON INDEX idx_venta_productos_venta_id IS 'Índice para optimizar joins en reportes de productos';
COMMENT ON INDEX idx_venta_productos_producto_id IS 'Índice para optimizar filtros por producto';
COMMENT ON INDEX idx_ventas_fecha_metodo IS 'Índice compuesto para reportes que filtran por fecha y método de pago';
COMMENT ON INDEX idx_venta_productos_venta_fecha IS 'Índice compuesto para optimizar reportes de productos por venta'; 