import { json, rangeFrom } from './_utils.js';
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const periodo = url.searchParams.get('periodo') || 'dia';
  const { inicio, fim } = rangeFrom(periodo);
  const total = await env.DB.prepare(`SELECT COUNT(*) atendimentos, COALESCE(SUM(total_geral),0) faturamento, COALESCE(SUM(total_bebidas),0) bebidas, COALESCE(SUM(valor_comissao),0) comissoes FROM comandas WHERE created_at BETWEEN ? AND ?`).bind(inicio, fim).first();
  const { results } = await env.DB.prepare(`SELECT u.nome colaborador, COUNT(c.id) atendimentos, COALESCE(SUM(c.total_geral),0) faturamento, COALESCE(SUM(c.total_bebidas),0) bebidas, COALESCE(SUM(c.base_comissao),0) base_comissao, COALESCE(SUM(c.valor_comissao),0) comissao, COALESCE(SUM(c.total_geral-c.valor_comissao),0) empresa FROM comandas c JOIN users u ON u.id=c.colaborador_id WHERE c.created_at BETWEEN ? AND ? GROUP BY u.id,u.nome ORDER BY faturamento DESC`).bind(inicio, fim).all();
  const pagamentos = await env.DB.prepare(`SELECT forma_pagamento, COALESCE(SUM(total_geral),0) total FROM comandas WHERE created_at BETWEEN ? AND ? GROUP BY forma_pagamento`).bind(inicio, fim).all();
  return json({ periodo, inicio, fim, total, colaboradores: results, pagamentos: pagamentos.results });
}
