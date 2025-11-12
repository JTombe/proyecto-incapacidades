USE gestion_incapacidades;

-- Tabla pagos_incapacidades
CREATE TABLE IF NOT EXISTS pagos_incapacidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incapacidad_id INT NOT NULL,
    entidad_pagadora_id INT NOT NULL,
    tipo_entidad ENUM('EPS','ARL') NOT NULL,
    numero_factura VARCHAR(100),
    fecha_pago DATE NOT NULL,
    valor_pagado DECIMAL(12,2) NOT NULL,
    dias_cubiertos INT NOT NULL,
    numero_transaccion VARCHAR(100),
    cuenta_destino VARCHAR(50),
    fecha_conciliacion DATE,
    conciliado_por INT,
    observaciones_conciliacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT,
    FOREIGN KEY (incapacidad_id) REFERENCES incapacidades(id),
    FOREIGN KEY (entidad_pagadora_id) REFERENCES eps(id),
    FOREIGN KEY (conciliado_por) REFERENCES colaboradores(id),
    FOREIGN KEY (registrado_por) REFERENCES colaboradores(id),
    INDEX idx_fecha_pago (fecha_pago),
    INDEX idx_conciliacion (fecha_conciliacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla configuracion_porcentajes
CREATE TABLE IF NOT EXISTS configuracion_porcentajes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_incapacidad_id INT NOT NULL,
    desde_dia INT NOT NULL,
    hasta_dia INT,
    porcentaje DECIMAL(5,2) NOT NULL,
    responsable ENUM('EMPRESA','EPS','ARL','FONDO_PENSIONES') NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_incapacidad_id) REFERENCES tipos_incapacidad(id),
    INDEX idx_tipo_dias (tipo_incapacidad_id, desde_dia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
