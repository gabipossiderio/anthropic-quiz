import type { Language } from '../i18n'

interface WrongAnswer {
  category: string
  prompt: string
}

interface AIResult {
  ok: boolean
  text?: string
  error?: 'unavailable' | 'missing_key' | 'failure'
}

export async function analyzeWithAI(
  wrong: WrongAnswer[],
  weak: string[],
  language: Language,
): Promise<AIResult> {
  try {
    const resp = await fetch('/api/analysis', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ wrong, weak, language }),
    })

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}))
      if (data?.error === 'missing_api_key') return { ok: false, error: 'missing_key' }
      if (resp.status === 404) return { ok: false, error: 'unavailable' }
      return { ok: false, error: 'failure' }
    }

    const data = (await resp.json()) as { analysis?: string }
    return { ok: true, text: data.analysis || '' }
  } catch {
    return { ok: false, error: 'unavailable' }
  }
}
