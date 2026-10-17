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
window.lenis = lenis
window.ScrollTrigger = ScrollTrigger
window.gsap = gsap

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
const heroHook = document.querySelector('.hero-hook-title')
const heroDesc = document.querySelector('.hero-desc')
const heroLocs = document.querySelector('.hero-locations-row')
const heroCta = document.querySelector('.hero-cta-btn')

// Initial states before animation
if (heroTitle) gsap.set(heroTitle, { scale: 1.35, opacity: 0.001, transformOrigin: 'left 60%' })
if (heroYear) gsap.set(heroYear, { y: 16, opacity: 0 })
if (heroIntro) gsap.set(heroIntro, { opacity: 0, y: 20 })
if (heroHook) gsap.set(heroHook, { opacity: 0, y: 30 })
if (heroDesc) gsap.set(heroDesc, { opacity: 0, y: 20 })
if (heroLocs) gsap.set(heroLocs, { opacity: 0, y: 15 })
if (heroCta) gsap.set(heroCta, { opacity: 0, y: 15 })
if (heroDot) gsap.set(heroDot, { scale: 0, opacity: 0 })

// Cards start down below and grouped upright
const cards = [card1, card2, card3, card4]
cards.forEach(c => {
  if (c) gsap.set(c, { y: 600, opacity: 0, rotation: 0, x: 0 })
})

// Hero Entrance Timeline on Page Load
const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } })

