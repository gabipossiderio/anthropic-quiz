import { describe, expect, it } from 'vitest'
import { extractFailures, generateReport } from './report'
import type { Result, Team } from './types'

function makeResult(over: Partial<Result> = {}): Result {
  return {
    category: 'code',
    categoryName: 'Code exploration',
    points: 100,
    prompt: 'A question?',
    teamId: 't1',
    teamName: 'Alice',
    answeredCorrectly: true,
    pointsEarned: 100,
    ...over,
  }
}

const teams: Team[] = [
  { id: 't1', name: 'Alice', color: '#fff', points: 150 },
]

describe('extractFailures', () => {
  it('returns only wrong questions and their weak domains', () => {
    const history = [
      makeResult({ answeredCorrectly: true }),
      makeResult({
        category: 'research',
        categoryName: 'Research pipelines',
        answeredCorrectly: false,
        prompt: 'Wrong one',
      }),
    ]
    const { wrong, weak } = extractFailures(history)
    expect(wrong).toHaveLength(1)
    expect(wrong[0].prompt).toBe('Wrong one')
    expect(weak).toContain('Research pipelines')
  })

  it('returns nothing when all answers are correct', () => {
    const { wrong, weak } = extractFailures([makeResult()])
    expect(wrong).toHaveLength(0)
    expect(weak).toHaveLength(0)
  })
})

describe('generateReport', () => {
  const history = [
    makeResult({ answeredCorrectly: true }),
    makeResult({ answeredCorrectly: false, prompt: 'Missed question' }),
  ]

  it('includes title, ranking and the team section', () => {
    const md = generateReport(teams, history, 'en')
    expect(md).toContain('# CCA-F Hunt')
    expect(md).toContain('## Ranking')
    expect(md).toContain('Alice')
    expect(md).toContain('Missed question')
  })

  it('embeds the AI analysis section when provided', () => {
    const md = generateReport(teams, history, 'en', 'My AI study text')
    expect(md).toContain('## AI study analysis')
    expect(md).toContain('My AI study text')
  })

  it('omits the AI section when no analysis is passed', () => {
    const md = generateReport(teams, history, 'en')
    expect(md).not.toContain('## AI study analysis')
  })

  it('renders in Portuguese', () => {
    const md = generateReport(teams, history, 'pt')
    expect(md).toContain('Relatório de Desempenho')
  })
})
