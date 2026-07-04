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
  const itensEntrada = b.itens || b.items || [];
  if (!b.cliente || !b.colaborador_id || !itensEntrada.length) {
    return json({ error: 'Cliente, colaborador e itens são obrigatórios.' }, 400);
  }
  const user = await env.DB.prepare(
    `SELECT id, percentual_comissao FROM users WHERE id=? AND ativo=1 AND role='colaborador'`
  ).bind(b.colaborador_id).first();
  if (!user) return json({ error: 'Colaborador inválido. Somente colaboradores podem lançar comandas.' }, 400);

  let totalServicos = 0, totalBebidas = 0, baseComissao = 0;
  const itens = [];
  for (const item of itensEntrada) {
    const serviceId = Number(item.service_id || item.id || 0);
    const qtd = Math.max(1, Number(item.qtd || 1));
    if (!serviceId) continue;
    const svc = await env.DB.prepare('SELECT id,nome,preco,tipo,comissionavel FROM services WHERE id=? AND ativo=1').bind(serviceId).first();
    if (!svc) continue;
    const valorUnit = Number(svc.preco || 0);
    const valorTotal = valorUnit * qtd;
    const tipo = svc.tipo === 'servico' ? 'servico' : (svc.tipo || 'produto');
    const comissionavel = Number(svc.comissionavel || 0);
    if (tipo === 'servico') totalServicos += valorTotal; else totalBebidas += valorTotal;
    if (comissionavel === 1) baseComissao += valorTotal;
    itens.push({ service_id: svc.id, descricao: svc.nome, valor: valorTotal, tipo, comissionavel, qtd });
  }
  if (!itens.length) return json({ error: 'Selecione pelo menos um serviço/produto válido.' }, 400);

  const totalGeral = totalServicos + totalBebidas;
  const percentual = Number(user.percentual_comissao || 50);
  const comissao = baseComissao * percentual / 100;
  const r = await env.DB.prepare(
    `INSERT INTO comandas
     (cliente,colaborador_id,forma_pagamento,total_servicos,total_bebidas,total_geral,base_comissao,percentual_comissao,valor_comissao)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).bind(b.cliente.trim(), b.colaborador_id, b.forma_pagamento || 'Pix', totalServicos, totalBebidas, totalGeral, baseComissao, percentual, comissao).run();
  const id = r.meta.last_row_id;
  for (const item of itens) {
    await env.DB.prepare(
      'INSERT INTO comanda_items (comanda_id,service_id,descricao,valor,tipo,comissionavel) VALUES (?,?,?,?,?,?)'
    ).bind(id, item.service_id, `${item.descricao} x${item.qtd}`, item.valor, item.tipo, item.comissionavel).run();
  }
  return json({ ok: true, id, total_geral: totalGeral, valor_comissao: comissao }, 201);
}

export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('mode');
  const id = Number(url.searchParams.get('id'));
  if (mode === 'all') {
    await env.DB.prepare('DELETE FROM comanda_items').run();
    await env.DB.prepare('DELETE FROM comandas').run();
    return json({ ok: true, cleared: 'all' });
  }
  if (!id) return json({ error: 'ID obrigatório.' }, 400);
  await env.DB.prepare('DELETE FROM comanda_items WHERE comanda_id=?').bind(id).run();
  await env.DB.prepare('DELETE FROM comandas WHERE id=?').bind(id).run();
  return json({ ok: true });
}