heroTl
  // 1. Giant Title breathe-in (if present)
  .to(heroTitle, { scale: 1, opacity: 1, duration: 0.85, ease: 'expo.out', delay: 0.15 }, 0)
  // 2. Year rise
  .to(heroYear, { y: 0, opacity: 0.92, duration: 0.55, ease: 'expo.out' }, 0.35)
  // 3. Left Column elements entrance
  .to(heroHook, { opacity: 1, y: 0, duration: 0.85, ease: 'expo.out' }, 0.1)
  .to(heroDesc, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.25)
  .to(heroLocs, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.35)
  .to(heroCta, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.45)
  // 4. Intro text fade in (legacy fallback if used)
  .to(heroIntro, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.3)
  // 5. Cards rise one by one smoothly and fan into position
  .to(card1, { y: 12, x: -28, rotation: -16, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.2)
  .to(card2, { y: 16, x: 24, rotation: 6, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.32)
  .to(card3, { y: -6, x: -14, rotation: -8, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.44)
  .to(card4, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.56)
  // 6. Dot accent pops in
  .to(heroDot, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.75)

// Hero bottom watermark subtle scroll glide
if (heroTitle) {
  gsap.to('.hero-bottom-bar', {
    y: -30,
    opacity: 0.88,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
}

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

// ——— 03B. PARTNERS SECTION: PINNED LOGOS & CURTAIN OVERLAP (Mobius 1:1) ———
const partnersPinSec = document.querySelector('.partners-pin-section')
const partnersStage = document.querySelector('.partners-pinned-stage')
const partnersCurtain = document.querySelector('.partners-curtain-photo-wrap')
const partnersWatermark = document.querySelector('.partners-watermark-title')
const partnersLogos = document.querySelectorAll('.p-svg')
const partnersDot = document.querySelector('.partners-black-dot')

if (partnersPinSec && partnersStage && partnersCurtain) {
  // Stagger reveal of logos on entry (Mobius 1:1)
  if (partnersLogos.length > 0) {
    gsap.fromTo(partnersLogos,
      { opacity: 0, y: 22 },
      {
        opacity: 0.82,
        y: 0,
        stagger: 0.04,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: partnersPinSec,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    )
  }

  if (partnersDot) {
    gsap.fromTo(partnersDot,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.5,
        delay: 0.35,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: partnersPinSec,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    )
  }

  if (partnersWatermark) {
    gsap.fromTo(partnersWatermark,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: partnersPinSec,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    )
  }

  // Pin the logos stage so it stays locked in viewport while curtain rises
  ScrollTrigger.create({
    trigger: partnersPinSec,
    start: 'top top',
    end: () => `+=${partnersStage.offsetHeight + 240}`,
    pin: partnersStage,
    pinSpacing: false,
    anticipatePin: 1
  })

  // Curtain photo slides up over the logos with high-end ease
  gsap.fromTo(partnersCurtain,
    { y: 70 },
    {
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: partnersCurtain,
        start: 'top 92%',
        end: 'top 20%',
        scrub: 0.8
      }
    }
  )

  // Curtain photo inner image parallax
  const curtainImg = partnersCurtain.querySelector('img')
  if (curtainImg) {
    gsap.fromTo(curtainImg,
      { y: -30, scale: 1.04 },
      {
        y: 30,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: partnersCurtain,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    )
  }

  // Fade and slight scale down of logos and watermark as curtain covers them
  gsap.to(['.partners-rows-wrap', partnersWatermark], {
    opacity: 0.1,
    scale: 0.96,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: partnersCurtain,
      start: 'top 75%',
      end: 'top 20%',
      scrub: 0.8
    }
  })
}

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

// ——— 06. IN NUMBERS: 1:1 MOBIUS VERTICAL ODOMETER REEL COUNTER ———
const storyBlocks = document.querySelectorAll('.num-story-block')
const reelHundreds = document.getElementById('reel-hundreds')
const reelTens = document.getElementById('reel-tens')
const reelUnits = document.getElementById('reel-units')
const reelSuffix = document.getElementById('reel-suffix')
const odometerReel = document.getElementById('odometer-reel')

const reelSteps = {
  1: {
    // 4
    hundreds: { show: false, yPercent: 0 },
    tens: { show: false, yPercent: 0 },
    units: { show: true, yPercent: -(4 / 10) * 100 }, // '4' is at index 4 of 10
    suffix: { show: false, yPercent: 0 }
  },
  2: {
    // 110+
    hundreds: { show: true, yPercent: -50 }, // '1' is at index 1 of 2
    tens: { show: true, yPercent: -(2 / 11) * 100 }, // '1' is at index 2 of 11 (0=empty, 1='0', 2='1')
    units: { show: true, yPercent: 0 }, // '0' is at index 0 of 10
    suffix: { show: true, yPercent: -50 } // '+' is at index 1 of 2
  },
  3: {
    // 9+
    hundreds: { show: false, yPercent: 0 },
    tens: { show: false, yPercent: 0 },
    units: { show: true, yPercent: -(9 / 10) * 100 }, // '9' is at index 9 of 10
    suffix: { show: true, yPercent: -50 }
  }
}

let activeNumStep = 1

function applyReelStep(step, immediate = false) {
  const config = reelSteps[step]
  if (!config) return

  const duration = immediate ? 0 : 1.15
  const ease = 'power3.inOut'

  // Subtle breathing bounce on container
  if (!immediate && odometerReel) {
    gsap.fromTo(odometerReel,
      { scale: 0.97 },
      { scale: 1, duration: 0.8, ease: 'power2.out' }
    )
  }

  // Hundreds Column
  if (reelHundreds) {
    const strip = reelHundreds.querySelector('.reel-strip')
    if (config.hundreds.show) {
      reelHundreds.classList.remove('is-hidden')
      gsap.to(strip, {
        yPercent: config.hundreds.yPercent,
        duration,
        ease,
        overwrite: 'auto'
      })
    } else {
      reelHundreds.classList.add('is-hidden')
      gsap.to(strip, {
        yPercent: 0,
        duration: duration * 0.6,
        ease,
        overwrite: 'auto'
      })
    }
  }

  // Tens Column
  if (reelTens) {
    const strip = reelTens.querySelector('.reel-strip')
    if (config.tens.show) {
      reelTens.classList.remove('is-hidden')
      gsap.to(strip, {
        yPercent: config.tens.yPercent,
        duration: duration * 1.05,
        delay: immediate ? 0 : 0.04,
        ease,
        overwrite: 'auto'
      })
    } else {
      reelTens.classList.add('is-hidden')
      gsap.to(strip, {
        yPercent: 0,
        duration: duration * 0.6,
        ease,
        overwrite: 'auto'
      })
    }
  }

  // Units Column
  if (reelUnits) {
    const strip = reelUnits.querySelector('.reel-strip')
    gsap.to(strip, {
      yPercent: config.units.yPercent,
      duration: duration * 1.1,
      delay: immediate ? 0 : 0.08,
      ease,
      overwrite: 'auto'
    })
  }

  // Suffix (+) Column
  if (reelSuffix) {
    const strip = reelSuffix.querySelector('.reel-strip')
    if (config.suffix.show) {
      reelSuffix.classList.remove('is-hidden')
      gsap.to(strip, {
        yPercent: config.suffix.yPercent,
        duration: duration * 0.85,
        delay: immediate ? 0 : 0.12,
        ease,
        overwrite: 'auto'
      })
    } else {
      reelSuffix.classList.add('is-hidden')
      gsap.to(strip, {
        yPercent: 0,
        duration: duration * 0.6,
        ease,
        overwrite: 'auto'
      })
    }
  }
}

// Initialize with Step 1 ('4') immediately
applyReelStep(1, true)

if (storyBlocks.length > 0) {
  storyBlocks[0].classList.add('active-story')
}

storyBlocks.forEach((block) => {
  const step = parseInt(block.getAttribute('data-num-step'))
  ScrollTrigger.create({
    trigger: block,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => setNumbersStep(step),
    onEnterBack: () => setNumbersStep(step)
  })
})

function setNumbersStep(step) {
  if (activeNumStep === step) return
  activeNumStep = step

  // Update story active highlighting
  storyBlocks.forEach((b) => {
    const s = parseInt(b.getAttribute('data-num-step'))
    if (s === step) {
      b.classList.add('active-story')
    } else {
      b.classList.remove('active-story')
    }
  })

  applyReelStep(step, false)
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

// ——— 08. THE PROCESS: STAIRCASE TIMELINE & PILLAR CARDS (Mobius 1:1) ———
const processSec = document.querySelector('.process-section')
const processHeading = document.querySelector('.process-giant-heading')
const processSub = document.querySelector('.process-sub')
const timelineScale = document.querySelector('.timeline-scale')
const stairSteps = document.querySelectorAll('.stair-step')
const stairLabels = document.querySelectorAll('.stair-label')
const processCards = document.querySelectorAll('.process-step-item')

if (processSec) {
  // 1. Heading and Subtitle entrance
  gsap.from([processHeading, processSub], {
    y: 36,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: processSec,
      start: 'top 75%'
    }
  })

  // 2. Timeline Scale markers fade in
  if (timelineScale) {
    gsap.from(timelineScale.children, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.process-diagram-wrap',
        start: 'top 80%'
      }
    })
  }

  // 3. Staircase steps expand out horizontally in cascading stagger
  if (stairSteps.length > 0) {
    const stairTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.timeline-staircase',
        start: 'top 78%'
      }
    })

    stairSteps.forEach((step, idx) => {
      stairTl.fromTo(step,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7, ease: 'expo.out' },
        idx * 0.15
      )
    })

    // Labels slide in gently inside each step
    stairLabels.forEach((label, idx) => {
      stairTl.fromTo(label,
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        idx * 0.15 + 0.15
      )
    })
  }

  // 4. 4 Process Cards staggered upward cascade
  if (processCards.length > 0) {
    gsap.from(processCards, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.process-steps-grid',
        start: 'top 80%'
      }
    })
  }
}

