export const config = { runtime: 'edge' }

interface WrongAnswer {
  category: string
  prompt: string
}

interface Body {
  wrong?: WrongAnswer[]
  weak?: string[]
  language?: 'pt' | 'en'
}

type Provider = 'claude' | 'gemini'

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest'
const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'

function pickProvider(): Provider {
  const forced = process.env.LLM_PROVIDER as Provider | undefined
  if (forced === 'claude' || forced === 'gemini') return forced
  return process.env.ANTHROPIC_API_KEY ? 'claude' : 'gemini'
}

function buildPrompt(body: Body): { system: string; user: string } {
  const language = body.language === 'en' ? 'en' : 'pt'
  const wrong = (body.wrong || []).slice(0, 15)
  const weak = body.weak || []

  const system =
    language === 'en'
      ? 'You are a concise, practical tutor helping someone study for the Anthropic Claude Certified Architect (CCA-F) exam. Explain clearly and avoid fluff. Do not use em dashes. Answer in English, in Markdown.'
      : 'Você é um tutor conciso e prático ajudando alguém a estudar para a certificação Claude Certified Architect (CCA-F) da Anthropic. Explique com clareza e sem enrolação. Não use travessão. Responda em português, em Markdown.'

  const instruction =
    language === 'en'
      ? 'For each question below, explain the underlying concept, why the correct answer is the best choice, and the common trap. Then give a short, focused study plan for the weak domains.'
      : 'Para cada pergunta abaixo, explique o conceito por trás, por que a alternativa correta é a melhor escolha, e a pegadinha comum. No final, dê um plano de estudo curto e focado nos domínios fracos.'

  const lines: string[] = [instruction, '']

  if (weak.length > 0) {
    lines.push(
      (language === 'en' ? 'Weak domains: ' : 'Domínios fracos: ') +
        weak.join(', '),
    )
    lines.push('')
  }

  if (wrong.length === 0) {
    lines.push(
      language === 'en'
        ? 'The student got everything right. Propose 3 harder scenario questions per weak domain with answers explained.'
        : 'O aluno acertou tudo. Proponha 3 questões de cenário mais difíceis por domínio de maior peso, com as respostas explicadas.',
    )
  } else {
    lines.push(language === 'en' ? 'Wrong questions:' : 'Perguntas erradas:')
    wrong.forEach((w, i) => {
      lines.push(`${i + 1}. [${w.category}] ${w.prompt}`)
    })
  }

  return { system, user: lines.join('\n') }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  tries = 3,
): Promise<Response> {
  let last: Response | null = null
  for (let attempt = 0; attempt < tries; attempt++) {
    const resp = await fetch(url, init)
    if (resp.ok || (resp.status !== 429 && resp.status < 500)) return resp
    last = resp
    if (attempt < tries - 1) {
      const backoff = 500 * 2 ** attempt + Math.floor(Math.random() * 250)
      await sleep(backoff)
    }
  }
  return last as Response
}

async function callGemini(
  system: string,
  user: string,
): Promise<{ ok: boolean; text?: string; detail?: string }> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return { ok: false, detail: 'missing GEMINI_API_KEY' }

  const resp = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: user }] }],
      }),
    },
  )

  const data = (await resp.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
    error?: { message?: string }
  }
  if (!resp.ok) return { ok: false, detail: data.error?.message }
  return {
    ok: true,
    text: data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '',
  }
}

async function callClaude(
  system: string,
  user: string,
): Promise<{ ok: boolean; text?: string; detail?: string }> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return { ok: false, detail: 'missing ANTHROPIC_API_KEY' }

  const resp = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1200,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  const data = (await resp.json()) as {
    content?: { text?: string }[]
    error?: { message?: string }
  }
  if (!resp.ok) return { ok: false, detail: data.error?.message }
  return { ok: true, text: data.content?.[0]?.text?.trim() || '' }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405)
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return json({ error: 'invalid_body' }, 400)
  }

  const provider = pickProvider()
  const { system, user } = buildPrompt(body)

  const result =
    provider === 'claude'
      ? await callClaude(system, user)
      : await callGemini(system, user)

  if (!result.ok) {
    return json(
      { error: `${provider}_error`, detail: result.detail, provider },
      502,
    )
  }
  return json({ analysis: result.text, provider }, 200)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
