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

CREATE TABLE notas (
  participanteId INTEGER PRIMARY KEY,
  notas TEXT NOT NULL,
  FOREIGN KEY (participanteId) REFERENCES participante (id)
);

CREATE TABLE redacoes (
  participanteId INTEGER PRIMARY KEY,
  corpo TEXT NOT NULL,
  inicioTimestamp BIGINT NOT NULL,
  fimTimestamp BIGINT NOT NULL,
  concluido BOOLEAN NOT NULL,
  FOREIGN KEY (participanteId) REFERENCES participante (id)
);

CREATE TABLE config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  processoSeletivoInicioUnix BIGINT NOT NULL,
  processoSeletivoFimUnix BIGINT NOT NULL,
  processoSeletivoDescricaoHtml TEXT NOT NULL,
  smtpHost TEXT NOT NULL,
  smtpPort INTEGER NOT NULL,
  smtpUser TEXT NOT NULL,
  smtpPassword TEXT NOT NULL,
  smtpSecure BOOLEAN NOT NULL,
  smtpSenderAddress TEXT NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE notas;

DROP TABLE participante;

DROP TABLE curso;

DROP TABLE campus;

DROP TABLE usuario;

DROP TABLE config;