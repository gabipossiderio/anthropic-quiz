export const config = { runtime: 'edge' }

const KEY = 'cca-leaderboard'
const TOP = 10

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

async function redis(command: (string | number)[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('missing_redis_config')

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  const data = (await resp.json()) as { result?: unknown; error?: string }
  if (data.error) throw new Error(data.error)
  return data.result
}

function parseRanking(raw: unknown): { name: string; points: number }[] {
  if (!Array.isArray(raw)) return []
  const list: { name: string; points: number }[] = []
  for (let i = 0; i < raw.length; i += 2) {
    const member = String(raw[i])
    const points = Number(raw[i + 1])
    const sep = member.indexOf('|')
    const name = sep >= 0 ? member.slice(sep + 1) : member
    list.push({ name, points })
  }
  return list
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method === 'GET') {
      const raw = await redis(['ZREVRANGE', KEY, 0, TOP - 1, 'WITHSCORES'])
      return jsonResponse({ ranking: parseRanking(raw) })
    }

    if (req.method === 'POST') {
      let body: { name?: string; points?: number }
      try {
        body = (await req.json()) as { name?: string; points?: number }
      } catch {
        return jsonResponse({ error: 'invalid_body' }, 400)
      }

      const name = String(body.name ?? '').trim().slice(0, 16)
      const points = Math.floor(Number(body.points))

      if (!name || !Number.isFinite(points) || points < 0 || points > 100000) {
        return jsonResponse({ error: 'invalid_score' }, 400)
      }

      const member = `${crypto.randomUUID()}|${name}`
      await redis(['ZADD', KEY, points, member])
      await redis(['ZREMRANGEBYRANK', KEY, 0, -101])

      const raw = await redis(['ZREVRANGE', KEY, 0, TOP - 1, 'WITHSCORES'])
      return jsonResponse({ ok: true, ranking: parseRanking(raw) })
    }

    return jsonResponse({ error: 'method_not_allowed' }, 405)
  } catch (e) {
    const msg = String(e instanceof Error ? e.message : e)
    if (msg.includes('missing_redis_config')) {
      return jsonResponse({ error: 'missing_redis_config' }, 500)
    }
    return jsonResponse({ error: 'redis_error', detail: msg }, 502)
  }
}
