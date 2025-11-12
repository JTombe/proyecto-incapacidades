USE gestion_incapacidades;
DROP PROCEDURE IF EXISTS generar_reporte_ausentismo;
DELIMITER $$
CREATE PROCEDURE generar_reporte_ausentismo(IN p_mes INT, IN p_año INT)
BEGIN
    INSERT INTO reportes_ausentismo (mes, año, total_incapacidades, total_dias_incapacidad, total_colaboradores_afectados, generated_at)
    SELECT 
        p_mes, p_año,
        COUNT(*) AS total_incapacidades,
        COALESCE(SUM(total_dias),0) AS total_dias,
        COUNT(DISTINCT colaborador_id) AS colaboradores_afectados,
        CURRENT_TIMESTAMP
    FROM incapacidades 
    WHERE MONTH(fecha_inicio) = p_mes AND YEAR(fecha_inicio) = p_año;
END$$
DELIMITER ;
