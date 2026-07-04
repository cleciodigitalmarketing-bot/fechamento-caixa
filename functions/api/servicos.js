import { json, readJson } from './_utils.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM services WHERE ativo=1 ORDER BY tipo,nome'
  ).all();
  return json({ items: results || [] });
}

export async function onRequestPost({ request, env }) {
  const b = await readJson(request);
  if (!b.nome) return json({ error: 'Nome obrigatório.' }, 400);
  const tipo = b.tipo === 'produto' || b.tipo === 'bebida' ? b.tipo : 'servico';
  const comissionavel = tipo === 'servico' ? 1 : 0;
  const r = await env.DB.prepare(
    'INSERT INTO services (nome,preco,tipo,comissionavel,ativo) VALUES (?,?,?,?,1)'
  ).bind(b.nome.trim(), Number(b.preco || 0), tipo, comissionavel).run();
  return json({ ok: true, id: r.meta.last_row_id }, 201);
}

export async function onRequestPut({ request, env }) {
  const b = await readJson(request);
  if (!b.id || !b.nome) return json({ error: 'ID e nome são obrigatórios.' }, 400);
  const tipo = b.tipo === 'produto' || b.tipo === 'bebida' ? b.tipo : 'servico';
  const comissionavel = tipo === 'servico' ? 1 : 0;
  await env.DB.prepare(
    'UPDATE services SET nome=?, preco=?, tipo=?, comissionavel=? WHERE id=?'
  ).bind(b.nome.trim(), Number(b.preco || 0), tipo, comissionavel, Number(b.id)).run();
  return json({ ok: true });
}

export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get('id'));
  if (!id) return json({ error: 'ID obrigatório.' }, 400);
  await env.DB.prepare('UPDATE services SET ativo=0 WHERE id=?').bind(id).run();
  return json({ ok: true });
}
