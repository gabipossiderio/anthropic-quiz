import type { Category, GameConfig, Team } from '../game/types'

export const CATEGORIES: Category[] = [
  {
    id: 'research',
    name: 'Research pipelines',
    shortName: 'RESEARCH',
    weight: 25,
  },
  {
    id: 'extraction',
    name: 'Extraction pipelines',
    shortName: 'EXTRACTION',
    weight: 25,
  },
  {
    id: 'support',
    name: 'Customer support agents',
    shortName: 'SUPPORT',
    weight: 25,
  },
  {
    id: 'code',
    name: 'Code exploration',
    shortName: 'CODE',
    weight: 25,
  },
]

export const POINT_VALUES = [50, 100, 150, 200]

export const DEFAULT_CONFIG: GameConfig = {
  timePerQuestion: 120,
}

export const TEAM_PALETTE = [
  '#f89838',
  '#5b8def',
  '#38d800',
  '#e85aa0',
  '#f8d800',
  '#00c8c8',
]

export const DEFAULT_TEAMS: Team[] = [
  { id: 'team-1', name: '', color: TEAM_PALETTE[0], points: 0 },
]
