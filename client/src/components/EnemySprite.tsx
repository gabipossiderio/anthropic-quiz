export type EnemyType = 'bug' | 'error' | 'merge'

export const ENEMIES: Record<
  EnemyType,
  { hitWord: string; name: string }
> = {
  bug: { hitWord: 'SPLAT!', name: 'BUG' },
  error: { hitWord: 'FIXED!', name: 'ERROR 500' },
  merge: { hitWord: 'RESOLVED!', name: 'MERGE CONFLICT' },
}

interface Props {
  type: EnemyType
  className?: string
}

function Bug() {
  return (
    <div className="pixel-panel flex h-full w-full flex-col items-center justify-center gap-1 rounded-full border-4 border-black bg-[#2ea82e]">
      <svg viewBox="0 0 24 16" className="h-[42%] w-[60%]" shapeRendering="crispEdges">
        <line x1="8" y1="3" x2="5" y2="0" stroke="#0b3d0b" strokeWidth="1.6" />
        <line x1="16" y1="3" x2="19" y2="0" stroke="#0b3d0b" strokeWidth="1.6" />
        <rect x="7" y="3" width="10" height="11" rx="4" fill="#0b3d0b" />
        <rect x="9" y="5" width="2" height="2" fill="#fcfcfc" />
        <rect x="13" y="5" width="2" height="2" fill="#fcfcfc" />
      </svg>
      <span className="font-pixel text-[10px] text-black">BUG</span>
    </div>
  )
}

function ErrorBox() {
  return (
    <div className="pixel-panel flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border-4 border-black bg-[#d82800] text-white">
      <span className="font-pixel text-xl leading-none">500</span>
      <span className="font-pixel text-[9px]">ERROR</span>
    </div>
  )
}

function MergeConflict() {
  return (
    <div className="pixel-panel flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border-4 border-black bg-surface">
      <span className="w-full bg-[#f89838] py-0.5 text-center font-pixel text-[8px] text-black">
        {'<<< HEAD'}
      </span>
      <span className="py-1 font-pixel text-[9px] text-text">MERGE</span>
      <span className="w-full bg-[#5b8def] py-0.5 text-center font-pixel text-[8px] text-black">
        {'>>> main'}
      </span>
    </div>
  )
}

export function EnemySprite({ type, className }: Props) {
  return (
    <span className={className}>
      {type === 'bug' && <Bug />}
      {type === 'error' && <ErrorBox />}
      {type === 'merge' && <MergeConflict />}
    </span>
  )
}
