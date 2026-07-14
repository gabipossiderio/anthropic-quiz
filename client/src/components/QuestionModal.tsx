import { useEffect, useState } from 'react'
import { CATEGORIES } from '../data/categories'
import { QUESTION_TRANSLATIONS } from '../data/translations'
import { audioEngine } from '../game/audio'
import type { Question } from '../game/types'
import { useI18n } from '../i18n'

interface Props {
  question: Question
  totalTime: number
  single: boolean
  onAnswer: (correct: boolean) => void
  onCancel: () => void
}

type Outcome = 'correct' | 'wrong' | null

export function QuestionModal({
  question,
  totalTime,
  single,
  onAnswer,
  onCancel,
}: Props) {
  const { t, language } = useI18n()
  const [selected, setSelected] = useState<number | null>(null)
  const [outcome, setOutcome] = useState<Outcome>(null)
  const [timedOut, setTimedOut] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalTime)

  const locked = outcome !== null
  const category = CATEGORIES.find((c) => c.id === question.category)
  const ending = timeLeft <= 10

  const translation =
    language === 'pt' ? QUESTION_TRANSLATIONS[question.id] : undefined
  const questionText = translation?.prompt ?? question.prompt
  const options = translation?.options ?? question.options
  const explanation = translation?.explanation ?? question.explanation

  useEffect(() => {
    if (locked) return
    if (timeLeft <= 0) {
      setTimedOut(true)
      setOutcome('wrong')
      audioEngine.playWrong()
      return
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => window.clearTimeout(id)
  }, [timeLeft, locked])

  const choose = (index: number) => {
    if (locked) return
    const isCorrect = index === question.correctAnswer
    setSelected(index)
    setOutcome(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) audioEngine.playCorrect()
    else audioEngine.playWrong()
  }

  const optionStyle = (index: number) => {
    if (!locked) {
      return 'bg-black text-text hover:bg-surface-2 hover:text-accent'
    }
    if (index === question.correctAnswer) {
      return 'bg-correct/25 text-correct'
    }
    if (index === selected) {
      return 'bg-wrong/25 text-wrong'
    }
    return 'bg-black text-muted/50'
  }

  const correct = outcome === 'correct'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
      <div
        className={`pixel-panel flex max-h-[92svh] w-full max-w-3xl flex-col bg-surface animate-modal-in ${
          outcome === 'wrong' ? 'animate-shake' : ''
        }`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-pixel text-[9px] text-flag">
              {category?.shortName}
            </span>
            <span className="font-pixel text-sm text-accent">
              {question.points} {t.pts}
            </span>
          </div>

          {!locked && (
            <div className="mt-3 flex items-center gap-3">
              <div className="pixel-panel h-4 flex-1 overflow-hidden bg-black">
                <div
                  className={`h-full transition-[width] duration-1000 ease-linear ${
                    ending ? 'bg-wrong' : 'bg-flag'
                  }`}
                  style={{ width: `${(timeLeft / totalTime) * 100}%` }}
                />
              </div>
              <span
                className={`font-pixel text-sm tabular-nums ${
                  ending ? 'text-wrong animate-blink' : 'text-text'
                }`}
              >
                {String(Math.max(0, timeLeft)).padStart(3, '0')}
              </span>
            </div>
          )}

          <h2 className="mt-3 text-base leading-relaxed text-text">
            {questionText}
          </h2>

          <div className="mt-3 flex flex-col gap-1.5">
            {options.map((option, i) => (
              <button
                key={i}
                type="button"
                disabled={locked}
                onClick={() => choose(i)}
                className={`pixel-panel flex items-center gap-3 px-3 py-2 text-left text-sm leading-snug transition-colors ${optionStyle(
                  i,
                )}`}
              >
                <span className="font-pixel flex h-6 w-6 shrink-0 items-center justify-center bg-surface-2 text-[9px] text-accent">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{option}</span>
                {locked && i === question.correctAnswer && (
                  <span className="font-pixel ml-auto text-[9px] text-correct">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          {locked && (
            <div className="pixel-panel mt-3 bg-black p-3 animate-rise">
              <p
                className={`font-pixel text-sm ${
                  correct ? 'text-correct' : 'text-wrong'
                }`}
              >
                {correct ? t.correct : timedOut ? t.timesUp : t.wrong}
              </p>
              {!correct && (
                <p className="mt-2 text-sm text-text">
                  <span className="text-muted">{t.correctAnswer}</span>
                  <span className="text-correct">
                    {String.fromCharCode(65 + question.correctAnswer)}.{' '}
                    {options[question.correctAnswer]}
                  </span>
                </p>
              )}
              {explanation && (
                <p className="mt-2 border-t-2 border-border pt-2 text-sm leading-relaxed text-muted">
                  {explanation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t-2 border-border p-3 sm:p-4">
          {locked ? (
            <button
              type="button"
              onClick={() => onAnswer(correct)}
              className={`font-pixel w-full px-6 py-4 text-xs text-black transition-colors ${
                correct
                  ? 'bg-correct hover:brightness-110'
                  : 'bg-accent hover:bg-accent-strong'
              }`}
            >
              {correct ? t.shootEnemies : single ? t.continueBtn : t.nextPlayer}{' '}
              →
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="font-pixel text-[9px] text-muted hover:text-accent"
            >
              {'<'} {t.backToBoard}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
