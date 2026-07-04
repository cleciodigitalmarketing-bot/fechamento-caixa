import { json, readJson } from './_utils.js';
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM services WHERE ativo=1 ORDER BY tipo,nome').all();
  return json({ servicos: results });
}
export async function onRequestPost({ request, env }) {
  const b = await readJson(request);
  if (!b.nome) return json({ error: 'Nome obrigatório.' }, 400);
  const tipo = b.tipo || 'servico';
  const comissionavel = tipo === 'bebida' ? 0 : Number(b.comissionavel ?? 1);
  const r = await env.DB.prepare('INSERT INTO services (nome,preco,tipo,comissionavel,ativo) VALUES (?,?,?,?,1)')
    .bind(b.nome, Number(b.preco || 0), tipo, comissionavel).run();
  return json({ ok: true, id: r.meta.last_row_id }, 201);
}
