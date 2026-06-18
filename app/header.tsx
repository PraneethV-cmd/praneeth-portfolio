'use client'
import Link from 'next/link'
import { DitherAvatar } from '@/components/ui/dither-avatar'
import { ScrambleText } from '@/components/ui/scramble-text'

// "learning" across the requested scripts: English, Chinese, Japanese,
// Vietnamese, Thai, Tamil.
const LEARNING = ['learning', '学习', '学習', 'học tập', 'การเรียนรู้', 'கற்றல்']

export function Header() {
  return (
    <header className="mb-12 flex items-center gap-4">
      <DitherAvatar
        // Drop a portrait in /public and pass src="/your-photo.jpg" to dither it.
        pixelSize={3}
        className="h-16 w-16 shrink-0"
      />
      <div className="min-w-0">
        <Link
          href="/"
          className="text-2xl tracking-tight text-black dark:text-white"
        >
          Praneeth V
        </Link>
        {/* Fixed leading-6 keeps the line box constant across scripts so the
            multilingual scramble never reflows the page. */}
        <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-500">
          Comp Scientist
          <span className="mx-1.5 text-zinc-400 dark:text-zinc-600">–</span>
          <span className="whitespace-nowrap text-zinc-500 dark:text-zinc-400">
            [
            <ScrambleText
              words={LEARNING}
              className="inline-block w-[11ch] text-center align-baseline text-zinc-700 dark:text-zinc-300"
            />
            ]
          </span>
        </p>
      </div>
    </header>
  )
}
