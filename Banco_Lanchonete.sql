CREATE DATABASE IF NOT EXISTS lanchonete
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE lanchonete;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20)
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE lanches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    id_categoria INT,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

CREATE TABLE ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    preco_adicional DECIMAL(10,2) DEFAULT 0.00,
    imagem VARCHAR(255),
    disponivel BOOLEAN DEFAULT TRUE
);

CREATE TABLE lanche_ingredientes (
    id_lanche INT NOT NULL,
    id_ingrediente INT NOT NULL,
    obrigatorio BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_lanche, id_ingrediente),
    FOREIGN KEY (id_lanche) REFERENCES lanches(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE
);