// ——— 09. REAL WORK. REAL RESULT — CASE STUDIES AUTO-SLIDER ———
const caseSection = document.getElementById('case-studies')
const caseSlides = document.querySelectorAll('.case-slide')
const casePills = document.querySelectorAll('.case-pill-btn')
const casePrevBtn = document.getElementById('case-prev')
const caseNextBtn = document.getElementById('case-next')
const caseProgressFill = document.getElementById('case-progress-fill')
const caseSliderWrap = document.getElementById('case-slider-wrap')

if (caseSection && caseSlides.length > 0) {
  let activeCaseIdx = 0
  const totalCaseSlides = caseSlides.length
  const SLIDE_DURATION = 6500 // 6.5s per case study slide
  let progressAnim = null
  let isHovered = false

  function switchCaseSlide(nextIdx, direction = 1) {
    if (nextIdx === activeCaseIdx) return
    
    const prevSlide = caseSlides[activeCaseIdx]
    const nextSlide = caseSlides[nextIdx]
    
    // Update navigation pills
    casePills.forEach((p, idx) => {
      p.classList.toggle('active', idx === nextIdx)
    })

    // Smooth crossfade transition
    gsap.to(prevSlide, {
      opacity: 0,
      x: direction > 0 ? -24 : 24,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        prevSlide.classList.remove('active')
        gsap.set(prevSlide, { clearProps: 'x,opacity' })
      }
    })

    nextSlide.classList.add('active')
    gsap.fromTo(nextSlide,
      { opacity: 0, x: direction > 0 ? 24 : -24 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
    )

    // Stagger metric items inside next slide
    const metrics = nextSlide.querySelectorAll('.case-m-item')
    if (metrics.length > 0) {
      gsap.fromTo(metrics,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15 }
      )
    }

    activeCaseIdx = nextIdx
    startCaseProgress()
  }

  function startCaseProgress() {
    if (progressAnim) progressAnim.kill()
    if (!caseProgressFill) return
    
    gsap.set(caseProgressFill, { width: '0%' })
    progressAnim = gsap.to(caseProgressFill, {
      width: '100%',
      duration: SLIDE_DURATION / 1000,
      ease: 'none',
      onComplete: () => {
        if (!isHovered) {
          const nextIdx = (activeCaseIdx + 1) % totalCaseSlides
          switchCaseSlide(nextIdx, 1)
        }
      }
    })
  }

  function pauseCaseSlider() {
    isHovered = true
    if (progressAnim) progressAnim.pause()
  }

  function resumeCaseSlider() {
    isHovered = false
    if (progressAnim) progressAnim.resume()
  }

  // Pill navigation handlers
  casePills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      const dir = idx > activeCaseIdx ? 1 : -1
      switchCaseSlide(idx, dir)
    })
  })

  // Arrow button handlers
  if (casePrevBtn) {
    casePrevBtn.addEventListener('click', () => {
      const prevIdx = (activeCaseIdx - 1 + totalCaseSlides) % totalCaseSlides
      switchCaseSlide(prevIdx, -1)
    })
  }

  if (caseNextBtn) {
    caseNextBtn.addEventListener('click', () => {
      const nextIdx = (activeCaseIdx + 1) % totalCaseSlides
      switchCaseSlide(nextIdx, 1)
    })
  }

  // Pause on hover
  if (caseSliderWrap) {
    caseSliderWrap.addEventListener('mouseenter', pauseCaseSlider)
    caseSliderWrap.addEventListener('mouseleave', resumeCaseSlider)
  }

  // Start initial auto slider when scrolled into view
  ScrollTrigger.create({
    trigger: caseSection,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      startCaseProgress()
    }
  })
}

