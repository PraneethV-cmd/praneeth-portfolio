'use client'

import { useEffect, useState } from 'react'
import { runScramble } from '@/lib/scramble'

type ScrambleTextProps = {
  /** Strings to cycle through, in order. */
  words: string[]
  /** ms each fully-resolved word is held before morphing to the next. */
  hold?: number
  /** Approx. frames the scramble morph takes. */
  duration?: number
  className?: string
}

/**
 * Endlessly decodes between `words` using the shared scramble engine.
 * Used for the multilingual "[ learning ]" in the header. Honours
 * `prefers-reduced-motion` by rendering the first word statically.
 */
export function ScrambleText({
  words,
  hold = 2200,
  duration = 30,
  className,
}: ScrambleTextProps) {
  const [html, setHtml] = useState(words[0] ?? '')

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || words.length <= 1) {
      setHtml(words[0] ?? '')
      return
    }

    let cancelled = false
    let index = 0
    let cancelScramble: (() => void) | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const next = () => {
      if (cancelled) return
      const to = (index + 1) % words.length
      cancelScramble = runScramble({
        from: words[index],
        to: words[to],
        duration,
        onUpdate: setHtml,
        onComplete: () => {
          index = to
          timer = setTimeout(next, hold)
        },
      })
    }
    timer = setTimeout(next, hold)

    return () => {
      cancelled = true
      cancelScramble?.()
      if (timer) clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span
      className={className}
      // Safe: values come only from the static `words` prop and the fixed
      // glyph pool in lib/scramble (which excludes < > &).
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
