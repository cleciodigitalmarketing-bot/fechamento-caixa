import { json, readJson } from './_utils.js';
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(`SELECT c.*, u.nome colaborador FROM comandas c JOIN users u ON u.id=c.colaborador_id ORDER BY c.created_at DESC LIMIT 100`).all();
  return json({ comandas: results });
}
export async function onRequestPost({ request, env }) {
  const b = await readJson(request);
  if (!b.cliente || !b.colaborador_id || !b.itens?.length) return json({ error: 'Cliente, colaborador e itens são obrigatórios.' }, 400);
  const user = await env.DB.prepare('SELECT percentual_comissao FROM users WHERE id=? AND ativo=1').bind(b.colaborador_id).first();
  if (!user) return json({ error: 'Colaborador inválido.' }, 400);
  let totalServicos=0,totalBebidas=0,baseComissao=0;
  for (const item of b.itens) {
    const valor = Number(item.valor || 0);
    if (item.tipo === 'bebida') totalBebidas += valor; else totalServicos += valor;
    if (Number(item.comissionavel) === 1) baseComissao += valor;
  }
  const totalGeral = totalServicos + totalBebidas;
  const percentual = Number(user.percentual_comissao || 50);
  const comissao = baseComissao * percentual / 100;
  const r = await env.DB.prepare(`INSERT INTO comandas (cliente,colaborador_id,forma_pagamento,total_servicos,total_bebidas,total_geral,base_comissao,percentual_comissao,valor_comissao) VALUES (?,?,?,?,?,?,?,?,?)`)
    .bind(b.cliente, b.colaborador_id, b.forma_pagamento || 'Pix', totalServicos, totalBebidas, totalGeral, baseComissao, percentual, comissao).run();
  const id = r.meta.last_row_id;
  for (const item of b.itens) {
    await env.DB.prepare('INSERT INTO comanda_items (comanda_id,service_id,descricao,valor,tipo,comissionavel) VALUES (?,?,?,?,?,?)')
      .bind(id, item.service_id || null, item.descricao, Number(item.valor || 0), item.tipo || 'servico', Number(item.comissionavel ?? 1)).run();
  }
  return json({ ok:true, id, total_geral: totalGeral, valor_comissao: comissao }, 201);
}
