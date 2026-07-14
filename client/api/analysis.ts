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

const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest'

function buildPrompt(body: Body): string {
  const language = body.language === 'en' ? 'en' : 'pt'
  const wrong = (body.wrong || []).slice(0, 15)
  const weak = body.weak || []

  const header =
    language === 'en'
      ? 'You are a tutor helping someone study for the Anthropic Claude Certified Architect (CCA-F) exam. Answer in English.'
      : 'Você é um tutor ajudando alguém a estudar para a certificação Claude Certified Architect (CCA-F) da Anthropic. Responda em português.'

  const instruction =
    language === 'en'
      ? 'For each question below, explain the underlying concept, why the correct answer is the best choice, and the common trap. Then give a short, focused study plan for the weak domains. Be concise and practical. Do not use em dashes.'
      : 'Para cada pergunta abaixo, explique o conceito por trás, por que a alternativa correta é a melhor escolha, e a pegadinha comum. No final, dê um plano de estudo curto e focado nos domínios fracos. Seja conciso e prático. Não use travessão.'

  const lines: string[] = [header, '', instruction, '']

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

  return lines.join('\n')
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'missing_api_key' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  const prompt = buildPrompt(body)

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    )

    const data = (await resp.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
      error?: { message?: string }
    }

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: 'gemini_error', detail: data.error?.message }),
        { status: 502, headers: { 'content-type': 'application/json' } },
      )
    }

    const analysis =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

    return new Response(JSON.stringify({ analysis }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'fetch_failed', detail: String(e) }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    )
  }
}
