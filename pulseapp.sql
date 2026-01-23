DROP DATABASE IF EXISTS pulseapp;
CREATE DATABASE pulseapp;
USE pulseapp;

SET FOREIGN_KEY_CHECKS = 0;

/* ROLES */
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO roles (id, nombre) VALUES
(1, 'admin'),
(2, 'tecnico'),
(3, 'usuario');

/* USUARIOS */
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(120) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

/* INCIDENCIAS */
CREATE TABLE incidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,

    usuario_id INT NOT NULL,
    tecnico_id INT DEFAULT NULL,

    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(100),
    prioridad ENUM('Baja','Media','Alta') DEFAULT 'Media',

    estadoInternet VARCHAR(100),
    lucesOnt VARCHAR(150),
    revisionCable VARCHAR(150),
    contrato VARCHAR(60),

    resumen TEXT,
    detalle TEXT,

    estado ENUM('Pendiente','En proceso','Cerrada') DEFAULT 'Pendiente',

    fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

/* HISTORIAL */
CREATE TABLE incidencia_historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incidencia_id INT NOT NULL,
    tecnico_id INT DEFAULT NULL,
    descripcion TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

/* RECUPERACIÓN CLAVE */
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiracion DATETIME NOT NULL
);

SET FOREIGN_KEY_CHECKS = 1;