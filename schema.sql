DROP TABLE IF EXISTS comanda_items;
DROP TABLE IF EXISTS comandas;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  usuario TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'colaborador',
  percentual_comissao REAL NOT NULL DEFAULT 50,
  ativo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL DEFAULT 0,
  tipo TEXT NOT NULL DEFAULT 'servico',
  comissionavel INTEGER NOT NULL DEFAULT 1,
  ativo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comandas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente TEXT NOT NULL,
  colaborador_id INTEGER NOT NULL,
  forma_pagamento TEXT NOT NULL,
  total_servicos REAL NOT NULL DEFAULT 0,
  total_bebidas REAL NOT NULL DEFAULT 0,
  total_geral REAL NOT NULL DEFAULT 0,
  base_comissao REAL NOT NULL DEFAULT 0,
  percentual_comissao REAL NOT NULL DEFAULT 50,
  valor_comissao REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (colaborador_id) REFERENCES users(id)
);

CREATE TABLE comanda_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comanda_id INTEGER NOT NULL,
  service_id INTEGER,
  descricao TEXT NOT NULL,
  valor REAL NOT NULL DEFAULT 0,
  tipo TEXT NOT NULL DEFAULT 'servico',
  comissionavel INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (comanda_id) REFERENCES comandas(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

INSERT INTO users (nome, usuario, senha_hash, role, percentual_comissao, ativo) VALUES
('Administrador WM', 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'admin', 50, 1);

INSERT INTO services (nome, preco, tipo, comissionavel, ativo) VALUES
('Corte Tesoura', 0, 'servico', 1, 1),
('Corte Social', 0, 'servico', 1, 1),
('Corte Militar', 0, 'servico', 1, 1),
('Degradê', 0, 'servico', 1, 1),
('Navalhado', 0, 'servico', 1, 1),
('Combo Barba + Corte Degradê', 0, 'servico', 1, 1),
('Combo Barba + Corte Navalhado', 0, 'servico', 1, 1),
('Combo Corte + Barba + Sobrancelha + Limpeza Facial', 0, 'servico', 1, 1),
('Combo Corte + Hidratação + Barba + Sobrancelha + Limpeza Facial', 0, 'servico', 1, 1),
('Sobrancelha', 0, 'servico', 1, 1),
('Barba', 0, 'servico', 1, 1),
('Luzes', 0, 'servico', 1, 1),
('Pigmentação', 0, 'servico', 1, 1),
('Platinado', 0, 'servico', 1, 1),
('Bebidas', 0, 'bebida', 0, 1);
