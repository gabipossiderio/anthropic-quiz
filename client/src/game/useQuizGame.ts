import { useCallback, useEffect, useState } from 'react'
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

const SAVE_KEY = 'cca-game'

interface Snapshot {
  teams: Team[]
  currentTeamIndex: number
  board: Question[]
  playedCells: number[]
  cellResult: Record<number, 'correct' | 'wrong'>
  history: Result[]
  manuallyEnded: boolean
}

function loadSaved(): Snapshot | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Snapshot
    if (!Array.isArray(data.board) || data.board.length === 0) return null
    return data
  } catch {
    return null
  }
}

function saveGame(snapshot: Snapshot) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot))
  } catch {
    void 0
  }
}

function clearSaved() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    void 0
  }
}

export function useQuizGame() {
  const [saved] = useState(loadSaved)
  const [config] = useState<GameConfig>(DEFAULT_CONFIG)
  const [teams, setTeams] = useState<Team[]>(
    () => saved?.teams ?? cloneTeams(DEFAULT_TEAMS),
  )
  const [currentTeamIndex, setCurrentTeamIndex] = useState(
    saved?.currentTeamIndex ?? 0,
  )
  const [board, setBoard] = useState<Question[]>(saved?.board ?? [])
  const [playedCells, setPlayedCells] = useState<number[]>(
    saved?.playedCells ?? [],
  )
  const [cellResult, setCellResult] = useState<
    Record<number, 'correct' | 'wrong'>
  >(saved?.cellResult ?? {})
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>(saved ? 'board' : 'setup')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [history, setHistory] = useState<Result[]>(saved?.history ?? [])
  const [manuallyEnded, setManuallyEnded] = useState(saved?.manuallyEnded ?? false)

  const finished =
    manuallyEnded ||
    (board.length > 0 && playedCells.length >= board.length)

  useEffect(() => {
    if (phase === 'setup' || board.length === 0) {
      return
    }
    saveGame({
      teams,
      currentTeamIndex,
      board,
      playedCells,
      cellResult,
      history,
      manuallyEnded,
    })
  }, [
    phase,
    teams,
    currentTeamIndex,
    board,
    playedCells,
    cellResult,
    history,
    manuallyEnded,
  ])

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
    clearSaved()
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
