USE gestion_incapacidades;
-- Borra logs de auditoría más antiguos que 365 días
DELETE FROM auditoria_sistema WHERE created_at < DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY);
