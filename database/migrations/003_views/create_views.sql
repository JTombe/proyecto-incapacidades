USE gestion_incapacidades;

CREATE OR REPLACE VIEW vista_incapacidades_activas AS
SELECT
    i.id,
    CONCAT(c.nombres, ' ', c.apellidos) AS colaborador,
    c.numero_identificacion,
    ti.nombre AS tipo_incapacidad,
    e.nombre AS eps,
    i.fecha_inicio,
    i.fecha_fin,
    i.dias_incapacidad AS total_dias,
    DATEDIFF(CURDATE(), i.fecha_inicio) AS dias_transcurridos,
    ROUND(DATEDIFF(i.fecha_fin, i.fecha_inicio) * 50000, 2) AS valor_incapacidad,
    es.nombre AS estado
FROM incapacidades i
JOIN colaboradores c ON i.empleado_id = c.id
JOIN tipos_incapacidad ti ON i.tipo_incapacidad_id = ti.id
JOIN eps e ON c.eps_id = e.id
JOIN estados_incapacidad es ON i.estado_incapacidad_id = es.id
WHERE es.es_estado_final = FALSE;