// ——— 10. CLIENT REFLECTIONS (Mobius 1:1 Interactive Auto-Slider) ———
const testimonialsData = [
  {
    idx: '/1',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&height=750&auto=format&fit=crop',
    quote: '“Himanshu has been running our Meta and Google ads for close to a year now and it’s been a genuinely smooth partnership. He understands our brand, is proactive with ideas, and always works towards real numbers, not just reach. Our ROAS has stayed consistent even as we scaled spend.”',
    name: 'Sneha Agarwal',
    role: 'Marketing Head, FMCG Brand'
  },
  {
    idx: '/2',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&height=750&auto=format&fit=crop',
    quote: '“What stood out is how clearly he explains everything. Every week we know exactly what’s working and what’s next, no confusing reports, no jargon. Within a few months he brought our cost per lead down significantly and the lead quality went up. Honestly one of the easiest people to work with.”',
    name: 'Chirag',
    role: 'Co-founder, Real Estate Company'
  },
  {
    idx: '/3',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&height=750&auto=format&fit=crop',
    quote: '“Our appointment bookings have gone up steadily since Himanshu took over our ads. The enquiries are serious patients now, not random clicks. He’s responsive, honest about what’s realistic, and genuinely invested in our growth. Very happy with the results.”',
    name: 'Nick',
    role: 'Doctor, Clinic'
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
    y: 12,
    duration: 0.25,
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
        duration: 0.45,
        ease: 'power3.out'
      })
    }
  })
}

// Auto slide progression every 5.5s with hover pause
let autoSlideInterval = null
function startAutoSlide() {
  stopAutoSlide()
  autoSlideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialsData.length
    renderTestimonial(currentSlide)
  }, 5500)
}
function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}
startAutoSlide()

const reflectionsSec = document.getElementById('reflections')
if (reflectionsSec) {
  reflectionsSec.addEventListener('mouseenter', stopAutoSlide)
  reflectionsSec.addEventListener('mouseleave', startAutoSlide)
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + testimonialsData.length) % testimonialsData.length
    renderTestimonial(currentSlide)
    startAutoSlide()
  })

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % testimonialsData.length
    renderTestimonial(currentSlide)
    startAutoSlide()
  })
}

// Refresh triggers after fonts and layout settle
window.addEventListener('load', () => ScrollTrigger.refresh())
setTimeout(() => ScrollTrigger.refresh(), 800)
