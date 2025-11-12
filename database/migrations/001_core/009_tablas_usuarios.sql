USE gestion_incapacidades;

-- Sistema de usuarios, roles y permisos
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    colaborador_id INT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    avatar_url VARCHAR(500),
    esta_activo BOOLEAN DEFAULT TRUE,
    debe_cambiar_password BOOLEAN DEFAULT TRUE,
    intentos_fallidos INT DEFAULT 0,
    fecha_bloqueo TIMESTAMP NULL,
    ultimo_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por INT NULL,
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id),
    FOREIGN KEY (creado_por) REFERENCES usuarios(id),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_activo (esta_activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    nivel_permisos INT DEFAULT 0,
    esta_activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    asignado_por INT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (asignado_por) REFERENCES usuarios(id),
    UNIQUE KEY unique_usuario_rol (usuario_id, rol_id),
    INDEX idx_expiracion (fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permisos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    modulo ENUM('INCAPACIDADES','COLABORADORES','REPORTES','CONFIGURACION','AUDITORIA','DOCUMENTOS','PAGOS') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS roles_permisos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    concedido_por INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id),
    FOREIGN KEY (concedido_por) REFERENCES usuarios(id),
    UNIQUE KEY unique_rol_permiso (rol_id, permiso_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sesiones_usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token_sesion VARCHAR(255) UNIQUE NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    ubicacion VARCHAR(100),
    es_activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token_sesion),
    INDEX idx_expiracion (fecha_expiracion),
    INDEX idx_usuario_activa (usuario_id, es_activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reset_passwords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token VARCHAR(100) UNIQUE NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    utilizado BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expiracion (fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
