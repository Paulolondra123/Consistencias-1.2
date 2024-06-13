create database dde;

use dde;


-- SCRIPT COMPLETO

CREATE TABLE usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombres VARCHAR(150) COLLATE Latin1_General_CS_AS NOT NULL,
    apellidos VARCHAR(150) COLLATE Latin1_General_CS_AS NULL,
    perfil VARCHAR(20) NULL,
    distrito INT NOT NULL,
    usuario VARCHAR(100) COLLATE Latin1_General_CS_AS UNIQUE NOT NULL,
    contraseña VARCHAR(200) COLLATE Latin1_General_CS_AS NOT NULL,
    fecha_registro DATETIME NOT NULL,
    primerlogin BIT DEFAULT 1,
    estado BIT DEFAULT 1
);


INSERT INTO usuario (nombres, apellidos, perfil, distrito, usuario, contraseña, fecha_registro)
VALUES 
('MAURICIO', 'DE LA FUENTE AYALA', 'ADMINISTRADOR', '700', 'MAURI', '$2a$12$MH66.Ob.fy.MnPqmeKLfeOorQBnvHBIT/WATlOYO4Az4uPKwucwy2', CURRENT_TIMESTAMP),
('PAULO CESAR', 'CASTRO LEIGUE', 'DISTRITAL', '701', 'PAULO', '$2a$12$MH66.Ob.fy.MnPqmeKLfeOorQBnvHBIT/WATlOYO4Az4uPKwucwy2', CURRENT_TIMESTAMP),
('NELSON NERY', 'ALCOCER COCA', 'DEPARTAMENTAL', '700', 'NELSON', '$2a$12$MH66.Ob.fy.MnPqmeKLfeOorQBnvHBIT/WATlOYO4Az4uPKwucwy2', CURRENT_TIMESTAMP),

--select * from detalle_venta; 
https://excalidraw.com/#json=o2KbFExsNs0UVapovvnep,6m-Qz7yss8XfzxPTtyx8lg