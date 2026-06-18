// Shared text-scramble engine. Decodes `from` → `to` one frame at a time,
// emitting HTML (the still-scrambling glyphs are wrapped so they can be dimmed).
// `< > &` are deliberately excluded from the pool so the emitted HTML is safe.
const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!-_\\/[]{}=+*^?#@%$'

const rand = (n: number) => Math.floor(Math.random() * n)

type ScrambleOptions = {
  from: string
  to: string
  /** Approx. number of frames the decode takes (longer = slower reveal). */
  duration?: number
  onUpdate: (html: string) => void
  onComplete?: () => void
}

/**
 * Run a single scramble→resolve pass. Returns a cancel function.
 * Pass `from === to` for a "decode in place" effect (scramble each glyph, then
 * reform the same word) — used for the project names on hover.
 */
export function runScramble({
  from,
  to,
  duration = 24,
  onUpdate,
  onComplete,
}: ScrambleOptions): () => void {
  const length = Math.max(from.length, to.length)
  const queue: {
    from: string
    to: string
    start: number
    end: number
    char?: string
  }[] = []

  for (let i = 0; i < length; i++) {
    const start = rand(Math.floor(duration * 0.4))
    const end = start + rand(Math.floor(duration * 0.7)) + 5
    queue.push({ from: from[i] || '', to: to[i] || '', start, end })
  }

  let frame = 0
  let raf = 0
  let cancelled = false

  const update = () => {
    if (cancelled) return
    let out = ''
    let complete = 0
    for (const item of queue) {
      if (frame >= item.end) {
        complete++
        out += item.to
      } else if (frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = CHARS[rand(CHARS.length)]
        }
        out += `<span class="opacity-50">${item.char}</span>`
      } else {
        out += item.from
      }
    }
    onUpdate(out)
    if (complete === queue.length) {
      onComplete?.()
    } else {
      frame++
      raf = requestAnimationFrame(update)
    }
  }

  update()
  return () => {
    cancelled = true
    if (raf) cancelAnimationFrame(raf)
  }
}
