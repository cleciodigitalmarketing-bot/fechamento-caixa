# Ajuste de Histórico e Relatórios

## Alterações realizadas

- Criada a aba **Histórico**, disponível para administrador e colaborador.
- O histórico agora exibe, por item da comanda:
  - data;
  - horário;
  - cliente;
  - colaborador;
  - serviço, produto ou bebida;
  - valor do item;
  - forma de pagamento.
- A aba **Relatórios** agora fica disponível para administrador e colaborador.
- Relatórios diário, semanal e mensal passaram a incluir uma tabela detalhada de serviços executados.
- O administrador visualiza os registros de todos os colaboradores.
- O colaborador visualiza apenas os próprios registros e totais.
- Os dados e resumos que já existiam foram mantidos.
- As tabelas receberam rolagem horizontal para melhorar a visualização em celulares.

## Banco de dados

Este ajuste não exige alteração no schema existente, pois utiliza as tabelas `comandas` e `comanda_items` já presentes no projeto.
