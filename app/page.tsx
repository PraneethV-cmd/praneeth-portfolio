'use client'
import { motion } from 'motion/react'
import { Magnetic } from '@/components/ui/magnetic'
import { cn } from '@/lib/utils'
import { INTERACTIVE_BASE, INTERACTIVE_SURFACE } from '@/lib/constants'
import { PROJECTS, EMAIL, SOCIAL_LINKS } from './data'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

function ProjectCard({
  project,
}: {
  project: { name: string; description: string; link: string }
}) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-[family-name:var(--font-geist-mono)] dark:border-zinc-800 dark:bg-zinc-900/50',
        INTERACTIVE_BASE,
        'hover:border-transparent hover:bg-[#0000EE] hover:shadow-[0_14px_34px_-14px_rgba(0,0,238,0.55)] dark:hover:bg-[#FF1493] dark:hover:shadow-[0_14px_34px_-14px_rgba(255,20,147,0.5)]',
      )}
    >
      <h4 className="text-sm font-medium text-zinc-900 transition-colors group-hover:text-white dark:text-zinc-50">
        {project.name}
      </h4>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600 transition-colors group-hover:text-white/90 dark:text-zinc-400 dark:group-hover:text-white/90">
        {project.description}
      </p>
    </a>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group inline-flex shrink-0 items-center gap-[1px] rounded-full px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-sm',
          INTERACTIVE_BASE,
          INTERACTIVE_SURFACE,
        )}
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          aria-hidden="true"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </Magnetic>
  )
}

export default function Personal() {
  return (
    <motion.main
      className="space-y-20"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <p className="text-zinc-600 dark:text-zinc-400">
          Focused on developing things from scratch and exploring different
          interesting things.
        </p>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-xl">
          Selected Projects
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-xl">
          Connect
        </h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{' '}
          <a
            className="underline underline-offset-2 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
        </p>
        <div className="flex flex-wrap items-center justify-start gap-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
