export interface RankingEntry {
  name: string
  points: number
}

export async function fetchRanking(): Promise<{
  ok: boolean
  ranking: RankingEntry[]
}> {
  try {
    const resp = await fetch('/api/ranking')
    if (!resp.ok) return { ok: false, ranking: [] }
    const data = (await resp.json()) as { ranking?: RankingEntry[] }
    return { ok: true, ranking: data.ranking ?? [] }
  } catch {
    return { ok: false, ranking: [] }
  }
}

export async function submitScore(
  name: string,
  points: number,
): Promise<{ ok: boolean; ranking: RankingEntry[] }> {
  try {
    const resp = await fetch('/api/ranking', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, points }),
    })
    if (!resp.ok) return { ok: false, ranking: [] }
    const data = (await resp.json()) as { ranking?: RankingEntry[] }
    return { ok: true, ranking: data.ranking ?? [] }
  } catch {
    return { ok: false, ranking: [] }
  }
}
