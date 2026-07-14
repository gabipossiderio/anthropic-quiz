import type { RankingEntry } from '../game/ranking'

const STYLE: Record<number, { height: string; badge: string; order: string }> = {
  1: { height: 'h-24', badge: 'bg-[#f8d800]', order: 'order-2' },
  2: { height: 'h-16', badge: 'bg-[#c8c8c8]', order: 'order-1' },
  3: { height: 'h-12', badge: 'bg-[#cd7f32]', order: 'order-3' },
}

export function Podium({ entries }: { entries: RankingEntry[] }) {
  const top = entries.slice(0, 3)

  return (
    <div className="flex items-end justify-center gap-1.5">
      {[1, 2, 3].map((rank) => {
        const entry = top[rank - 1]
        if (!entry) return null
        const s = STYLE[rank]
        return (
          <div
            key={rank}
            className={`flex w-20 flex-col items-center ${s.order}`}
          >
            <span className="max-w-full truncate text-base text-text">
              {entry.name}
            </span>
            <span className="font-pixel mb-1 text-[9px] text-hit">
              {entry.points}
            </span>
            <div
              className={`flex w-full items-start justify-center border-2 border-black pt-1 ${s.height} ${s.badge}`}
            >
              <span className="font-pixel text-lg text-black">{rank}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
