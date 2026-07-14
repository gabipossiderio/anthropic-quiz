interface Props {
  number: number
  played: boolean
  result?: 'correct' | 'wrong'
  onClick: () => void
}

export function BoardCell({ number, played, result, onClick }: Props) {
  const correct = result === 'correct'

  return (
    <button
      type="button"
      disabled={played}
      onClick={onClick}
      className="perspective aspect-square w-full outline-none disabled:cursor-not-allowed"
    >
      <div className={`flip-inner ${played ? 'is-flipped' : ''}`}>
        <div className="flip-face pixel-panel bg-black font-pixel text-lg text-accent hover:bg-surface hover:text-text">
          {number}
        </div>
        <div
          className={`flip-face flip-back pixel-panel bg-surface text-2xl ${
            correct ? 'text-correct' : 'text-wrong'
          }`}
        >
          {correct ? '✓' : '✗'}
        </div>
      </div>
    </button>
  )
}
