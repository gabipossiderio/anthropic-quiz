export type CategoryId = 'research' | 'extraction' | 'support' | 'code'

export type QuestionType = 'multiple' | 'trueFalse'

export interface Category {
  id: CategoryId
  name: string
  shortName: string
  weight: number
}

export interface Question {
  id: string
  category: CategoryId
  points: number
  type: QuestionType
  prompt: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface QuestionTranslation {
  prompt: string
  options: string[]
  explanation?: string
}

export interface Team {
  id: string
  name: string
  color: string
  points: number
}

export interface GameConfig {
  timePerQuestion: number
}

export interface Result {
  category: CategoryId
  categoryName: string
  points: number
  prompt: string
  teamId: string
  teamName: string
  answeredCorrectly: boolean
  pointsEarned: number
}
