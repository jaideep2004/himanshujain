import './style.css'
// Himanshu Jain® — 1:1 Mobius Motion System
// GSAP + Lenis + ScrollTrigger
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ——— 00. LENIS VIRTUAL SMOOTH SCROLL ———
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

// ——— GRID DEBUG TOGGLE (Ctrl+G) ———
const grid = document.getElementById('grid-debug')
if (grid) {
  for (let i = 0; i < 12; i++) grid.appendChild(document.createElement('span'))
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      e.preventDefault()
      grid.classList.toggle('on')
    }
  })
}

// ——— 01. HERO ENTRANCE ON PAGE LOAD ———
const heroTitle = document.querySelector('.hero-giant-title')
const heroYear = document.querySelector('.hero-year')
const card1 = document.querySelector('.fan-card--1')
const card2 = document.querySelector('.fan-card--2')
const card3 = document.querySelector('.fan-card--3')
const card4 = document.querySelector('.fan-card--4')
const heroDot = document.querySelector('.hero-dot-accent')
const heroIntro = document.querySelector('.hero-intro')

// Initial states before animation
gsap.set(heroTitle, { scale: 1.35, opacity: 0.001, transformOrigin: 'left 60%' })
gsap.set(heroYear, { y: 16, opacity: 0 })
if (heroIntro) gsap.set(heroIntro, { opacity: 0, y: 20 })
if (heroDot) gsap.set(heroDot, { scale: 0, opacity: 0 })

// Cards start down below and grouped upright
const cards = [card1, card2, card3, card4]
cards.forEach(c => {
  if (c) gsap.set(c, { y: 600, opacity: 0, rotation: 0, x: 0 })
})

// Hero Entrance Timeline on Page Load
const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } })

