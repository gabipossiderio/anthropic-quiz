import type { Language } from '../i18n'
import type { CategoryId } from '../game/types'

export const STUDY_TIPS: Record<Language, Record<CategoryId, string>> = {
  en: {
    research:
      'Review multi-agent research pipelines: an orchestrator coordinating subagents in parallel, gathering and verifying sources, synthesizing findings, and avoiding context pollution between subtasks.',
    extraction:
      'Focus on structured extraction: schema design (including versioned values, such as contract amendments with source location and effective date), output validation, grounding in the source, and using tool use to force the format.',
    support:
      'Study customer support agents: tool integration, escalation policies, guardrails, context management across the conversation, and reliability strategies for correct answers.',
    code:
      'Master code exploration with subagents: transcript/context management, resuming sessions with targeted deltas (e.g. renamed functions) instead of re-summarizing, and preserving accumulated understanding with minimum waste.',
  },
  pt: {
    research:
      'Revise pipelines de pesquisa com múltiplos agentes: orquestrador coordenando subagentes em paralelo, coleta e verificação de fontes, síntese dos achados e como evitar poluição de contexto entre subtarefas.',
    extraction:
      'Foque em extração estruturada: design de schema (incluindo valores versionados, como emendas de contrato com origem e data de vigência), validação da saída, grounding na fonte e uso de tool use para forçar formato.',
    support:
      'Estude agentes de suporte ao cliente: integração de ferramentas, políticas de escalonamento, guardrails, gestão de contexto ao longo da conversa e estratégias de confiabilidade para respostas corretas.',
    code:
      'Domine exploração de código com subagentes: gestão de transcript/contexto, retomar sessões com deltas direcionados (ex.: funções renomeadas) em vez de re-sumarizar, e preservar o entendimento acumulado com o mínimo de desperdício.',
  },
}
