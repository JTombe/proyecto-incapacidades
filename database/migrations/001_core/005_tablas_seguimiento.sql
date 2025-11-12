USE gestion_incapacidades;

-- Tabla historial_estados
CREATE TABLE IF NOT EXISTS historial_estados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incapacidad_id INT NOT NULL,
    estado_id INT NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cambiado_por INT,
    FOREIGN KEY (incapacidad_id) REFERENCES incapacidades(id) ON DELETE CASCADE,
    FOREIGN KEY (estado_id) REFERENCES estados_incapacidad(id),
    FOREIGN KEY (cambiado_por) REFERENCES colaboradores(id),
    INDEX idx_incapacidad_fecha (incapacidad_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla seguimiento_transcripcion
CREATE TABLE IF NOT EXISTS seguimiento_transcripcion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incapacidad_id INT NOT NULL,
    eps_id INT NOT NULL,
    fecha_radicacion DATE NOT NULL,
    numero_radicado VARCHAR(100),
    fecha_vencimiento DATE,
    estado ENUM('RADICADA','EN_PROCESO','APROBADA','RECHAZADA','PAGADA') DEFAULT 'RADICADA',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (incapacidad_id) REFERENCES incapacidades(id) ON DELETE CASCADE,
    FOREIGN KEY (eps_id) REFERENCES eps(id),
    UNIQUE KEY unique_incapacidad_eps (incapacidad_id, eps_id),
    INDEX idx_estado_vencimiento (estado, fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
