import { json, readJson, sha256 } from '../_utils.js';
export async function onRequestPut({ request, env, params }) {
  const body = await readJson(request);
  if (body.senha) {
    const senha_hash = await sha256(body.senha);
    await env.DB.prepare('UPDATE users SET nome=?, usuario=?, percentual_comissao=?, ativo=?, senha_hash=? WHERE id=?')
      .bind(body.nome, body.usuario, Number(body.percentual_comissao), Number(body.ativo ?? 1), senha_hash, params.id).run();
  } else {
    await env.DB.prepare('UPDATE users SET nome=?, usuario=?, percentual_comissao=?, ativo=? WHERE id=?')
      .bind(body.nome, body.usuario, Number(body.percentual_comissao), Number(body.ativo ?? 1), params.id).run();
  }
  return json({ ok: true });
}
export async function onRequestDelete({ env, params }) {
  await env.DB.prepare('UPDATE users SET ativo=0 WHERE id=?').bind(params.id).run();
  return json({ ok: true });
}
