# Barbearia WM — Fechamento de Caixa com Cloudflare D1

Sistema web profissional para substituir comandas em papel, registrar serviços/produtos, calcular comissão dos colaboradores e gerar relatórios diário, semanal e mensal.

## Stack

- React + Vite
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare D1
- GitHub para deploy automático

## Login inicial

- Usuário: `admin`
- Senha: `123456`

Altere a senha depois criando outro usuário admin ou editando o registro no D1.

## Como subir no GitHub

1. Crie um repositório: `barbearia-wm-caixa`
2. Envie todos os arquivos deste projeto.
3. No Cloudflare, conecte o repositório em **Workers & Pages > Pages**.

## Configuração do Cloudflare Pages

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## Criar banco D1

No painel Cloudflare:

`Workers & Pages > D1 > Create database`

Nome sugerido:

`barbearia_wm_db`

Depois abra o banco, vá em **Console** e rode o conteúdo do arquivo `schema.sql`.

## Binding do D1

No projeto Pages:

`Settings > Bindings > Add binding > D1 database`

Configure:

- Variable name: `DB`
- Database: `barbearia_wm_db`

O nome `DB` precisa ser exatamente esse, porque as Functions usam `env.DB`.

## Wrangler opcional

O arquivo `wrangler.toml` já está preparado. Troque:

`COLE_AQUI_O_DATABASE_ID_DO_D1`

pelo ID real do banco D1.

## Recursos incluídos

- Login real via D1
- Admin e colaboradores
- Cadastro de colaboradores
- Percentual individual de comissão
- Cadastro de serviços/produtos
- Bebidas sem comissão automaticamente
- Comanda digital
- Formas de pagamento: Pix, Dinheiro, Débito, Crédito
- Relatórios diário, semanal e mensal
- Exportação em PDF pela impressão do navegador
- Layout responsivo para celular, tablet e computador
