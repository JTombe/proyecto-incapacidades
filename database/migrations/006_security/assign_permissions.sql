USE gestion_incapacidades;

INSERT IGNORE INTO permisos (codigo, nombre, descripcion, modulo) VALUES
('INCAPACIDAD_CREAR', 'Crear Incapacidad', 'Registrar nueva incapacidad', 'INCAPACIDADES'),
('INCAPACIDAD_VER', 'Ver Incapacidades', 'Ver listado de incapacidades', 'INCAPACIDADES'),
('INCAPACIDAD_EDITAR', 'Editar Incapacidad', 'Modificar información de incapacidad', 'INCAPACIDADES'),
('INCAPACIDAD_ELIMINAR', 'Eliminar Incapacidad', 'Eliminar incapacidad del sistema', 'INCAPACIDADES'),
('INCAPACIDAD_TRANSCRIBIR', 'Transcribir Incapacidad', 'Realizar transcripción a EPS', 'INCAPACIDADES'),
('INCAPACIDAD_APROBAR', 'Aprobar Incapacidad', 'Aprobar/rechazar incapacidades', 'INCAPACIDADES'),
('DOCUMENTO_SUBIR', 'Subir Documentos', 'Subir documentos de incapacidad', 'DOCUMENTOS'),
('DOCUMENTO_VER', 'Ver Documentos', 'Ver documentos adjuntos', 'DOCUMENTOS'),
('DOCUMENTO_ELIMINAR', 'Eliminar Documentos', 'Eliminar documentos del sistema', 'DOCUMENTOS'),
('DOCUMENTO_CONFIDENCIAL', 'Ver Documentos Confidenciales', 'Ver historia clínica y docs sensibles', 'DOCUMENTOS'),
('PAGO_REGISTRAR', 'Registrar Pago', 'Registrar pagos de EPS/ARL', 'PAGOS'),
('PAGO_CONCILIAR', 'Conciliar Pagos', 'Realizar conciliación contable', 'PAGOS'),
('PAGO_REPORTAR', 'Reportar Pagos', 'Generar reportes de pagos', 'PAGOS'),
('REPORTE_AUSENTISMO', 'Ver Reporte Ausentismo', 'Ver reportes mensuales de ausentismo', 'REPORTES'),
('REPORTE_ESTADISTICAS', 'Ver Estadísticas', 'Ver estadísticas del sistema', 'REPORTES'),
('AUDITORIA_VER', 'Ver Auditoría', 'Ver logs del sistema', 'AUDITORIA');
