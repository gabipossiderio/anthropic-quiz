import type { Question } from '../game/types'
import { BoardCell } from './BoardCell'

interface Props {
  board: Question[]
  playedCells: number[]
  cellResult: Record<number, 'correct' | 'wrong'>
  onSelect: (index: number) => void
}

export function GameBoard({
  board,
  playedCells,
  cellResult,
  onSelect,
}: Props) {
  return (
    <div className="grid w-full grid-cols-5 gap-1.5 sm:gap-2 md:grid-cols-10">
      {board.map((_, index) => (
        <BoardCell
          key={index}
          number={index + 1}
          played={playedCells.includes(index)}
          result={cellResult[index]}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  )
}
