import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useQuizGame } from './useQuizGame'

describe('useQuizGame', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts in setup with a single team', () => {
    const { result } = renderHook(() => useQuizGame())
    expect(result.current.phase).toBe('setup')
    expect(result.current.teams).toHaveLength(1)
  })

  it('startGame builds a board and moves to the board phase', () => {
    const { result } = renderHook(() => useQuizGame())
    act(() => result.current.startGame())
    expect(result.current.phase).toBe('board')
    expect(result.current.board.length).toBeGreaterThan(0)
  })

  it('selecting a cell opens a question', () => {
    const { result } = renderHook(() => useQuizGame())
    act(() => result.current.startGame())
    act(() => result.current.selectCell(0))
    expect(result.current.phase).toBe('question')
    expect(result.current.currentQuestion).toBeTruthy()
  })

  it('a wrong answer marks the cell played and returns to the board', () => {
    const { result } = renderHook(() => useQuizGame())
    act(() => result.current.startGame())
    act(() => result.current.selectCell(0))
    act(() => result.current.answer(false))
    expect(result.current.phase).toBe('board')
    expect(result.current.playedCells).toContain(0)
    expect(result.current.cellResult[0]).toBe('wrong')
    expect(result.current.history).toHaveLength(1)
  })

  it('a correct answer leads to the minigame, and scoring awards the points', () => {
    const { result } = renderHook(() => useQuizGame())
    act(() => result.current.startGame())
    act(() => result.current.selectCell(0))
    const points = result.current.currentQuestion?.points ?? 0
    act(() => result.current.answer(true))
    expect(result.current.phase).toBe('minigame')
    act(() => result.current.completeMinigame(points))
    expect(result.current.phase).toBe('board')
    expect(result.current.teams[0].points).toBe(points)
    expect(result.current.cellResult[0]).toBe('correct')
  })

  it('finishNow ends the game', () => {
    const { result } = renderHook(() => useQuizGame())
    act(() => result.current.startGame())
    act(() => result.current.finishNow())
    expect(result.current.finished).toBe(true)
  })

  it('resumes an in-progress game on a fresh mount', () => {
    const first = renderHook(() => useQuizGame())
    act(() => first.result.current.startGame())
    act(() => first.result.current.selectCell(0))
    act(() => first.result.current.answer(false))
    const board = first.result.current.board

    const second = renderHook(() => useQuizGame())
    expect(second.result.current.phase).toBe('board')
    expect(second.result.current.board).toEqual(board)
    expect(second.result.current.playedCells).toContain(0)
    expect(second.result.current.history).toHaveLength(1)
  })

  it('backToSetup clears the saved game', () => {
    const first = renderHook(() => useQuizGame())
    act(() => first.result.current.startGame())
    act(() => first.result.current.backToSetup())

    const second = renderHook(() => useQuizGame())
    expect(second.result.current.phase).toBe('setup')
  })
})
