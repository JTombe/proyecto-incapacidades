USE gestion_incapacidades;

INSERT IGNORE INTO roles (codigo, nombre, descripcion, nivel_permisos) VALUES
('ROLE_ADMIN', 'Administrador del Sistema', 'Acceso completo al sistema', 100),
('ROLE_GESTION_HUMANA', 'Gestión Humana', 'Personal de gestión humana - proceso completo', 90),
('ROLE_AUX_ADMIN_PERSONAL', 'Auxiliar Administración Personal', 'Gestión diaria de incapacidades', 80),
('ROLE_LIDER', 'Líder', 'Líder inmediato - ver equipo y gestionar reemplazos', 60),
('ROLE_COLABORADOR', 'Colaborador', 'Colaborador - ver propias incapacidades y subir docs', 50),
('ROLE_RECEPCION', 'Recepcionista', 'Recepcionista - recibir documentación inicial', 40),
('ROLE_TESORERIA', 'Tesorería', 'Tesorería - ver pagos y conciliaciones', 70),
('ROLE_CONTABILIDAD', 'Contabilidad', 'Contabilidad - conciliación contable', 75),
('ROLE_JURIDICA', 'Jurídica', 'Área jurídica - gestión de cobro jurídico', 85),
('ROLE_EPS_EXTERNO', 'EPS Externo', 'Usuario externo de EPS - solo consulta', 30);
