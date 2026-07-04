# Barbearia WM — Fechamento de Caixa

Versão sem build: não usa npm, Vite ou package.json. Compatível com Cloudflare Pages + Functions + D1.

## Configuração no Cloudflare Pages

- Build command: deixe vazio
- Build output directory: .
- D1 Binding: DB -> barbearia_wm_db

## Banco D1

Abra D1 > barbearia_wm_db > Console, cole o conteúdo de schema.sql e execute.

## Login inicial

Usuário: admin
Senha: 123456
