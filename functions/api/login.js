import { json, readJson, sha256 } from './_utils.js';
export async function onRequestPost({ request, env }) {
  const { usuario, senha } = await readJson(request);
  if (!usuario || !senha) return json({ error: 'Informe usuário e senha.' }, 400);
  const senha_hash = await sha256(senha);
  const user = await env.DB.prepare('SELECT id,nome,usuario,role,percentual_comissao,ativo FROM users WHERE usuario=? AND senha_hash=? AND ativo=1')
    .bind(usuario.trim(), senha_hash).first();
  if (!user) return json({ error: 'Login inválido.' }, 401);
  return json({ user });
}
