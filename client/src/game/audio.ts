let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let musicTimer: number | null = null
let musicMode: 'calm' | 'action' | null = null
let step = 0

try {
  muted = localStorage.getItem('cca-muted') === '1'
} catch {
  muted = false
}

const CALM_MELODY = [
  329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 329.63, 261.63, 392.0, 440.0,
  523.25, 440.0, 392.0, 329.63, 293.66, 261.63,
]

const ACTION_MELODY = [
  440.0, 523.25, 659.25, 880.0, 659.25, 523.25, 587.33, 698.46, 587.33, 440.0,
  523.25, 659.25, 783.99, 659.25, 523.25, 440.0,
]

const TRACKS = {
  calm: { notes: CALM_MELODY, interval: 380, type: 'triangle' as OscillatorType, peak: 0.05 },
  action: { notes: ACTION_MELODY, interval: 190, type: 'square' as OscillatorType, peak: 0.045 },
}

function ensure(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 1
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

if (typeof window !== 'undefined') {
  const unlock = () => {
    ensure()
    window.removeEventListener('pointerdown', unlock)
  }
  window.addEventListener('pointerdown', unlock)
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  peak: number,
) {
  if (!ctx || !master) return
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.linearRampToValueAtTime(peak, start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(g)
  g.connect(master)
  osc.start(start)
  osc.stop(start + dur + 0.02)
}

function sweep(
  from: number,
  to: number,
  dur: number,
  type: OscillatorType,
  peak: number,
) {
  if (!ctx || !master) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur)
  g.gain.setValueAtTime(peak, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g)
  g.connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function sequence(notes: number[], interval: number, type: OscillatorType, peak: number) {
  const c = ensure()
  if (!c) return
  notes.forEach((n, i) => tone(n, c.currentTime + i * interval, interval * 1.4, type, peak))
}

export const audioEngine = {
  isMuted: () => muted,

  setMuted(v: boolean) {
    muted = v
    if (master) master.gain.value = v ? 0 : 1
    try {
      localStorage.setItem('cca-muted', v ? '1' : '0')
    } catch {
      void 0
    }
  },

  init() {
    ensure()
  },

  playShot() {
    ensure()
    sweep(720, 170, 0.09, 'square', 0.1)
  },

  playHit() {
    const c = ensure()
    if (!c) return
    tone(660, c.currentTime, 0.08, 'square', 0.1)
    tone(990, c.currentTime + 0.06, 0.12, 'square', 0.1)
  },

  playCorrect() {
    sequence([523.25, 659.25, 783.99], 0.11, 'triangle', 0.09)
  },

  playWrong() {
    const c = ensure()
    if (!c) return
    tone(311.13, c.currentTime, 0.14, 'square', 0.08)
    tone(233.08, c.currentTime + 0.12, 0.2, 'square', 0.08)
  },

  playWin() {
    sequence([523.25, 659.25, 783.99, 1046.5], 0.12, 'square', 0.09)
  },

  playLose() {
    const c = ensure()
    if (!c) return
    tone(392, c.currentTime, 0.16, 'square', 0.08)
    tone(311.13, c.currentTime + 0.14, 0.16, 'square', 0.08)
    tone(233.08, c.currentTime + 0.28, 0.26, 'square', 0.08)
  },

  startMusic(mode: 'calm' | 'action' = 'calm') {
    const c = ensure()
    if (!c) return
    if (musicMode === mode && musicTimer !== null) return
    if (musicTimer !== null) {
      window.clearInterval(musicTimer)
      musicTimer = null
    }
    musicMode = mode
    step = 0
    const track = TRACKS[mode]
    musicTimer = window.setInterval(() => {
      if (!ctx || muted) {
        step++
        return
      }
      const t = ctx.currentTime
      const note = track.notes[step % track.notes.length]
      tone(note, t, (track.interval / 1000) * 0.85, track.type, track.peak)
      if (step % 4 === 0) tone(130.81, t, 0.4, 'triangle', 0.045)
      step++
    }, track.interval)
  },

  stopMusic() {
    if (musicTimer !== null) {
      window.clearInterval(musicTimer)
      musicTimer = null
    }
    musicMode = null
  },
}
