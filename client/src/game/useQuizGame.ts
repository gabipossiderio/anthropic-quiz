import { useCallback, useState } from 'react'
import {
  CATEGORIES,
  DEFAULT_CONFIG,
  DEFAULT_TEAMS,
  TEAM_PALETTE,
} from '../data/categories'
import { QUESTIONS } from '../data/questions'
import type {
  CategoryId,
  GameConfig,
  Question,
  Result,
  Team,
} from './types'

const BOARD_SIZE = 50

function categoryName(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildBoard(): Question[] {
  return shuffle(QUESTIONS).slice(0, BOARD_SIZE)
}

export type Phase = 'setup' | 'board' | 'question' | 'minigame'

function cloneTeams(teams: Team[]) {
  return teams.map((team) => ({ ...team }))
}

export function useQuizGame() {
  const [config] = useState<GameConfig>(DEFAULT_CONFIG)
  const [teams, setTeams] = useState<Team[]>(() => cloneTeams(DEFAULT_TEAMS))
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [board, setBoard] = useState<Question[]>([])
  const [playedCells, setPlayedCells] = useState<number[]>([])
  const [cellResult, setCellResult] = useState<
    Record<number, 'correct' | 'wrong'>
  >({})
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>('setup')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [history, setHistory] = useState<Result[]>([])
  const [manuallyEnded, setManuallyEnded] = useState(false)

  const finished =
    manuallyEnded ||
    (board.length > 0 && playedCells.length >= board.length)

  const recordResult = useCallback(
    (question: Question, answeredCorrectly: boolean, pointsEarned: number) => {
      const team = teams[currentTeamIndex]
      setHistory((prev) => [
        ...prev,
        {
          category: question.category,
          categoryName: categoryName(question.category),
          points: question.points,
          prompt: question.prompt,
          teamId: team.id,
          teamName: team.name,
          answeredCorrectly,
          pointsEarned,
        },
      ])
    },
    [teams, currentTeamIndex],
  )

  const markPlayed = useCallback((index: number) => {
    setPlayedCells((prev) =>
      prev.includes(index) ? prev : [...prev, index],
    )
  }, [])

  const nextTurn = useCallback(() => {
    setCurrentTeamIndex((i) => (i + 1) % teams.length)
  }, [teams.length])

  const updateTeamName = useCallback((id: string, name: string) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)))
  }, [])

  const addTeam = useCallback(() => {
    setTeams((prev) => {
      if (prev.length >= 4) return prev
      const color = TEAM_PALETTE[prev.length % TEAM_PALETTE.length]
      return [...prev, { id: `team-${prev.length + 1}`, name: '', color, points: 0 }]
    })
  }, [])

  const removeTeam = useCallback((id: string) => {
    setTeams((prev) => (prev.length <= 1 ? prev : prev.filter((t) => t.id !== id)))
  }, [])

  const startGame = useCallback(() => {
    setTeams((prev) =>
      prev.map((t, i) => ({
        ...t,
        name: t.name.trim() === '' ? `Player ${i + 1}` : t.name.trim(),
        points: 0,
      })),
    )
    setCurrentTeamIndex(0)
    setBoard(buildBoard())
    setPlayedCells([])
    setCellResult({})
    setCurrentIndex(null)
    setCurrentQuestion(null)
    setHistory([])
    setManuallyEnded(false)
    setPhase('board')
  }, [])

  const finishNow = useCallback(() => {
    setCurrentQuestion(null)
    setCurrentIndex(null)
    setPhase('board')
    setManuallyEnded(true)
  }, [])

  const selectCell = useCallback(
    (index: number) => {
      const question = board[index]
      if (!question || playedCells.includes(index)) return
      setCurrentIndex(index)
      setCurrentQuestion(question)
      setPhase('question')
    },
    [board, playedCells],
  )

  const cancelQuestion = useCallback(() => {
    setCurrentQuestion(null)
    setCurrentIndex(null)
    setPhase('board')
  }, [])

  const answer = useCallback(
    (correct: boolean) => {
      if (!currentQuestion || currentIndex === null) return
      if (correct) {
        setPhase('minigame')
        return
      }
      recordResult(currentQuestion, false, 0)
      setCellResult((prev) => ({ ...prev, [currentIndex]: 'wrong' }))
      markPlayed(currentIndex)
      nextTurn()
      setCurrentQuestion(null)
      setCurrentIndex(null)
      setPhase('board')
    },
    [currentQuestion, currentIndex, markPlayed, nextTurn, recordResult],
  )

  const completeMinigame = useCallback(
    (points: number) => {
      if (!currentQuestion || currentIndex === null) return
      recordResult(currentQuestion, true, points)
      setCellResult((prev) => ({ ...prev, [currentIndex]: 'correct' }))
      if (points > 0) {
        setTeams((prev) =>
          prev.map((team, i) =>
            i === currentTeamIndex
              ? { ...team, points: team.points + points }
              : team,
          ),
        )
      } else {
        nextTurn()
      }
      markPlayed(currentIndex)
      setCurrentQuestion(null)
      setCurrentIndex(null)
      setPhase('board')
    },
    [
      currentQuestion,
      currentIndex,
      currentTeamIndex,
      markPlayed,
      nextTurn,
      recordResult,
    ],
  )

  const backToSetup = useCallback(() => {
    setPhase('setup')
    setCurrentQuestion(null)
    setCurrentIndex(null)
    setHistory([])
    setManuallyEnded(false)
  }, [])

  return {
    config,
    teams,
    currentTeamIndex,
    board,
    playedCells,
    cellResult,
    phase,
    currentQuestion,
    history,
    finished,
    updateTeamName,
    addTeam,
    removeTeam,
    startGame,
    selectCell,
    cancelQuestion,
    answer,
    completeMinigame,
    backToSetup,
    finishNow,
  }
}
