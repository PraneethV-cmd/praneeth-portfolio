/**
 * Grain — a resolution-independent film-grain overlay.
 *
 * Uses an inline SVG `feTurbulence` filter rendered to a tiled data URI, so it
 * adds zero image weight and stays crisp at any DPI. It sits above the page
 * background but below content (content lives on a `z-10` layer), and uses
 * blend modes so the same noise reads well on white and on near-black.
 */
export function Grain() {
  const noise = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
       <filter id='n'>
         <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/>
         <feColorMatrix type='saturate' values='0'/>
       </filter>
       <rect width='100%' height='100%' filter='url(#n)'/>
     </svg>`,
  )

  return (
    <>
      {/* light theme: dark specks via multiply */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.16] mix-blend-multiply dark:hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,${noise}")`,
          backgroundSize: '160px 160px',
        }}
      />
      {/* dark theme: light specks via soft-light, lower opacity to stay subtle */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] hidden opacity-[0.10] mix-blend-soft-light dark:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,${noise}")`,
          backgroundSize: '160px 160px',
        }}
      />
    </>
  )
}
