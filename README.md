# Barbearia WM - Fechamento de Caixa Digital

Versão atualizada para Cloudflare Pages + Cloudflare D1, sem npm e sem build.

## Configuração no Cloudflare Pages

- Build command: deixe vazio
- Build output directory: .
- D1 Binding: DB apontando para o banco `barbearia_wm_db`

## Banco D1

Rode o arquivo `schema.sql` no Console do D1 se estiver instalando do zero.

Login inicial:
- usuário: admin
- senha: 123456

## Atualizações desta versão

- Comanda liberada somente para colaboradores.
- Administrador cadastra, edita e remove serviços/produtos.
- Colaborador não digita valor de serviço; o valor vem do cadastro do administrador.
- Produtos e bebidas ficam fora da comissão automaticamente.
- Administrador pode limpar ranking e últimas comandas apagando os registros de comandas.
- Relatórios diário, semanal e mensal com produtividade por colaborador.
- Relatório para PDF/impressão com logo da barbearia.
- Layout escuro premium com detalhes dourados e identidade visual de barbearia.
