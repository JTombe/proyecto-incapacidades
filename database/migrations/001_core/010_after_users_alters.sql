USE gestion_incapacidades;

-- Asegurar integridad de usuarios con roles (solo si no existe ya la FK)

SET @fk_name := (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'rol_id'
      AND REFERENCED_TABLE_NAME = 'roles'
);

-- Solo crear la FK si aún no existe
SET @sql := IF(@fk_name IS NULL,
    'ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles(id);',
    'SELECT "Foreign key fk_usuarios_roles ya existente, omitiendo creación";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
