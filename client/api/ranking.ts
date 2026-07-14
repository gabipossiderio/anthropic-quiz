import { json, rateLimit, redis } from './_lib'

export const config = { runtime: 'edge' }

const KEY = 'cca-leaderboard'
const TOP = 10

function parseRanking(raw: unknown): { name: string; points: number }[] {
  if (!Array.isArray(raw)) return []
  const list: { name: string; points: number }[] = []
  for (let i = 0; i < raw.length; i += 2) {
    const member = String(raw[i])
    const sep = member.indexOf('|')
    list.push({
      name: sep >= 0 ? member.slice(sep + 1) : member,
      points: Number(raw[i + 1]),
    })
  }
  return list
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method === 'GET') {
      const raw = await redis(['ZREVRANGE', KEY, 0, TOP - 1, 'WITHSCORES'])
      return json({ ranking: parseRanking(raw) })
    }

    if (req.method === 'POST') {
      if (!(await rateLimit(req, 'ranking', 10, 60))) {
        return json({ error: 'rate_limited' }, 429)
      }

      let body: { name?: string; points?: number }
      try {
        body = (await req.json()) as { name?: string; points?: number }
      } catch {
        return json({ error: 'invalid_body' }, 400)
      }

      const name = String(body.name ?? '').trim().slice(0, 16)
      const points = Math.floor(Number(body.points))

      if (!name || !Number.isFinite(points) || points <= 0 || points > 100000) {
        return json({ error: 'invalid_score' }, 400)
      }

      // GT keeps each name's best score (dedup by name), still adds new names.
      await redis(['ZADD', KEY, 'GT', points, name])
      await redis(['ZREMRANGEBYRANK', KEY, 0, -101])

      const raw = await redis(['ZREVRANGE', KEY, 0, TOP - 1, 'WITHSCORES'])
      return json({ ok: true, ranking: parseRanking(raw) })
    }

    return json({ error: 'method_not_allowed' }, 405)
  } catch (e) {
    const msg = String(e instanceof Error ? e.message : e)
    if (msg.includes('missing_redis_config')) {
      return json({ error: 'missing_redis_config' }, 500)
    }
    return json({ error: 'redis_error', detail: msg }, 502)
  }
}
