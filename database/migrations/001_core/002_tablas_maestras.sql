USE gestion_incapacidades;

-- Tabla de EPS
CREATE TABLE IF NOT EXISTS eps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    nit VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(100),
    direccion TEXT,
    contacto_principal VARCHAR(100),
    tiempo_transcripcion_dias INT DEFAULT 360,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de ARL
CREATE TABLE IF NOT EXISTS arl (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    nit VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabla de tipos de incapacidad
CREATE TABLE IF NOT EXISTS tipos_incapacidad (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    requiere_epicrisis BOOLEAN DEFAULT FALSE,
    requiere_furips BOOLEAN DEFAULT FALSE,
    dias_minimo_epicrisis INT DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de estados de incapacidad
CREATE TABLE IF NOT EXISTS estados_incapacidad (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    es_estado_final BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de incapacidades 
CREATE TABLE IF NOT EXISTS incapacidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    tipo_incapacidad_id INT NOT NULL,
    estado_incapacidad_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_incapacidad INT GENERATED ALWAYS AS (DATEDIFF(fecha_fin, fecha_inicio) + 1) STORED,
    diagnostico VARCHAR(255),
    descripcion TEXT,
    observaciones TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tipo_incapacidad_id) REFERENCES tipos_incapacidad(id),
    FOREIGN KEY (estado_incapacidad_id) REFERENCES estados_incapacidad(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;