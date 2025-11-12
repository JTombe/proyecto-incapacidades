USE gestion_incapacidades;

CREATE USER IF NOT EXISTS 'app_incapacidades'@'%' IDENTIFIED BY 'SecurePassword123';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_incapacidades.* TO 'app_incapacidades'@'%';
GRANT EXECUTE ON PROCEDURE gestion_incapacidades.actualizar_dias_transcurridos TO 'app_incapacidades'@'%';
GRANT EXECUTE ON PROCEDURE gestion_incapacidades.generar_reporte_ausentismo TO 'app_incapacidades'@'%';
FLUSH PRIVILEGES;
COMMIT;
