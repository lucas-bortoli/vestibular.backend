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
  dataNascimento DATE NOT NULL,
  provaOnline BOOLEAN NOT NULL,
  cursoId INTEGER NOT NULL,
  FOREIGN KEY (cursoId) REFERENCES curso (id)
);

CREATE INDEX Post_ix_categoryId ON Post (categoryId);

INSERT INTO
  Category (id, name)
VALUES
  (1, 'Test');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE participante;

DROP TABLE curso;

DROP TABLE campus;