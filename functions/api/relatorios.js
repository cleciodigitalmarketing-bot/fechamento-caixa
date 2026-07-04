import { json, rangeFrom } from './_utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const periodo = url.searchParams.get('periodo') || 'dia';
  const { inicio, fim } = rangeFrom(periodo);

  const totais = await env.DB.prepare(
    `SELECT
      COUNT(*) qtd,
      COALESCE(SUM(total_geral),0) total_geral,
      COALESCE(SUM(total_servicos),0) total_servicos,
      COALESCE(SUM(total_bebidas),0) total_bebidas,
      COALESCE(SUM(valor_comissao),0) valor_comissao,
      COALESCE(SUM(total_geral-valor_comissao),0) valor_empresa
     FROM comandas
     WHERE created_at BETWEEN ? AND ?`
  ).bind(inicio, fim).first();

  const porColaborador = await env.DB.prepare(
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
     WHERE c.created_at BETWEEN ? AND ?
     GROUP BY u.id,u.nome
     ORDER BY total_geral DESC`
  ).bind(inicio, fim).all();

  const comandas = await env.DB.prepare(
    `SELECT c.*, u.nome colaborador
     FROM comandas c
     JOIN users u ON u.id=c.colaborador_id
     WHERE c.created_at BETWEEN ? AND ?
     ORDER BY c.created_at DESC
     LIMIT 30`
  ).bind(inicio, fim).all();

  const pagamentos = await env.DB.prepare(
    `SELECT forma_pagamento, COALESCE(SUM(total_geral),0) total
     FROM comandas
     WHERE created_at BETWEEN ? AND ?
     GROUP BY forma_pagamento`
  ).bind(inicio, fim).all();

  return json({
    periodo,
    inicio,
    fim,
    totais: totais || {},
    por_colaborador: porColaborador.results || [],
    comandas: comandas.results || [],
    pagamentos: pagamentos.results || []
  });
}
