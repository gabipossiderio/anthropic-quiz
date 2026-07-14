import { useEffect, useState } from 'react'
import { ConfirmModal } from './components/ConfirmModal'
import { Footer } from './components/Footer'
import { GameBoard } from './components/GameBoard'
import { QuestionModal } from './components/QuestionModal'
import { Scenery } from './components/Scenery'
import { Scoreboard } from './components/Scoreboard'
import { StartScreen } from './components/StartScreen'
import { TargetShooter } from './components/TargetShooter'
import { analyzeWithAI } from './game/ai'
import { audioEngine } from './game/audio'
import { submitScore } from './game/ranking'
import {
  downloadReport,
  extractFailures,
  generateReport,
} from './game/report'
import { useQuizGame } from './game/useQuizGame'
import { useI18n } from './i18n'

const MEDALS = ['1º', '2º', '3º', '4º']

function App() {
  const game = useQuizGame()
  const { t, language, toggleLanguage } = useI18n()
  const [muted, setMuted] = useState(audioEngine.isMuted())
  const [confirmation, setConfirmation] = useState<{
    message: string
    tone?: 'danger'
    action: () => void
  } | null>(null)
  const [exporting, setExporting] = useState(false)
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  )

  const exportReport = async () => {
    setExporting(true)
    const { wrong, weak } = extractFailures(game.history)
    const r = await analyzeWithAI(wrong, weak, language)
    const md = generateReport(
      game.teams,
      game.history,
      language,
      r.ok ? (r.text ?? '') : '',
    )
    downloadReport('cca-f-hunt-report.md', md)
    setExporting(false)
  }

  const saveRanking = async () => {
    setSaved('saving')
    const scored = game.teams.filter((team) => team.points > 0)
    if (scored.length === 0) {
      setSaved('saved')
      return
    }
    const res = await Promise.all(
      scored.map((team) => submitScore(team.name, team.points)),
    )
    setSaved(res.some((r) => r.ok) ? 'saved' : 'error')
  }

  const restart = () => {
    setExporting(false)
    setSaved('idle')
    game.backToSetup()
  }

  useEffect(() => {
    audioEngine.startMusic(game.phase === 'minigame' ? 'action' : 'calm')
  }, [game.phase])

  const toggleMuted = () => {
    const v = !muted
    setMuted(v)
    audioEngine.setMuted(v)
  }

  const languageButton = (
    <button
      type="button"
      onClick={toggleLanguage}
      className="pixel-panel flex h-10 items-center gap-2 bg-black px-3 text-flag"
      title="PT / EN"
      aria-label={language === 'en' ? 'Mudar para português' : 'Switch to English'}
    >
      <span className="text-lg leading-none">🌐</span>
      <span className="font-pixel translate-y-[2px] text-[9px] leading-none">
        {language === 'en' ? 'PT' : 'EN'}
      </span>
    </button>
  )

  const soundButton = (
    <button
      type="button"
      onClick={toggleMuted}
      className={`pixel-panel flex h-10 items-center gap-2 bg-black px-3 ${
        muted ? 'text-muted' : 'text-accent'
      }`}
      title={t.sound}
      aria-label={muted ? `${t.sound}: off` : `${t.sound}: on`}
      aria-pressed={!muted}
    >
      <span className="text-lg leading-none">{muted ? '🔇' : '🔊'}</span>
      <span className="font-pixel translate-y-[2px] text-[9px] leading-none">
        {t.sound}
      </span>
    </button>
  )

  if (game.phase === 'setup') {
    return (
      <StartScreen
        teams={game.teams}
        soundButton={soundButton}
        languageButton={languageButton}
        onTeamName={game.updateTeamName}
        onAddTeam={game.addTeam}
        onRemoveTeam={game.removeTeam}
        onStart={game.startGame}
      />
    )
  }

  const currentTeam = game.teams[game.currentTeamIndex]
  const ranking = [...game.teams].sort((a, b) => b.points - a.points)

  return (
    <main className="relative min-h-svh">
      <div className="fixed inset-0 opacity-70">
        <Scenery />
      </div>

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col gap-4 px-4 py-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-pixel text-lg text-accent">
            CCA-F <span className="text-text">HUNT</span>
          </h1>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {languageButton}
            {soundButton}
            {!game.finished && (
              <button
                type="button"
                onClick={() =>
                  setConfirmation({
                    message: t.finishConfirm,
                    action: game.finishNow,
                  })
                }
                className="pixel-panel font-pixel flex h-10 items-center bg-black px-3 text-[9px] text-flag hover:brightness-125"
              >
                {t.finish}
              </button>
            )}
          </div>
        </header>

        <div className="mx-auto flex w-full min-h-0 flex-1 flex-col gap-4 md:max-w-[calc((100svh-15rem)*2)]">
          <Scoreboard
            teams={game.teams}
            currentTeamIndex={game.currentTeamIndex}
          />

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <GameBoard
              board={game.board}
              playedCells={game.playedCells}
              cellResult={game.cellResult}
              onSelect={game.selectCell}
            />
          </div>
        </div>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>

      {game.phase === 'question' && game.currentQuestion && (
        <QuestionModal
          question={game.currentQuestion}
          totalTime={game.config.timePerQuestion}
          single={game.teams.length === 1}
          onAnswer={game.answer}
          onCancel={game.cancelQuestion}
        />
      )}

      {game.phase === 'minigame' && game.currentQuestion && (
        <TargetShooter
          correctPoints={game.currentQuestion.points}
          teamName={currentTeam.name}
          teamColor={currentTeam.color}
          onComplete={game.completeMinigame}
        />
      )}

      {game.finished && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.gameOver}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/80 p-4 animate-fade-in"
        >
          <div className="pixel-panel flex max-h-[92svh] w-full max-w-lg flex-col overflow-y-auto bg-surface p-6 animate-modal-in">
            <p className="font-pixel text-center text-sm text-flag">
              {t.gameOver}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {ranking.map((team, i) => (
                <div
                  key={team.id}
                  className={`pixel-panel flex items-center gap-3 bg-black px-4 py-3 ${
                    i === 0 ? 'text-accent' : 'text-text'
                  }`}
                >
                  <span className="font-pixel text-sm">
                    {MEDALS[i] ?? `${i + 1}º`}
                  </span>
                  <span
                    className="h-4 w-4 shrink-0 border-2 border-black"
                    style={{ background: team.color }}
                  />
                  <span className="flex-1 truncate text-xl">{team.name}</span>
                  <span className="font-pixel text-sm text-hit">
                    {team.points}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={game.history.length < 1 || exporting}
              onClick={exportReport}
              className="font-pixel mt-4 w-full bg-flag px-4 py-3 text-[10px] leading-relaxed text-black hover:brightness-110 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {exporting ? t.aiLoading : `⭳ ${t.exportReport}`}
            </button>
            {game.history.length < 1 && (
              <p className="mt-2 text-center text-sm text-muted">{t.needThree}</p>
            )}

            <button
              type="button"
              disabled={
                saved === 'saving' ||
                saved === 'saved' ||
                !game.teams.some((team) => team.points > 0)
              }
              onClick={saveRanking}
              className="font-pixel mt-2 w-full bg-black px-4 py-3 text-[10px] text-flag hover:brightness-125 disabled:cursor-not-allowed disabled:text-muted"
            >
              {saved === 'saving'
                ? t.saving
                : saved === 'saved'
                  ? `✓ ${t.saved}`
                  : `☆ ${t.saveScore}`}
            </button>
            {saved === 'error' && (
              <p className="mt-1 text-sm text-muted">{t.rankingUnavailable}</p>
            )}
            {saved === 'idle' &&
              !game.teams.some((team) => team.points > 0) && (
                <p className="mt-1 text-sm text-muted">{t.noScoreToSave}</p>
              )}

            <button
              type="button"
              onClick={restart}
              className="font-pixel mt-2 w-full bg-accent px-5 py-3 text-[10px] text-black hover:bg-accent-strong"
            >
              {t.playAgain}
            </button>
          </div>
        </div>
      )}

      {confirmation && (
        <ConfirmModal
          message={confirmation.message}
          tone={confirmation.tone}
          onConfirm={() => {
            confirmation.action()
            setConfirmation(null)
          }}
          onCancel={() => setConfirmation(null)}
        />
      )}
    </main>
  )
}

export default App
