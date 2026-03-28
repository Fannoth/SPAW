const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement
        // Stagger: use data-delay or calculate from sibling index
        const delay = el.dataset.delay
        if (delay) {
          setTimeout(() => el.classList.add('animate-in'), parseInt(delay, 10))
        } else {
          el.classList.add('animate-in')
        }
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
)

// Auto-assign stagger delays to grid children
document.querySelectorAll('.stagger-children').forEach((grid) => {
  const children = grid.querySelectorAll('.animate-on-scroll')
  children.forEach((child, i) => {
    ;(child as HTMLElement).dataset.delay = String(i * 100)
  })
})

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