heroTl
  // 1. Giant Title breathe-in
  .to(heroTitle, { scale: 1, opacity: 1, duration: 0.85, ease: 'expo.out', delay: 0.15 }, 0)
  // 2. Year rise
  .to(heroYear, { y: 0, opacity: 0.92, duration: 0.55, ease: 'expo.out' }, 0.35)
  // 3. Intro text fade in
  .to(heroIntro, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.3)
  // 4. Cards rise one by one smoothly and fan into position
  .to(card1, { y: 12, x: -28, rotation: -16, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.2)
  .to(card2, { y: 16, x: 24, rotation: 6, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.32)
  .to(card3, { y: -6, x: -14, rotation: -8, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.44)
  .to(card4, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.56)
  // 5. Dot accent pops in
  .to(heroDot, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.75)

// ——— 02. MANIFESTO A: PINNED SCATTERED STRAIGHT WORDS GLIDING ON SCROLL ———
const scatterWords = document.querySelectorAll('.scatter-word')
const manifestoDot = document.getElementById('manifesto-dot')

if (scatterWords.length > 0) {
  // Set initial straight scattered positions (NO rotation, clean & simple)
  scatterWords.forEach(word => {
    const sx = parseFloat(word.getAttribute('data-sx')) || 500
    const sy = parseFloat(word.getAttribute('data-sy')) || 0
    gsap.set(word, {
      x: sx,
      y: sy,
      rotation: 0, // strictly straight
      opacity: 0.25,
      scale: 1.05
    })
  })
  if (manifestoDot) {
    gsap.set(manifestoDot, { x: 280, y: -60, opacity: 0.2, scale: 0.5 })
  }

  // Pinned scrub on scroll through the section
  ScrollTrigger.create({
    trigger: '#manifesto',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    onUpdate: (self) => {
      // Assemble words smoothly between 0.0 and 0.82 progress
      const p = Math.min(self.progress / 0.82, 1)
      
      scatterWords.forEach(word => {
        const sx = parseFloat(word.getAttribute('data-sx')) || 500
        const sy = parseFloat(word.getAttribute('data-sy')) || 0
        gsap.set(word, {
          x: gsap.utils.interpolate(sx, 0, p),
          y: gsap.utils.interpolate(sy, 0, p),
          rotation: 0, // strictly straight
          opacity: gsap.utils.interpolate(0.25, 1, p),
          scale: gsap.utils.interpolate(1.05, 1, p)
        })
      })

      if (manifestoDot) {
        gsap.set(manifestoDot, {
          x: gsap.utils.interpolate(280, 0, p),
          y: gsap.utils.interpolate(-60, 0, p),
          opacity: gsap.utils.interpolate(0.2, 1, p),
          scale: gsap.utils.interpolate(0.5, 1, p)
        })
      }
    }
  })
}

// ——— 03. GENERAL REVEALS ———
document.querySelectorAll('[data-reveal]').forEach(el => {
  gsap.from(el, {
    y: 28,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  })
})

// ——— 04. TICKER SCROLL VELOCITY ACCELERATION ———
const tickerLeft = document.getElementById('ticker-left')
const tickerRight = document.getElementById('ticker-right')

lenis.on('scroll', ({ velocity }) => {
  const skew = Math.min(Math.max(velocity * 0.15, -4), 4)
  if (tickerLeft && tickerRight) {
    gsap.to([tickerLeft, tickerRight], {
      skewX: skew,
      duration: 0.3,
      ease: 'power1.out'
    })
  }
})

// ——— 05. SERVICES REVEALS ———
document.querySelectorAll('[data-service]').forEach((srv) => {
  gsap.from(srv, {
    y: 28,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: srv,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })
})

// ——— 06. IN NUMBERS: GIANT PHOTO NUMBER SWITCHER (clamp(260px, 33vw, 500px)) ———
const storyBlocks = document.querySelectorAll('.num-story-block')
const maskedNumVal = document.getElementById('masked-num-val')

const numberValues = {
  '1': '4',
  '2': '110',
  '3': '9+'
}

storyBlocks.forEach((block) => {
  const step = block.getAttribute('data-num-step')
  ScrollTrigger.create({
    trigger: block,
    start: 'top 55%',
    end: 'bottom 45%',
    onEnter: () => updateGiantMaskedNumber(step),
    onEnterBack: () => updateGiantMaskedNumber(step)
  })
})

function updateGiantMaskedNumber(step) {
  if (!numberValues[step] || !maskedNumVal) return
  if (maskedNumVal.textContent === numberValues[step]) return
  
  gsap.to(maskedNumVal, {
    opacity: 0.1,
    scale: 0.92,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      maskedNumVal.textContent = numberValues[step]
      gsap.to(maskedNumVal, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out'
      })
    }
  })
}

// ——— 07. FRAMEWORK ROWS STAGGER (Mobius Awards Layout) ———
document.querySelectorAll('[data-framework-row]').forEach((row, idx) => {
  gsap.from(row, {
    x: -20,
    opacity: 0,
    duration: 0.5,
    delay: idx * 0.06,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.framework-list',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })
})

// ——— 08. PROCESS STEPS PARALLAX ———
document.querySelectorAll('.process-step-item').forEach((card, idx) => {
  gsap.to(card, {
    y: (idx % 2 === 0 ? -16 : 16),
    ease: 'none',
    scrollTrigger: {
      trigger: '.process-steps-grid',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  })
})

// ——— 10. CLIENT REFLECTIONS (Mobius 1:1 Interactive Slider) ———
const testimonialsData = [
  {
    idx: '/1',
    img: 'https://framerusercontent.com/images/91tSqsa2UCoJo8t9Pw7JOunYw.jpg?width=600&height=750',
    quote: '“Himanshu Jain® turned our complex product messaging into something sharp, clear, and high-converting. They identified growth bottlenecks quickly and built an acquisition engine that unlocked predictable monthly pipeline.”',
    name: 'Siddharth M.',
    role: 'Managing Director, Luxury Real Estate India'
  },
  {
    idx: '/2',
    img: 'https://framerusercontent.com/images/JUqCPovcIKHCGuuLShMUORkvJI.jpg?width=600&height=750',
    quote: '“They delivered a level of clarity we’d been missing for years. Himanshu Jain® took our scattered ad accounts and shaped them into a cohesive acquisition engine that finally scales with positive unit economics.”',
    name: 'Jonas Berg',
    role: 'Founder & CEO, Arcton Labs'
  },
  {
    idx: '/3',
    img: 'https://framerusercontent.com/images/8s1d41G36Gw3wKjdAqv9BP0vZo.jpg?width=600&height=750',
    quote: '“The level of attribution precision and creative agility is unmatched. They don’t just optimize ad spend; they rebuild the entire post-click economics across Google, Meta, and YouTube.”',
    name: 'Natasha K.',
    role: 'Head of Growth, Multi-Market D2C Brand'
  }
]

let currentSlide = 0
const refImg = document.getElementById('ref-active-img')
const refIdx = document.getElementById('ref-active-idx')
const refQuote = document.getElementById('ref-active-quote')
const refName = document.getElementById('ref-active-name')
const refRole = document.getElementById('ref-active-role')
const prevBtn = document.getElementById('slider-prev')
const nextBtn = document.getElementById('slider-next')

function renderTestimonial(index) {
  const data = testimonialsData[index]
  if (!data || !refQuote) return

  // Transition out
  gsap.to([refImg, refIdx, refQuote, refName, refRole], {
    opacity: 0,
    y: 10,
    duration: 0.22,
    ease: 'power2.in',
    onComplete: () => {
      // Update DOM
      if (refImg) refImg.src = data.img
      if (refIdx) refIdx.textContent = data.idx
      if (refQuote) refQuote.textContent = data.quote
      if (refName) refName.textContent = data.name
      if (refRole) refRole.textContent = data.role

      // Transition in
      gsap.to([refImg, refIdx, refQuote, refName, refRole], {
        opacity: 1,
        y: 0,
        duration: 0.38,
        ease: 'power3.out'
      })
    }
  })
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + testimonialsData.length) % testimonialsData.length
    renderTestimonial(currentSlide)
  })

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % testimonialsData.length
    renderTestimonial(currentSlide)
  })
}

// ——— 11. PRICING TOGGLE (Monthly vs Yearly -20%) ———
const toggleBtns = document.querySelectorAll('.pricing-toggle .toggle-btn')
const pricingCards = document.querySelectorAll('[data-pricing-card]')

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    const plan = btn.getAttribute('data-plan')

    if (pricingCards.length >= 2) {
      if (plan === 'monthly') {
        pricingCards[0].querySelector('.price-val strong').textContent = '$6,500'
        pricingCards[0].querySelector('.price-strike').style.display = 'none'
        pricingCards[1].querySelector('.price-val strong').textContent = '$12,000'
        pricingCards[1].querySelector('.price-strike').style.display = 'none'
      } else {
        pricingCards[0].querySelector('.price-val strong').textContent = '$5,200'
        pricingCards[0].querySelector('.price-strike').style.display = 'inline'
        pricingCards[1].querySelector('.price-val strong').textContent = '$9,800'
        pricingCards[1].querySelector('.price-strike').style.display = 'inline'
      }
    }
  })
})

// Refresh triggers after fonts and layout settle
window.addEventListener('load', () => ScrollTrigger.refresh())
setTimeout(() => ScrollTrigger.refresh(), 800)
