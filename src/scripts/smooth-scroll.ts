const HEADER_HEIGHT = 72 // 64px header + 8px padding
const DURATION = 900

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function smoothScrollTo(targetY: number) {
  const startY = window.scrollY
  const diff = targetY - startY
  const start = performance.now()

  function step(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / DURATION, 1)
    const eased = easeInOutCubic(progress)
    window.scrollTo(0, startY + diff * eased)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('a[href*="#"]')
  if (!link) return

  const href = link.getAttribute('href')
  if (!href) return

  // Handle both "#section" and "/#section" formats
  let hash: string
  if (href.startsWith('#')) {
    hash = href
  } else if (href.startsWith('/#')) {
    // Only handle on homepage
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return
    hash = href.slice(1) // remove leading "/"
  } else {
    return
  }

  const target = document.querySelector(hash)
  if (!target) return

  e.preventDefault()

  const targetY = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
  smoothScrollTo(targetY)

  // Update URL without scroll
  history.pushState(null, '', hash)
})
