import { useEffect } from 'react'
import { useI18n } from '../i18n'

interface Props {
  message: string
  tone?: 'danger' | 'normal'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  message,
  tone = 'normal',
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useI18n()
  const color = tone === 'danger' ? 'text-wrong' : 'text-accent'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={message}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in"
    >
      <div className="pixel-panel w-full max-w-md overflow-hidden bg-surface animate-modal-in">
        <div className="flex items-center gap-3 border-b-2 border-border bg-black/40 px-5 py-3">
          <span
            className={`pixel-panel flex h-8 w-8 shrink-0 items-center justify-center bg-black font-pixel text-sm ${color}`}
          >
            ?
          </span>
          <span className="font-pixel text-[10px] text-muted">CCA-F HUNT</span>
        </div>

        <div className="p-6">
          <p className="text-lg leading-relaxed text-text">{message}</p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="pixel-panel font-pixel flex-1 bg-black px-4 py-3 text-[10px] text-muted hover:text-text"
            >
              {t.confirmNo}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`font-pixel flex-1 px-4 py-3 text-[10px] text-black ${
                tone === 'danger'
                  ? 'bg-wrong hover:brightness-110'
                  : 'bg-accent hover:bg-accent-strong'
              }`}
            >
              {t.confirmYes}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
