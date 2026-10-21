'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Fades/slides a section in the first time it scrolls into view. Pair the
// returned ref with the `story-reveal` class from globals.css.
export function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, visible])

  return { ref, visible }
}

// Animates a number from 0 to `target` with a cubic ease-out once `active`
// becomes true, matching the prototype's counter (1400ms, eased).
export function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) {
      const id = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(id)
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - k, 3)
      setValue(Math.round(target * eased))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, durationMs])

  return value
}

// Fixed top progress bar tied to how far down the page the reader has
// scrolled, matching the prototype's #bar.
export function useScrollProgress() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setPercent(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return percent
}

// Press-and-hold progress (pointer or Space/Enter), matching the prototype's
// "carry the water" interaction: holding fills over `durationMs`, releasing
// early lets it drain back down rather than resetting instantly.
export function usePressHold(durationMs = 7000, decayPerTick = 0.03) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const [finished, setFinished] = useState(false)
  const stateRef = useRef({ holding: false, finished: false, start: 0, progress: 0 })
  const rafRef = useRef(0)
  const tickRef = useRef<() => void>(() => {})

  const tick = useCallback(() => {
    const s = stateRef.current
    if (s.holding) {
      s.progress = Math.min(1, (performance.now() - s.start) / durationMs)
    } else if (!s.finished) {
      s.progress = Math.max(0, s.progress - decayPerTick)
    }
    setProgress(s.progress)
    if (s.holding && s.progress >= 1 && !s.finished) {
      s.finished = true
      setFinished(true)
    }
    if (s.holding || (!s.finished && s.progress > 0)) {
      rafRef.current = requestAnimationFrame(() => tickRef.current())
    }
  }, [durationMs, decayPerTick])

  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  const begin = useCallback(() => {
    const s = stateRef.current
    if (s.holding) return
    // A completed hold leaves progress at 1 and stops decaying it (the ring
    // stays full while showing "Press to try again"). Starting again should
    // restart from empty, not resume from an already-full ring.
    if (s.finished) s.progress = 0
    s.holding = true
    s.finished = false
    s.start = performance.now() - s.progress * durationMs
    setHolding(true)
    setFinished(false)
    setProgress(s.progress)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [durationMs, tick])

  const end = useCallback(() => {
    const s = stateRef.current
    if (!s.holding) return
    s.holding = false
    setHolding(false)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return { progress, holding, finished, begin, end }
}
