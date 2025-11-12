USE gestion_incapacidades;

-- Crear admin con hash bcrypt (ejemplo: hash generado externamente)
INSERT INTO usuarios (username, email, password_hash, salt, nombres, apellidos, esta_activo, debe_cambiar_password)
VALUES ('admin', 'admin@empresa.com', '$2b$12$abcdefghijklmnopqrstuv', 'salt-placeholder', 'Admin', 'Principal', TRUE, TRUE);

SET @admin_id = (SELECT id FROM usuarios WHERE username = 'admin');

-- Asignar role admin al usuario creado
INSERT INTO usuarios_roles (usuario_id, rol_id, asignado_por)
SELECT @admin_id, r.id, @admin_id FROM roles r WHERE r.codigo = 'ROLE_ADMIN';

-- Asignar permisos: Admin obtiene todos los permisos (roles_permisos)
INSERT INTO roles_permisos (rol_id, permiso_id, concedido_por)
SELECT r.id, p.id, @admin_id FROM roles r CROSS JOIN permisos p WHERE r.codigo = 'ROLE_ADMIN';

-- Gestión Humana: casi todo excepto auditoría completa
INSERT INTO roles_permisos (rol_id, permiso_id, concedido_por)
SELECT r.id, p.id, @admin_id FROM roles r
JOIN permisos p ON p.codigo NOT LIKE 'AUDITORIA_%'
WHERE r.codigo = 'ROLE_GESTION_HUMANA';

-- Colaborador: permisos limitados
INSERT INTO roles_permisos (rol_id, permiso_id, concedido_por)
SELECT r.id, p.id, @admin_id FROM roles r
JOIN permisos p ON p.codigo IN ('INCAPACIDAD_CREAR','INCAPACIDAD_VER','DOCUMENTO_SUBIR')
WHERE r.codigo = 'ROLE_COLABORADOR';
