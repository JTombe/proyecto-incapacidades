USE gestion_incapacidades;

-- Insertar estados
INSERT IGNORE INTO estados_incapacidad (codigo, nombre, descripcion, es_estado_final) VALUES
('RADICADA','Radicada','Incapacidad recibida y registrada',FALSE),
('TRANSCRITA','Transcrita','Transcrita formalmente en la entidad',FALSE),
('EN_VERIFICACION','En Verificación','En proceso de validación por la EPS',FALSE),
('APROBADA','Aprobada','Aprobada por la entidad',FALSE),
('RECHAZADA','Rechazada','Rechazada por la entidad',FALSE),
('COBRADA','Cobrada','Verificada y aprobada para pago',FALSE),
('PAGADA','Pagada','Pago realizado por la entidad',TRUE),
('ARCHIVADA','Archivada','Proceso completado y archivado',TRUE);

-- Insertar tipos de incapacidad
INSERT IGNORE INTO tipos_incapacidad (codigo, nombre, descripcion, requiere_epicrisis, requiere_furips, dias_minimo_epicrisis) VALUES
('EG','Enfermedad General','Incapacidad por enfermedad común',TRUE,FALSE,2),
('AT','Accidente de Tránsito','Incapacidad por accidente de tránsito',TRUE,TRUE,0),
('AL','Accidente Laboral','Incapacidad por accidente laboral',TRUE,FALSE,0),
('LM','Licencia de Maternidad','Licencia por maternidad',TRUE,FALSE,0),
('LP','Licencia de Paternidad','Licencia por paternidad',TRUE,FALSE,0);

-- Insertar EPS
INSERT IGNORE INTO eps (nombre, nit, telefono, tiempo_transcripcion_dias) VALUES
('Salud Total', '8300006166', '01 8000 115566', 360),
('Nueva EPS', '8300345678', '01 8000 112233', 360),
('SOS', '8600007890', '01 8000 119988', 360),
('Sanitas', '8601234567', '01 8000 115544', 1080),
('SURA EPS', '8600987654', '01 8000 117766', 150),
('Asmet Salud', '8912345678', '01 8000 113344', 360);

-- Insertar ARL
INSERT IGNORE INTO arl (nombre, nit, telefono) VALUES
('ARL Sura', '860123456', '01 8000 519519'),
('ARL Positiva', '860654321', '01 8000 511111'),
('Colmena ARL', '891200123', '01 8000 414142'),
('Seguros Bolívar ARL', '860222333', '01 8000 113355');

-- Configurar porcentajes de pago
INSERT IGNORE INTO configuracion_porcentajes (tipo_incapacidad_id, desde_dia, hasta_dia, porcentaje, responsable, descripcion) VALUES
((SELECT id FROM tipos_incapacidad WHERE codigo='EG'),1,2,100.00,'EMPRESA','Días 1-2: Empresa paga 100%'),
((SELECT id FROM tipos_incapacidad WHERE codigo='EG'),3,90,67.00,'EPS','Días 3-90: EPS paga 67%'),
((SELECT id FROM tipos_incapacidad WHERE codigo='EG'),91,180,50.00,'EPS','Días 91-180: EPS paga 50%'),
((SELECT id FROM tipos_incapacidad WHERE codigo='AT'),1,180,100.00,'ARL','Accidente tránsito: ARL paga 100%'),
((SELECT id FROM tipos_incapacidad WHERE codigo='AL'),1,180,100.00,'ARL','Accidente laboral: ARL paga 100%'),
((SELECT id FROM tipos_incapacidad WHERE codigo='LM'),1,126,100.00,'EPS','Maternidad: 18 semanas al 100%'),
((SELECT id FROM tipos_incapacidad WHERE codigo='LP'),1,14,100.00,'EPS','Paternidad: 14 días al 100%');
