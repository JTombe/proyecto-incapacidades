USE gestion_incapacidades;

CREATE TABLE IF NOT EXISTS gestion_cobro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incapacidad_id INT NOT NULL,
    tipo_gestion ENUM('REQUERIMIENTO','DERECHO_PETICION','TUTELA','ACUERDO_PAGO') NOT NULL,
    fecha_gestion DATE NOT NULL,
    descripcion TEXT NOT NULL,
    respuesta_entidad TEXT,
    fecha_respuesta DATE,
    fecha_vencimiento DATE,
    estado ENUM('PENDIENTE','RESPONDIDO','ACEPTADO','RECHAZADO','ESCALADO') DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gestionado_por INT,
    FOREIGN KEY (incapacidad_id) REFERENCES incapacidades(id) ON DELETE CASCADE,
    FOREIGN KEY (gestionado_por) REFERENCES colaboradores(id),
    INDEX idx_estado_vencimiento (estado, fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS casos_juridicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incapacidad_id INT NOT NULL,
    gestion_cobro_id INT,
    fecha_escalamiento DATE NOT NULL,
    motivo_escalamiento TEXT NOT NULL,
    abogado_asignado VARCHAR(100),
    estado ENUM('ASIGNADO','EN_TRAMITE','RESUELTO','ARCHIVADO') DEFAULT 'ASIGNADO',
    resultado TEXT,
    fecha_resolucion DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incapacidad_id) REFERENCES incapacidades(id) ON DELETE CASCADE,
    FOREIGN KEY (gestion_cobro_id) REFERENCES gestion_cobro(id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
