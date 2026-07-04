import { json, readJson, sha256 } from './_utils.js';
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT id,nome,usuario,role,percentual_comissao,ativo,created_at FROM users ORDER BY role,nome').all();
  return json({ colaboradores: results });
}
export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body.nome || !body.usuario || !body.senha) return json({ error: 'Nome, usuário e senha são obrigatórios.' }, 400);
  const senha_hash = await sha256(body.senha);
  try {
    const r = await env.DB.prepare('INSERT INTO users (nome,usuario,senha_hash,role,percentual_comissao,ativo) VALUES (?,?,?,?,?,1)')
      .bind(body.nome.trim(), body.usuario.trim(), senha_hash, body.role || 'colaborador', Number(body.percentual_comissao || 50)).run();
    return json({ ok: true, id: r.meta.last_row_id }, 201);
  } catch(e) { return json({ error: 'Usuário já existe ou dados inválidos.' }, 400); }
}
