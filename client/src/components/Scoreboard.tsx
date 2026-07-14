import type { Team } from '../game/types'
import { useI18n } from '../i18n'
import { AnimatedScore } from './AnimatedScore'

interface Props {
  teams: Team[]
  currentTeamIndex: number
}

export function Scoreboard({ teams, currentTeamIndex }: Props) {
  const { t } = useI18n()

  return (
    <div className="pixel-panel flex flex-wrap gap-2 bg-dirt p-2">
      {teams.map((team, i) => {
        const active = i === currentTeamIndex
        return (
          <div
            key={team.id}
            className={`pixel-panel flex min-w-[180px] flex-1 items-center justify-between gap-3 bg-black px-4 py-3 ${
              active ? '' : 'opacity-55'
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`h-4 w-4 shrink-0 border-2 border-black ${
                  active ? 'animate-blink' : ''
                }`}
                style={{ background: team.color }}
              />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-pixel text-[8px] text-flag">
                  {active ? t.yourTurn : t.waiting}
                </span>
                <span className="truncate text-lg leading-none text-text">
                  {team.name}
                </span>
              </div>
            </div>
            <AnimatedScore
              value={team.points}
              className="font-pixel shrink-0 text-lg tabular-nums text-hit"
            />
          </div>
        )
      })}
    </div>
  )
}
