--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE campus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(64) NOT NULL
);

CREATE TABLE curso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(64) NOT NULL,
  campusId INTEGER NOT NULL,
  FOREIGN KEY (campusId) REFERENCES campus (id)
);

CREATE TABLE participante (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(64) NOT NULL,
  email VARCHAR(64) UNIQUE NOT NULL,
  cpf VARCHAR(64) UNIQUE NOT NULL,
  telefone VARCHAR(64) UNIQUE NOT NULL,
  dataNascimento DATE NOT NULL,
  provaOnline BOOLEAN NOT NULL,
  cursoId INTEGER NOT NULL,
  FOREIGN KEY (cursoId) REFERENCES curso (id)
);

CREATE TABLE usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(64) NOT NULL,
  roles TEXT NOT NULL,
  username VARCHAR(32) UNIQUE NOT NULL,
  hash_senha TEXT NOT NULL,
  senha_salt TEXT NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE participante;

DROP TABLE curso;

DROP TABLE campus;

DROP TABLE usuario;