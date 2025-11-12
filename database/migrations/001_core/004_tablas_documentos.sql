USE gestion_incapacidades;

-- Tabla documentos
CREATE TABLE IF NOT EXISTS documentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incapacidad_id INT NOT NULL,
    tipo_documento ENUM(
        'INCAPACIDAD','EPICRISIS','FURIPS','HISTORIA_CLINICA',
        'CERTIFICADO_NACIMIENTO','REGISTRO_CIVIL','OTRO'
    ) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_almacenamiento VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    tamaño_bytes BIGINT,
    fecha_documento DATE,
    numero_documento VARCHAR(100),
    entidad_emisora VARCHAR(100),
    es_confidencial BOOLEAN DEFAULT FALSE,
    hash_archivo VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subido_por INT NULL,
    FOREIGN KEY (incapacidad_id)
        REFERENCES incapacidades(id)
        ON DELETE CASCADE,
    INDEX idx_incapacidad_tipo (incapacidad_id, tipo_documento),
    INDEX idx_confidencial (es_confidencial)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;