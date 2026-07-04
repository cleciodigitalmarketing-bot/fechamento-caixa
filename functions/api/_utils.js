export const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' }
});

export async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

export async function sha256(text) {
  const msg = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msg);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function rangeFrom(periodo = 'dia') {
  const now = new Date();
  const start = new Date(now);
  if (periodo === 'semana') start.setDate(now.getDate() - 6);
  if (periodo === 'mes') start.setDate(1);
  start.setHours(0,0,0,0);
  const end = new Date(now); end.setHours(23,59,59,999);
  return { inicio: start.toISOString(), fim: end.toISOString() };
}
