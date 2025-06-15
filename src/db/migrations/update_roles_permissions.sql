-- Actualizar permisos de roles para incluir el módulo de gastos
UPDATE roles 
SET permissions = jsonb_set(
    permissions,
    '{expenses}',
    '{"view": true, "create": true, "update": true, "delete": true}'
)
WHERE name = 'admin';

UPDATE roles 
SET permissions = jsonb_set(
    permissions,
    '{expenses}',
    '{"view": true, "create": true, "update": false, "delete": false}'
)
WHERE name = 'cajero';

UPDATE roles 
SET permissions = jsonb_set(
    permissions,
    '{expenses}',
    '{"view": true, "create": false, "update": false, "delete": false}'
)
WHERE name = 'inventario';

UPDATE roles 
SET permissions = jsonb_set(
    permissions,
    '{expenses}',
    '{"view": true, "create": false, "update": false, "delete": false}'
)
WHERE name = 'invitado'; 