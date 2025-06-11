-- Insertar categorías sugeridas
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Cervezas', 'Cervezas nacionales e importadas'),
  ('Energizantes', 'Bebidas energizantes'),
  ('Licores', 'Licores y shots'),
  ('Jugos', 'Jugos y bebidas no alcohólicas'),
  ('Snacks', 'Snacks y golosinas'),
  ('Refrescos', 'Refrescos y sodas'),
  ('Agua', 'Agua embotellada')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar productos
INSERT INTO productos (nombre, descripcion, precio, stock, con_itbis, categoria_id, imagen) VALUES
  ('Presidente Grande Fuera', 'Cerveza Presidente grande para consumo fuera del local', 175, 100, true, (SELECT id FROM categorias WHERE nombre='Cervezas'), NULL),
  ('Presidente Grande Disco', 'Cerveza Presidente grande para consumo en discoteca', 200, 100, true, (SELECT id FROM categorias WHERE nombre='Cervezas'), NULL),
  ('Cerveza ONE', 'Cerveza ONE, refrescante y ligera', 185, 100, true, (SELECT id FROM categorias WHERE nombre='Cervezas'), NULL),
  ('Presidente PEQ', 'Cerveza Presidente pequeña', 150, 100, true, (SELECT id FROM categorias WHERE nombre='Cervezas'), NULL),
  ('Corona', 'Cerveza Corona importada', 200, 100, true, (SELECT id FROM categorias WHERE nombre='Cervezas'), NULL),
  ('Energy 911', 'Bebida energizante 911', 125, 100, false, (SELECT id FROM categorias WHERE nombre='Energizantes'), NULL),
  ('Ciclón Grande', 'Energizante Ciclón en presentación grande', 200, 100, false, (SELECT id FROM categorias WHERE nombre='Energizantes'), NULL),
  ('Fireball PEQ', 'Shot de licor Fireball pequeño', 200, 100, true, (SELECT id FROM categorias WHERE nombre='Licores'), NULL),
  ('Clamato', 'Jugo Clamato, ideal para cócteles', 90, 100, false, (SELECT id FROM categorias WHERE nombre='Jugos'), NULL),
  ('Botella de Agua', 'Agua embotellada', 30, 100, false, (SELECT id FROM categorias WHERE nombre='Agua'), NULL),
  ('Jugo Mott's PEQ', 'Jugo Mott's en presentación pequeña', 150, 100, false, (SELECT id FROM categorias WHERE nombre='Jugos'), NULL),
  ('Trident', 'Chicle Trident, varios sabores', 100, 100, false, (SELECT id FROM categorias WHERE nombre='Snacks'), NULL),
  ('Cloret', 'Chicle Cloret', 10, 100, false, (SELECT id FROM categorias WHERE nombre='Snacks'), NULL),
  ('Cloret 2x15', 'Paquete de 2 Cloret por 15', 15, 100, false, (SELECT id FROM categorias WHERE nombre='Snacks'), NULL),
  ('Sevent up', 'Refresco Seven Up', 50, 100, false, (SELECT id FROM categorias WHERE nombre='Refrescos'), NULL),
  ('Gatore', 'Bebida hidratante Gatorade', 100, 100, false, (SELECT id FROM categorias WHERE nombre='Refrescos'), NULL),
  ('Agua Tónica', 'Agua tónica para cócteles', 85, 100, false, (SELECT id FROM categorias WHERE nombre='Refrescos'), NULL); 