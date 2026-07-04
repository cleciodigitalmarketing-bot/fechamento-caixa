# Barbearia WM — Fechamento de Caixa

Sistema web responsivo para comandas digitais, fechamento de caixa e relatórios com **GitHub + Cloudflare Pages + Cloudflare D1**.

## Login inicial

- Usuário: `admin`
- Senha: `123456`

## Configuração no Cloudflare

### 1. Banco D1

Banco configurado no projeto:

```txt
Nome: barbearia_wm_db
Database ID: a8267258-8a0c-408f-8e62-0ffd54acbf09
Binding: DB
```

### 2. Criar as tabelas

No Cloudflare, entre em:

```txt
Storage & databases → D1 SQLite Database → barbearia_wm_db → Console
```

Cole todo o conteúdo do arquivo `schema.sql` e clique em **Execute**.

### 3. Deploy no Cloudflare Pages

No Cloudflare Pages, conecte o repositório do GitHub e use:

```txt
Build command: npm run build
Build output directory: dist
```

O arquivo `wrangler.toml` já está configurado com o D1.

## Funções incluídas

- Login de administrador e colaborador
- Cadastro de colaboradores
- Percentual de comissão individual
- Cadastro de serviços e bebidas
- Comanda digital
- Bebidas fora da comissão
- Relatórios diário, semanal e mensal
- Exportação para PDF usando impressão do navegador
- Layout responsivo para celular, tablet e computador

## Observação importante

Após rodar o `schema.sql`, o painel D1 deve mostrar as tabelas criadas. Se o login não funcionar, confira se o `schema.sql` foi executado no banco correto.
