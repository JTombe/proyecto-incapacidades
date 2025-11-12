USE gestion_incapacidades;
DROP PROCEDURE IF EXISTS actualizar_dias_transcurridos;
DELIMITER $$
CREATE PROCEDURE actualizar_dias_transcurridos()
BEGIN
    UPDATE incapacidades 
    SET dias_transcurridos = DATEDIFF(CURRENT_DATE, fecha_inicio),
        alerta_90_dias = CASE WHEN DATEDIFF(CURRENT_DATE, fecha_inicio) >= 90 THEN TRUE ELSE alerta_90_dias END,
        alerta_120_dias = CASE WHEN DATEDIFF(CURRENT_DATE, fecha_inicio) >= 120 THEN TRUE ELSE alerta_120_dias END,
        alerta_150_dias = CASE WHEN DATEDIFF(CURRENT_DATE, fecha_inicio) >= 150 THEN TRUE ELSE alerta_150_dias END,
        alerta_180_dias = CASE WHEN DATEDIFF(CURRENT_DATE, fecha_inicio) >= 180 THEN TRUE ELSE alerta_180_dias END
    WHERE estado_actual_id NOT IN (SELECT id FROM estados_incapacidad WHERE es_estado_final = TRUE);
END$$
DELIMITER ;
