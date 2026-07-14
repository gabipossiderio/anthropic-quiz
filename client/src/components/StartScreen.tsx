import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchRanking, type RankingEntry } from '../game/ranking'
import type { Team } from '../game/types'
import { useI18n } from '../i18n'
import { Footer } from './Footer'
import { Scenery } from './Scenery'

interface Props {
  teams: Team[]
  soundButton: ReactNode
  languageButton: ReactNode
  onTeamName: (id: string, name: string) => void
  onAddTeam: () => void
  onRemoveTeam: (id: string) => void
  onStart: () => void
}

export function StartScreen({
  teams,
  soundButton,
  languageButton,
  onTeamName,
  onAddTeam,
  onRemoveTeam,
  onStart,
}: Props) {
  const { t } = useI18n()
  const canStart = teams[0]?.name.trim() !== ''

  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [rankStatus, setRankStatus] = useState<'loading' | 'ok' | 'unavailable'>(
    'loading',
  )

  useEffect(() => {
    fetchRanking().then((r) => {
      if (r.ok) {
        setRanking(r.ranking)
        setRankStatus('ok')
      } else {
        setRankStatus('unavailable')
      }
    })
  }, [])

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-4">
      <Scenery />

      <div className="pixel-panel relative w-full max-w-xl bg-surface/95 p-6 text-center">
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {languageButton}
          {soundButton}
        </div>

        <h1 className="font-pixel mt-8 text-2xl leading-relaxed text-accent">
          CCA-F
        </h1>
        <p className="font-pixel mt-1 text-xs text-text">HUNT</p>
        <p className="mt-3 text-lg text-muted">{t.subtitle}</p>

        <div className="mt-6 text-left">
          <p className="font-pixel text-[10px] text-flag">{t.players}</p>
          <div className="mt-3 flex flex-col gap-2">
            {teams.map((team, i) => (
              <div key={team.id} className="flex items-center gap-2">
                <span
                  className="h-5 w-5 shrink-0 border-2 border-black"
                  style={{ background: team.color }}
                />
                <input
                  value={team.name}
                  onChange={(e) => onTeamName(team.id, e.target.value)}
                  placeholder={`Player ${i + 1}`}
                  maxLength={16}
                  className="pixel-panel flex-1 bg-black px-3 py-2 text-lg text-text outline-none placeholder:text-muted/50 focus:text-accent"
                />
                {teams.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveTeam(team.id)}
                    className="font-pixel px-2 py-2 text-xs text-wrong hover:text-accent"
                    aria-label={t.removePlayer}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>

          {teams.length < 4 && (
            <button
              type="button"
              onClick={onAddTeam}
              className="font-pixel mt-3 text-[10px] text-muted hover:text-accent"
            >
              {t.addPlayer}
            </button>
          )}
        </div>

        <div className="mt-6 border-t-2 border-border pt-4 text-left">
          <p className="font-pixel text-[10px] text-flag">{t.howToPlay}</p>
          <p className="mt-2 text-base text-muted">{t.howToPlayText}</p>
        </div>

        <div className="mt-6 border-t-2 border-border pt-4 text-left">
          <p className="font-pixel text-[10px] text-flag">{t.rankingTitle}</p>
          <div className="mt-2 flex flex-col gap-1">
            {rankStatus === 'unavailable' && (
              <p className="text-base text-muted/70">{t.rankingUnavailable}</p>
            )}
            {rankStatus === 'ok' && ranking.length === 0 && (
              <p className="text-base text-muted/70">{t.rankingEmpty}</p>
            )}
            {ranking.slice(0, 5).map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 text-lg"
              >
                <span className="font-pixel text-[10px] text-muted">
                  {i + 1}º
                </span>
                <span className="flex-1 truncate text-text">{entry.name}</span>
                <span className="font-pixel text-[10px] text-hit">
                  {entry.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="font-pixel mt-7 w-full bg-accent px-6 py-4 text-sm text-black transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
        >
          {t.start}
        </button>
        {!canStart && (
          <p className="mt-2 text-xs text-muted/70">{t.needName}</p>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-2">
        <Footer />
      </div>
    </div>
  )
}
