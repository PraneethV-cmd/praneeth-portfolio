'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

type DitherAvatarProps = {
  /**
   * Optional image to dither (drop a portrait in /public and pass e.g. "/me.jpg").
   * When omitted, an animated, lit procedural orb is rendered instead.
   */
  src?: string
  /** Size of each dither cell in CSS px. Larger = chunkier pixels. */
  pixelSize?: number
  className?: string
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

// Ordered (Bayer) dithering. The Bayer8 macro is the well-known compact
// recursive form — one threshold per cell, giving crisp, stable pixel dots.
const FRAG = `
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform float uPixel;
uniform vec3  uColor;
uniform float uInvert;     // 1.0 when dots represent darkness (light theme)
uniform float uHasImage;
uniform sampler2D uImage;

float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
#define Bayer4(a) (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  // Quantise to a chunky cell grid, then sample everything at the cell centre.
  vec2 cell = floor(gl_FragCoord.xy / uPixel);
  vec2 px   = (cell + 0.5) * uPixel;

  float lum;
  float mask;

  if (uHasImage > 0.5) {
    vec2 iuv = vec2(px.x / uResolution.x, 1.0 - px.y / uResolution.y);
    vec4 tex = texture2D(uImage, iuv);
    lum  = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    mask = step(0.02, tex.a);
  } else {
    // Centred, aspect-correct coords roughly in [-1, 1].
    float m = min(uResolution.x, uResolution.y);
    vec2 uv = (px - 0.5 * uResolution) / m * 2.0;
    float r = length(uv);
    float radius = 0.92;
    if (r < radius) {
      float z = sqrt(radius * radius - r * r);
      vec3 n = normalize(vec3(uv, z));
      // Slowly orbiting key light → the orb appears to turn.
      vec3 lightDir = normalize(vec3(cos(uTime * 0.6), 0.35 + 0.45 * sin(uTime * 0.5), 0.85));
      float diff = clamp(dot(n, lightDir), 0.0, 1.0);
      vec3 ref = reflect(-lightDir, n);
      float spec = pow(clamp(ref.z, 0.0, 1.0), 18.0);
      float grain = (hash(cell + floor(uTime * 4.0)) - 0.5) * 0.07;
      lum  = diff * 0.92 + spec * 0.5 + 0.08 + grain;
      mask = 1.0;
    } else {
      lum  = 0.0;
      mask = 0.0;
    }
  }

  float d = uInvert > 0.5 ? (1.0 - lum) : lum;
  float on = step(Bayer8(cell), d) * mask;
  gl_FragColor = vec4(uColor, on);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function DitherAvatar({
  src,
  pixelSize = 3,
  className,
}: DitherAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  // Keep the latest theme readable from inside the render loop without
  // tearing down WebGL on every toggle.
  const themeRef = useRef(resolvedTheme)
  themeRef.current = resolvedTheme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl =
      canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    if (!gl) return

    const vert = compile(gl, gl.VERTEX_SHADER, VERT)
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vert || !frag) return
    const program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Fullscreen quad.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const u = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      time: gl.getUniformLocation(program, 'uTime'),
      pixel: gl.getUniformLocation(program, 'uPixel'),
      color: gl.getUniformLocation(program, 'uColor'),
      invert: gl.getUniformLocation(program, 'uInvert'),
      hasImage: gl.getUniformLocation(program, 'uHasImage'),
      image: gl.getUniformLocation(program, 'uImage'),
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let hasImage = 0

    const resize = () => {
      const w = Math.max(1, canvas.clientWidth)
      const h = Math.max(1, canvas.clientHeight)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Optional image texture.
    if (src) {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      // 1px placeholder until the image arrives.
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0]),
      )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        hasImage = 1
      }
      img.src = src
      gl.uniform1i(u.image, 0)
    }

    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let raf = 0
    let onScreen = true
    const start = performance.now()

    // Only animate while the canvas is actually visible and the tab is
    // focused — no point spinning the GPU for an offscreen orb.
    const shouldRun = () => onScreen && !document.hidden && !reduce

    const drawFrame = (now: number) => {
      const t = reduce ? 0 : (now - start) / 1000
      const dark = themeRef.current === 'dark'

      gl.uniform2f(u.resolution, canvas.width, canvas.height)
      gl.uniform1f(u.time, t)
      gl.uniform1f(u.pixel, pixelSize * dpr)
      gl.uniform1f(u.hasImage, hasImage)
      gl.uniform1f(u.invert, dark ? 0.0 : 1.0)
      if (dark) gl.uniform3f(u.color, 0.98, 0.98, 0.99) // light dots on dark
      else gl.uniform3f(u.color, 0.09, 0.09, 0.11) // dark dots on light

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const loop = (now: number) => {
      drawFrame(now)
      raf = shouldRun() ? requestAnimationFrame(loop) : 0
    }
    const ensureRunning = () => {
      if (!raf && shouldRun()) raf = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        ensureRunning()
      },
      { threshold: 0 },
    )
    io.observe(canvas)
    document.addEventListener('visibilitychange', ensureRunning)

    // Paint one frame immediately (covers the reduced-motion + initial cases).
    drawFrame(start)
    ensureRunning()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', ensureRunning)
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
    }
  }, [src, pixelSize])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
