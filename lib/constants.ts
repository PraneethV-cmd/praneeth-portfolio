export const WEBSITE_URL = 'https://praneeth-cmd.vercel.app'

// Single source of truth for every interactive element (pills + project cards)
// so the whole site shares one hover language: a small lift + a color flip to
// Microsoft web-1.0 blue #0000EE (light) / hot pink #FF1493 (dark), white text.
export const INTERACTIVE_BASE =
  'transition-all duration-200 ease-out will-change-transform hover:-translate-y-1'

export const INTERACTIVE_SURFACE =
  'bg-zinc-100 text-zinc-700 hover:bg-[#0000EE] hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-[#FF1493] dark:hover:text-white'
