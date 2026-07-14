import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Language = 'en' | 'pt'

export const TEXTS = {
  en: {
    subtitle:
      "Take down a developer's worst enemies while you study for the Claude Certified Architect.",
    players: 'PLAYERS',
    addPlayer: '+ ADD PLAYER',
    removePlayer: 'Remove player',
    howToPlay: 'HOW TO PLAY',
    howToPlayText:
      'Pick a number and answer. Nail it and you earn your shots. Take down 2 of the 3 dev enemies to grab the points. Miss it and the turn passes on.',
    start: 'START',
    needName: 'Type a name for Player 1 to start.',
    sound: 'SOUND',
    exit: 'EXIT',
    exitConfirm: 'Leave the game? All progress will be lost.',
    finish: 'FINISH',
    finishConfirm: 'End the game now and see the report for the questions answered so far?',
    needThree: 'Answer at least 3 questions to unlock the report.',
    confirmYes: 'YES',
    confirmNo: 'CANCEL',
    yourTurn: 'YOUR TURN',
    waiting: 'WAITING',
    pts: 'PTS',
    timesUp: "TIME'S UP!",
    correct: 'CORRECT!',
    wrong: 'WRONG',
    correctAnswer: 'Correct answer: ',
    shootEnemies: 'SHOOT THE ENEMIES',
    nextPlayer: 'NEXT PLAYER',
    continueBtn: 'CONTINUE',
    backToBoard: 'BACK TO BOARD',
    shots: 'SHOTS',
    hits: 'HITS',
    hitToWin: 'HIT 2 ENEMIES TO WIN THE POINTS',
    niceShot: 'NICE SHOT',
    outOfAmmo: 'OUT OF AMMO',
    gameOver: 'GAME OVER',
    exportPdf: 'EXPORT PDF',
    exportMd: 'EXPORT .MD',
    exportReport: 'EXPORT REPORT + AI ANALYSIS',
    playAgain: 'PLAY AGAIN',
    madeBy: 'Made by',
    aiButton: 'AI ANALYSIS',
    aiLoading: 'Generating analysis...',
    aiUnavailable:
      'AI analysis runs only after deploying to Vercel (with the API key set). Use the .md or PDF for now.',
    aiError: 'Could not generate the analysis. Try again.',
    rankingTitle: 'RANKING',
    rankingEmpty: 'No scores yet',
    rankingUnavailable: 'Ranking available after deploy',
    saveScore: 'SAVE TO RANKING',
    saving: 'Saving...',
    saved: 'Saved!',
  },
  pt: {
    subtitle:
      'Derrote os maiores inimigos de um dev enquanto estuda para a Claude Certified Architect.',
    players: 'JOGADORES',
    addPlayer: '+ ADICIONAR',
    removePlayer: 'Remover jogador',
    howToPlay: 'COMO JOGAR',
    howToPlayText:
      'Escolhe um número e responde. Acertou, ganha o direito de atirar. Derruba 2 dos 3 inimigos do dev e leva os pontos. Errou, passa a vez.',
    start: 'COMEÇAR',
    needName: 'Digite um nome para o Player 1 para começar.',
    sound: 'SOM',
    exit: 'SAIR',
    exitConfirm: 'Sair do jogo? Todo o progresso será perdido.',
    finish: 'ENCERRAR',
    finishConfirm:
      'Encerrar o jogo agora e ver o relatório com as perguntas respondidas até aqui?',
    needThree: 'Responda pelo menos 3 perguntas para liberar o relatório.',
    confirmYes: 'SIM',
    confirmNo: 'CANCELAR',
    yourTurn: 'SUA VEZ',
    waiting: 'ESPERANDO',
    pts: 'PTS',
    timesUp: 'TEMPO ESGOTADO!',
    correct: 'ACERTOU!',
    wrong: 'ERROU',
    correctAnswer: 'Resposta certa: ',
    shootEnemies: 'ATIRE NOS INIMIGOS',
    nextPlayer: 'PRÓXIMO JOGADOR',
    continueBtn: 'CONTINUAR',
    backToBoard: 'VOLTAR AO TABULEIRO',
    shots: 'TIROS',
    hits: 'ACERTOS',
    hitToWin: 'ACERTE 2 INIMIGOS PARA GANHAR OS PONTOS',
    niceShot: 'BOA MIRA',
    outOfAmmo: 'SEM BALAS',
    gameOver: 'FIM DE JOGO',
    exportPdf: 'EXPORTAR PDF',
    exportMd: 'EXPORTAR .MD',
    exportReport: 'EXPORTAR RELATÓRIO + ANÁLISE IA',
    playAgain: 'JOGAR DE NOVO',
    madeBy: 'Feito por',
    aiButton: 'ANÁLISE COM IA',
    aiLoading: 'Gerando análise...',
    aiUnavailable:
      'A análise com IA só funciona após o deploy na Vercel (com a chave configurada). Use o .md ou o PDF por enquanto.',
    aiError: 'Não foi possível gerar a análise. Tente de novo.',
    rankingTitle: 'RANKING',
    rankingEmpty: 'Ainda sem pontuações',
    rankingUnavailable: 'Ranking disponível após o deploy',
    saveScore: 'SALVAR NO RANKING',
    saving: 'Salvando...',
    saved: 'Salvo!',
  },
}

export type Texts = (typeof TEXTS)['en']

interface I18nContextValue {
  language: Language
  t: Texts
  toggleLanguage: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function initialLanguage(): Language {
  try {
    return localStorage.getItem('cca-language') === 'pt' ? 'pt' : 'en'
  } catch {
    return 'en'
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => {
      const next = current === 'en' ? 'pt' : 'en'
      try {
        localStorage.setItem('cca-language', next)
      } catch {
        void 0
      }
      return next
    })
  }, [])

  return (
    <I18nContext.Provider value={{ language, t: TEXTS[language], toggleLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside an I18nProvider')
  return ctx
}
