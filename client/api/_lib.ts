export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export async function redis(command: (string | number)[]): Promise<unknown> {
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

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'anon'
}

/**
 * Fixed-window rate limit backed by Upstash. Fails open (allows) when Redis is
 * not configured or unreachable, so the feature still works locally/without it.
 */
export async function rateLimit(
  req: Request,
  route: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const key = `rl:${route}:${clientIp(req)}`
    const count = Number(await redis(['INCR', key]))
    if (count === 1) await redis(['EXPIRE', key, windowSeconds])
    return count <= limit
  } catch {
    return true
  }
}
