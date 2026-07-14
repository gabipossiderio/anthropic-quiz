import { useEffect, useRef, useState } from 'react'
import { audioEngine } from '../game/audio'
import { useI18n } from '../i18n'
import { ENEMIES, EnemySprite, type EnemyType } from './EnemySprite'
import { Scenery } from './Scenery'

const INITIAL_AMMO = 3
const HITS_TO_WIN = 2
const TYPES: EnemyType[] = ['bug', 'error', 'merge']

interface Target {
  id: number
  type: EnemyType
  y: number
  size: number
  dir: 'ltr' | 'rtl'
  dur: number
}

interface Marker {
  id: number
  x: number
  y: number
  hit: boolean
}

interface Props {
  correctPoints: number
  teamName: string
  teamColor: string
  onComplete: (points: number) => void
}

function random(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function TargetShooter({
  correctPoints,
  teamName,
  teamColor,
  onComplete,
}: Props) {
  const { t } = useI18n()
  const [ammo, setAmmo] = useState(INITIAL_AMMO)
  const [hits, setHits] = useState(0)
  const [enemy, setEnemy] = useState<Target | null>(null)
  const [struck, setStruck] = useState(false)
  const [over, setOver] = useState(false)
  const [result, setResult] = useState<{ won: boolean; points: number } | null>(null)
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])

  const arenaRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const counterRef = useRef(0)
  const resolvedRef = useRef<number | null>(null)
  const markerIdRef = useRef(0)

  const createEnemy = (): Target => {
    idRef.current += 1
    const type = TYPES[counterRef.current % TYPES.length]
    counterRef.current += 1
    return {
      id: idRef.current,
      type,
      y: random(8, 60),
      size: random(98, 124),
      dir: Math.random() < 0.5 ? 'ltr' : 'rtl',
      dur: random(3, 4.4),
    }
  }

  const spawnNext = () => {
    setStruck(false)
    setEnemy(createEnemy())
  }

  useEffect(() => {
    spawnNext()
  }, [])

  const coords = (e: React.MouseEvent) => {
    const rect = arenaRef.current?.getBoundingClientRect()
    if (!rect) return null
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const registerShot = (e: React.MouseEvent, hit: boolean) => {
    audioEngine.playShot()
    if (hit) audioEngine.playHit()
    const c = coords(e)
    if (!c) return
    markerIdRef.current += 1
    const id = markerIdRef.current
    setMarkers((prev) => [...prev, { id, x: c.x, y: c.y, hit }])
    window.setTimeout(
      () => setMarkers((prev) => prev.filter((m) => m.id !== id)),
      750,
    )
  }

  const finish = (won: boolean) => {
    setOver(true)
    const points = won ? correctPoints : 0
    setResult({ won, points })
    if (won) audioEngine.playWin()
    else audioEngine.playLose()
    window.setTimeout(() => onComplete(points), 1600)
  }

  const hitTarget = (target: Target, e: React.MouseEvent) => {
    if (over || struck || ammo <= 0) return
    if (resolvedRef.current === target.id) return
    resolvedRef.current = target.id
    registerShot(e, true)

    const newAmmo = ammo - 1
    const newHits = hits + 1
    setStruck(true)
    setAmmo(newAmmo)
    setHits(newHits)

    window.setTimeout(() => {
      if (newHits >= HITS_TO_WIN) {
        finish(true)
      } else if (newAmmo <= 0) {
        finish(false)
      } else {
        spawnNext()
      }
    }, 480)
  }

  const escape = (id: number) => {
    if (over) return
    if (resolvedRef.current === id) return
    resolvedRef.current = id
    spawnNext()
  }

  const missShot = (e: React.MouseEvent) => {
    if (over || struck || ammo <= 0) return
    registerShot(e, false)
    const newAmmo = ammo - 1
    setAmmo(newAmmo)
    if (newAmmo <= 0 && hits < HITS_TO_WIN) {
      finish(false)
    }
  }

  const trackCrosshair = (e: React.MouseEvent<HTMLDivElement>) => {
    const c = coords(e)
    if (c) setCrosshair(c)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.hitToWin}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in"
    >
      <div className="flex w-full max-w-4xl flex-col gap-2">
        <div className="pixel-panel flex flex-wrap items-center justify-between gap-2 bg-dirt px-3 py-2 sm:px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[9px] text-flag">{t.shots}</span>
              <div className="flex gap-1">
                {Array.from({ length: INITIAL_AMMO }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-3.5 w-3.5 rounded-full border-2 border-black ${
                      i < ammo ? 'bg-hit' : 'bg-black/40'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[9px] text-flag">{t.hits}</span>
              <div className="flex gap-1">
                {Array.from({ length: HITS_TO_WIN }).map((_, i) => (
                  <span
                    key={i}
                    className={`font-pixel text-sm ${
                      i < hits ? 'text-accent' : 'text-black/40'
                    }`}
                  >
                    {i < hits ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span
            className="font-pixel px-3 py-1 text-[9px]"
            style={{ background: teamColor, color: '#000' }}
          >
            {teamName}
          </span>
        </div>

        <p className="font-pixel text-center text-[9px] text-text">
          {t.hitToWin}
        </p>

        <div
          ref={arenaRef}
          onClick={missShot}
          onMouseMove={trackCrosshair}
          onMouseLeave={() => setCrosshair(null)}
          className="pixel-panel relative h-[58vh] cursor-crosshair overflow-hidden"
        >
          <Scenery />

          {enemy && !over && (
            <div
              key={enemy.id}
              onAnimationEnd={() => escape(enemy.id)}
              style={{
                top: `${enemy.y}%`,
                width: `${enemy.size}px`,
                height: `${enemy.size}px`,
                animationName: enemy.dir === 'ltr' ? 'fly-ltr' : 'fly-rtl',
                animationDuration: `${enemy.dur}s`,
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards',
                animationPlayState: struck ? 'paused' : 'running',
              }}
              className="absolute"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  hitTarget(enemy, e)
                }}
                className={`block h-full w-full ${struck ? 'animate-pop' : 'animate-[bob_0.9s_ease-in-out_infinite]'}`}
              >
                <EnemySprite type={enemy.type} className="block h-full w-full" />
              </button>
              {struck && (
                <span className="font-pixel absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-correct">
                  {ENEMIES[enemy.type].hitWord}
                </span>
              )}
            </div>
          )}

          {markers.map((m) => (
            <div
              key={m.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: m.x, top: m.y }}
            >
              <div
                className={`animate-impact h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 ${
                  m.hit ? 'border-correct' : 'border-wrong'
                }`}
                style={{ position: 'absolute', left: '50%', top: '50%' }}
              />
              <span
                className={`animate-hit-float font-pixel absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] ${
                  m.hit ? 'text-correct' : 'text-wrong'
                }`}
                style={{ top: '-10px' }}
              >
                {m.hit ? 'HIT!' : 'MISS'}
              </span>
            </div>
          ))}

          {crosshair && !over && (
            <div
              className="pointer-events-none absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90"
              style={{ left: crosshair.x, top: crosshair.y }}
            >
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/70" />
              <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/70" />
            </div>
          )}

          {result && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pixel-panel bg-black/90 px-8 py-5 text-center animate-modal-in">
                <p className="font-pixel text-[10px] text-muted">
                  {result.won ? t.niceShot : t.outOfAmmo}
                </p>
                <p
                  className={`font-pixel mt-2 text-2xl ${
                    result.points > 0 ? 'text-correct' : 'text-wrong'
                  }`}
                >
                  {result.points > 0 ? `+${result.points}` : '0'} {t.pts}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
