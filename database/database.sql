CREATE DATABASE `backend`;

-- Definición de la tabla formapago
CREATE TABLE `formapago` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Definición de la tabla rol
CREATE TABLE `rol` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Definición de la tabla usuario
CREATE TABLE `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(100),
  `password` VARCHAR(100),
  `rolId` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `usuario_rol_FK` FOREIGN KEY (`rolId`) REFERENCES `rol` (`id`)
) ENGINE=InnoDB;

-- Definición de la tabla login
CREATE TABLE `login` (
  `usuarioId` INT,
  `fecha` DATETIME NOT NULL,
  KEY `login_usuario_FK` (`usuarioId`),
  CONSTRAINT `login_usuario_FK` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB;

-- Definición de la tabla pago
CREATE TABLE `pago` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fechaCarga` DATE NOT NULL,
  `fechaPago` DATE NOT NULL,
  `descripcion` VARCHAR(100),
  `registradoPor` INT NOT NULL,
  `formaPagoId` INT NOT NULL,
  `usuarioId` INT NOT NULL,
  `recibo` VARCHAR(255),
  `monto` FLOAT NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `pagos_usuario_FK` FOREIGN KEY (`registradoPor`) REFERENCES `usuario` (`id`),
  CONSTRAINT `pagos_formapago_FK` FOREIGN KEY (`formaPagoId`) REFERENCES `formapago` (`id`),
  CONSTRAINT `pago_usuario_FK` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB;

-- Inserciones iniciales en la tabla rol
INSERT INTO `rol` (`nombre`) VALUES
  ('Rol Estandar'),
  ('Rol Admin'),
  ('Rol SuperAdmin');

-- Inserciones iniciales en la tabla formapago
INSERT INTO `formapago` (`descripcion`) VALUES
  ('Efectivo'),
  ('Transferencia'),
  ('Tarjeta Credito');

-- Inserciones iniciales en la tabla usuario
INSERT INTO `usuario` (`nombre`, `correo`, `password`, `rolId`) VALUES
  ('DavidLopez', 'davidlopez@gmail.com', '$2b$12$OgxEd.CXL0p1z1O7FLKC4u5GmvevSQtMdP8tB0gV3DLzI2aDF.p7a', 1),
  ('ElenaMartinez', 'elenamartinez@gmail.com', '$2b$12$mWGA8xBZ0yp2pJkDYgo1TOWDsY8MsElefhAhpZc5dNf4cRENAlmvi', 2);

-- Inserciones iniciales en la tabla pago
INSERT INTO `pago` (`fechaCarga`, `fechaPago`, `descripcion`, `registradoPor`, `formaPagoId`, `usuarioId`, `recibo`, `monto`, `activo`) VALUES
  ('2024-09-10', '2024-09-11', 'Pago Todos', 2, 1, 2, 'efd3b4f0-f0e5-4a18-a607-c0ee5b41b2ab.pdf', 0.0, 0),
  ('2024-09-10', '2024-09-11', 'Pago Elena', 2, 1, 3, '2ba35e57-7ed1-44bb-88e5-66c23c81cd37.pdf', 5000.0, 1),
  ('2024-09-10', '2024-09-11', 'Pago Elena 2', 2, 2, 3, NULL, 25000.0, 0);
