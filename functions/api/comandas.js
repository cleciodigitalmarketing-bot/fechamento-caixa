import { json, readJson } from './_utils.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT c.*, u.nome colaborador
     FROM comandas c
     JOIN users u ON u.id=c.colaborador_id
     ORDER BY c.created_at DESC
     LIMIT 100`
  ).all();
  return json({ items: results || [] });
}

export async function onRequestPost({ request, env }) {
  const b = await readJson(request);
  const itens = b.itens || b.items || [];

  if (!b.cliente || !b.colaborador_id || !itens.length) {
    return json({ error: 'Cliente, colaborador e itens são obrigatórios.' }, 400);
  }

  const user = await env.DB.prepare(
    'SELECT percentual_comissao FROM users WHERE id=? AND ativo=1'
  ).bind(b.colaborador_id).first();

  if (!user) return json({ error: 'Colaborador inválido.' }, 400);

  let totalServicos = 0;
  let totalBebidas = 0;
  let baseComissao = 0;

  for (const item of itens) {
    const valor = Number(item.valor || 0);
    const tipo = item.tipo === 'bebida' ? 'bebida' : 'servico';
    const comissionavel = Number(item.comissionavel ?? (tipo === 'bebida' ? 0 : 1));

    if (tipo === 'bebida') totalBebidas += valor;
    else totalServicos += valor;

    if (comissionavel === 1) baseComissao += valor;
  }

  const totalGeral = totalServicos + totalBebidas;
  const percentual = Number(user.percentual_comissao || 50);
  const comissao = baseComissao * percentual / 100;

  const r = await env.DB.prepare(
    `INSERT INTO comandas
     (cliente,colaborador_id,forma_pagamento,total_servicos,total_bebidas,total_geral,base_comissao,percentual_comissao,valor_comissao)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).bind(
    b.cliente.trim(),
    b.colaborador_id,
    b.forma_pagamento || 'Pix',
    totalServicos,
    totalBebidas,
    totalGeral,
    baseComissao,
    percentual,
    comissao
  ).run();

  const id = r.meta.last_row_id;

  for (const item of itens) {
    const tipo = item.tipo === 'bebida' ? 'bebida' : 'servico';
    const comissionavel = Number(item.comissionavel ?? (tipo === 'bebida' ? 0 : 1));
    await env.DB.prepare(
      'INSERT INTO comanda_items (comanda_id,service_id,descricao,valor,tipo,comissionavel) VALUES (?,?,?,?,?,?)'
    ).bind(
      id,
      item.service_id || null,
      item.descricao || 'Item',
      Number(item.valor || 0),
      tipo,
      comissionavel
    ).run();
  }

  return json({ ok: true, id, total_geral: totalGeral, valor_comissao: comissao }, 201);
}
