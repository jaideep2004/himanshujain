// Himanshu Jain® — Single Project / Blog Showcase (1:1 Mobius /work/soma-studio)
import './single-work.css'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ——— 00. LENIS SMOOTH SCROLL ———
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// ——— LIVE TIMEZONE CLOCK (Fixed Widget) ———
function updateClock() {
  const clockEl = document.getElementById('live-clock')
  if (!clockEl) return
  const now = new Date()
  const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }
  const timeStr = now.toLocaleTimeString('en-US', options).toUpperCase()
  clockEl.innerHTML = `NEW DELHI, IN <strong>${timeStr}</strong>`
}
updateClock()
setInterval(updateClock, 10000)

// ——— SCROLL REVEALS ———
gsap.from('.project-hero-left', {
  scale: 1.06,
  opacity: 0.7,
  duration: 1.2,
  ease: 'power3.out'
})

gsap.from('.project-hero-right', {
  y: 30,
  opacity: 0,
  duration: 0.9,
  ease: 'power3.out',
  delay: 0.15
})

document.querySelectorAll('[data-reveal]').forEach(el => {
  gsap.from(el, {
    y: 28,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })
})

// Metrics Stagger
gsap.from('.metric-card-val', {
  y: 30,
  opacity: 0,
  duration: 0.7,
  stagger: 0.1,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.project-metrics-grid',
    start: 'top 85%'
  }
})
