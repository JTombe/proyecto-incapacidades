USE gestion_incapacidades;

CREATE TABLE IF NOT EXISTS reportes_ausentismo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mes INT NOT NULL,
    año INT NOT NULL,
    total_incapacidades INT DEFAULT 0,
    total_dias_incapacidad INT DEFAULT 0,
    total_colaboradores_afectados INT DEFAULT 0,
    enfermedad_general INT DEFAULT 0,
    accidente_laboral INT DEFAULT 0,
    accidente_transito INT DEFAULT 0,
    licencia_maternidad INT DEFAULT 0,
    licencia_paternidad INT DEFAULT 0,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generado_por INT,
    FOREIGN KEY (generado_por) REFERENCES colaboradores(id),
    UNIQUE KEY unique_mes_año (mes, año)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auditoria_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tabla_afectada VARCHAR(100),
    registro_id INT,
    accion ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    valores_anteriores JSON,
    valores_nuevos JSON,
    descripcion TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NULL, -- inicialmente NULLABLE a mapear después a usuarios
    INDEX idx_tabla_accion (tabla_afectada, accion),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
