# Barbearia WM — Fechamento de Caixa Digital

Versão corrigida para **GitHub + Cloudflare Pages + Cloudflare D1**, sem npm, sem Vite e sem build.

## Importante antes de subir no GitHub

Limpe o repositório antes de enviar esta versão. Remova arquivos antigos como:

- `package.json`
- `package-lock.json`
- `vite.config.js`
- pasta `src`
- pasta `dist`
- `node_modules`

Deixe apenas estes arquivos/pastas desta versão:

- `index.html`
- `assets/`
- `functions/`
- `schema.sql`
- `wrangler.toml`
- `README.md`
- `.gitignore`

## Configuração no Cloudflare Pages

- Build command: deixe vazio
- Build output directory: `.`
- Binding D1: `DB` apontando para `barbearia_wm_db`

O `wrangler.toml` já está com o D1 ID:

```txt
a8267258-8a0c-408f-8e62-0ffd54acbf09
```

## Banco D1

No painel Cloudflare:

D1 SQLite Database → `barbearia_wm_db` → Console

Cole todo o conteúdo do arquivo `schema.sql` e clique em **Execute**.

## Login inicial

Usuário: `admin`
Senha: `123456`

## O que o sistema faz

- Login de administrador e colaborador
- Cadastro de colaboradores
- Cadastro de serviços e bebidas
- Comanda digital
- Cálculo automático de comissão
- Bebidas/produtos sem comissão
- Relatório diário, semanal e mensal
- Exportação PDF pela opção imprimir
