# Correção do deploy Cloudflare Pages

Esta versão remove o `package-lock.json` para evitar o erro `npm error Exit handler never called!` que ocorreu com `npm clean-install` no ambiente Node 22/npm 10 do Cloudflare.

Configuração recomendada no Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node version: `20`

Em Settings > Environment variables, adicione:

- Variable name: `NODE_VERSION`
- Value: `20`

O D1 deve estar vinculado em Settings > Bindings:

- Type: D1 database
- Name: `DB`
- Value: `barbearia_wm_db`
