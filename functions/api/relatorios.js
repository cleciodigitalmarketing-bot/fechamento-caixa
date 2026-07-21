import { json, rangeFrom } from './_utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const periodo = url.searchParams.get('periodo') || 'dia';
  const colaboradorId = Number(url.searchParams.get('colaborador_id') || 0);
  const { inicio, fim } = rangeFrom(periodo);
  const filtro = colaboradorId ? ' AND c.colaborador_id = ?' : '';
  const bind = (stmt) => colaboradorId ? stmt.bind(inicio, fim, colaboradorId) : stmt.bind(inicio, fim);

  const totais = await bind(env.DB.prepare(
    `SELECT
      COUNT(*) qtd,
      COALESCE(SUM(c.total_geral),0) total_geral,
      COALESCE(SUM(c.total_servicos),0) total_servicos,
      COALESCE(SUM(c.total_bebidas),0) total_bebidas,
      COALESCE(SUM(c.valor_comissao),0) valor_comissao,
      COALESCE(SUM(c.total_geral-c.valor_comissao),0) valor_empresa
     FROM comandas c
     WHERE c.created_at BETWEEN ? AND ?${filtro}`
  )).first();

  const porColaborador = await bind(env.DB.prepare(
    `SELECT
      u.nome colaborador,
      COUNT(c.id) qtd,
      COALESCE(SUM(c.total_geral),0) total_geral,
      COALESCE(SUM(c.total_servicos),0) total_servicos,
      COALESCE(SUM(c.total_bebidas),0) total_bebidas,
      COALESCE(SUM(c.base_comissao),0) base_comissao,
      COALESCE(SUM(c.valor_comissao),0) valor_comissao,
      COALESCE(SUM(c.total_geral-c.valor_comissao),0) valor_empresa
     FROM comandas c
     JOIN users u ON u.id=c.colaborador_id
     WHERE c.created_at BETWEEN ? AND ?${filtro}
     GROUP BY u.id,u.nome
     ORDER BY total_geral DESC`
  )).all();

  const comandas = await bind(env.DB.prepare(
    `SELECT c.*, u.nome colaborador
     FROM comandas c
     JOIN users u ON u.id=c.colaborador_id
     WHERE c.created_at BETWEEN ? AND ?${filtro}
     ORDER BY c.created_at DESC
     LIMIT 100`
  )).all();

  const detalhes = await bind(env.DB.prepare(
    `SELECT
       c.id comanda_id,
       c.cliente,
       c.forma_pagamento,
       c.created_at,
       u.nome colaborador,
       ci.descricao servico,
       ci.valor valor_servico,
       ci.tipo
     FROM comandas c
     JOIN users u ON u.id=c.colaborador_id
     JOIN comanda_items ci ON ci.comanda_id=c.id
     WHERE c.created_at BETWEEN ? AND ?${filtro}
     ORDER BY c.created_at DESC, ci.id ASC`
  )).all();

  const pagamentos = await bind(env.DB.prepare(
    `SELECT c.forma_pagamento, COALESCE(SUM(c.total_geral),0) total
     FROM comandas c
     WHERE c.created_at BETWEEN ? AND ?${filtro}
     GROUP BY c.forma_pagamento`
  )).all();

  return json({
    periodo,
    inicio,
    fim,
    totais: totais || {},
    por_colaborador: porColaborador.results || [],
    comandas: comandas.results || [],
    detalhes: detalhes.results || [],
    pagamentos: pagamentos.results || []
  });
}
