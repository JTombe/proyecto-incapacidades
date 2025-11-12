USE gestion_incapacidades;

-- Tabla de colaboradores/empleados
CREATE TABLE IF NOT EXISTS colaboradores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_identificacion VARCHAR(50) UNIQUE NOT NULL,
    tipo_identificacion ENUM('CC','CE','TI','PASAPORTE') DEFAULT 'CC',
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    fecha_ingreso DATE NOT NULL,
    salario_base DECIMAL(12,2) NOT NULL,
    ibc DECIMAL(12,2) NOT NULL,
    eps_id INT NOT NULL,
    arl_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (eps_id) REFERENCES eps(id),
    FOREIGN KEY (arl_id) REFERENCES arl(id),
    INDEX idx_identificacion (numero_identificacion),
    INDEX idx_eps (eps_id),
    INDEX idx_arl (arl_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
