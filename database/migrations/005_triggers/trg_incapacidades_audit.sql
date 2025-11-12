USE gestion_incapacidades;
DELIMITER //

-- Reemplaza trigger de INSERT (usa empleado_id y no usa creado_por)
DROP TRIGGER IF EXISTS auditoria_incapacidades_insert//
CREATE TRIGGER auditoria_incapacidades_insert
AFTER INSERT ON incapacidades
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_sistema (
        tabla_afectada,
        registro_id,
        accion,
        valores_nuevos,
        descripcion,
        usuario_id
    )
    VALUES (
        'incapacidades',
        NEW.id,
        'INSERT',
        JSON_OBJECT('empleado_id', NEW.empleado_id, 'tipo_incapacidad_id', NEW.tipo_incapacidad_id),
        'Nueva incapacidad registrada',
        NULL
    );
END//
 
-- Reemplaza trigger de UPDATE (adaptado a estado_incapacidad_id)
DROP TRIGGER IF EXISTS auditoria_incapacidades_update//
CREATE TRIGGER auditoria_incapacidades_update
AFTER UPDATE ON incapacidades
FOR EACH ROW
BEGIN
    IF OLD.estado_incapacidad_id != NEW.estado_incapacidad_id THEN
        INSERT INTO auditoria_sistema (
            tabla_afectada,
            registro_id,
            accion,
            valores_anteriores,
            valores_nuevos,
            descripcion,
            usuario_id
        )
        VALUES (
            'incapacidades',
            NEW.id,
            'UPDATE',
            JSON_OBJECT('estado_anterior', OLD.estado_incapacidad_id),
            JSON_OBJECT('estado_nuevo', NEW.estado_incapacidad_id),
            'Cambio de estado en incapacidad',
            NULL
        );
    END IF;
END//

DELIMITER ;
