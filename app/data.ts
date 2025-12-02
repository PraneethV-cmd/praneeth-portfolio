type Project = {
  name: string
  description: string
  link: string
  id: string
}


type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'hash-nimbus',
    description:
      'Hash Nimbus is a simple distributed key-value store that uses the Raft consensus model for leader election, log replication, and persistence. It ensures strong consistency and fault tolerance across multiple nodes.',
    link: 'https://github.com/PraneethV-cmd/hash-nimbus',
    id: 'project1',
  },
  {
    name: 'bubble-git',
    description: 'Bubble Git is a lightweight, custom implementation of a version control system inspired by Git. It is built from scratch, focusing on the fundamental internals of how Git works.',
    link: 'https://github.com/PraneethV-cmd/bubble-git',
    id: 'project2',
  },
]

//export const BLOG_POSTS: BlogPost[] = [
//  {
//    title: 'Exploring the Intersection of Design, AI, and Design Engineering',
//    description: 'How AI is changing the way we design',
//    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
//    uid: 'blog-1',
//  },
//  {
//    title: 'Why I left my job to start my own company',
//    description:
//      'A deep dive into my decision to leave my job and start my own company',
//    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
//    uid: 'blog-2',
//  },
//  {
//    title: 'What I learned from my first year of freelancing',
//    description:
//      'A look back at my first year of freelancing and what I learned',
//    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
//    uid: 'blog-3',
//  },
//  {
//    title: 'How to Export Metadata from MDX for Next.js SEO',
//    description: 'A guide on exporting metadata from MDX files to leverage Next.js SEO features.',
//    link: '/blog/example-mdx-metadata',
//    uid: 'blog-4',
//  },
//]
//
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/PraneethV-cmd',
  },
  {
    label: 'Twitter',
    link: 'https://x.com/Bananameatpatty',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/praneethv2213',
  },
]

export const EMAIL = 'praneethv375@gmail.com'
