USE gestion_incapacidades;

CREATE INDEX IF NOT EXISTS idx_incapacidades_fechas ON incapacidades(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos_incapacidades(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_gestion_cobro_estado ON gestion_cobro(estado, fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_sistema(created_at);
