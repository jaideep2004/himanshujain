// Himanshu Jain® — Work / Blogs Archive True Infinite 2D Spatial Canvas (1:1 Mobius)
import './work.css'
import { gsap } from 'gsap'

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

// ——— TRUE INFINITE 2D DRAGGABLE & SCROLLABLE CANVAS (1:1 Mobius) ———
const viewport = document.getElementById('canvas-viewport')
const cardElements = document.querySelectorAll('.canvas-card')

if (viewport && cardElements.length > 0) {
  // Exact 1:1 Mobius Card Offsets relative to center (Work title)
  const CARD_OFFSETS = {
    'bright-matter': { dx: -528, dy: -23 },   // Yellow Jersey (Center-Left)
    'wavehouse':     { dx: 96,   dy: 230 },   // Black Car (Bottom-Right)
    'soma-studio':   { dx: 226,  dy: -506 },  // Orange Sweater (Top-Right)
    'zero-parallel': { dx: -1212, dy: -302 }, // Pink Minimal (Left Edge)
    'forma-nine':    { dx: 746,  dy: -115 },  // Green Silk (Right Edge)
    'north-layer':   { dx: -502, dy: -828 },  // Cyan Bottles (Upper Left)
    'axis-point':    { dx: 36,   dy: -1107 }, // Metallic Architecture (Upper Center)
    'golden-hour':   { dx: 798,  dy: -989 },  // Warm Studio Portrait (Upper Right)
    'after-light':   { dx: -1152, dy: 369 },  // Dark Editorial (Lower Left)
    'pulse':         { dx: -502, dy: 644 },   // Dynamic Portrait (Lower Left-Center)
    'echoform':      { dx: 686,  dy: 664 },   // Minimal Landscape (Lower Right)
    'orbit-404':     { dx: -1048, dy: -1104 } // Futuristic Sculpture (Far Upper Left)
  }

  // Spatial repeating bounding box
  const gridW = 2600
  const gridH = 2300
  const bufferX = 620
  const bufferY = 660

  let viewportW = window.innerWidth
  let viewportH = window.innerHeight
  let centerX = viewportW / 2
  let centerY = viewportH / 2

  // Register each card with its center-relative base coordinates
  const cards = Array.from(cardElements).map(el => {
    const slug = el.getAttribute('data-slug') || ''
    const offset = CARD_OFFSETS[slug] || { dx: 0, dy: 0 }
    
    // Clear inline top/left so CSS transform controls 2D position
    el.style.left = '0px'
    el.style.top = '0px'

    return {
      el,
      slug,
      dx: offset.dx,
      dy: offset.dy,
      baseX: centerX + offset.dx,
      baseY: centerY + offset.dy
    }
  })

  // Recalculate on window resize
  window.addEventListener('resize', () => {
    viewportW = window.innerWidth
    viewportH = window.innerHeight
    centerX = viewportW / 2
    centerY = viewportH / 2
    cards.forEach(card => {
      card.baseX = centerX + card.dx
      card.baseY = centerY + card.dy
    })
  })

  let curX = 0
  let curY = 0
  let targetX = 0
  let targetY = 0

  let isDragging = false
  let hasDragged = false
  let startX = 0
  let startY = 0
  let dragOriginX = 0
  let dragOriginY = 0
  let lastMoveX = 0
  let lastMoveY = 0
  let velX = 0
  let velY = 0

  // 1. Pointer Down
  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return
    isDragging = true
    hasDragged = false
    startX = e.clientX
    startY = e.clientY
    lastMoveX = e.clientX
    lastMoveY = e.clientY
    velX = 0
    velY = 0
    dragOriginX = targetX
    dragOriginY = targetY
  })

  // 2. Pointer Move (Unbounded panning & velocity tracking)
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      hasDragged = true
      viewport.classList.add('is-dragging')
    }

    velX = e.clientX - lastMoveX
    velY = e.clientY - lastMoveY
    lastMoveX = e.clientX
    lastMoveY = e.clientY

    targetX = dragOriginX + dx
    targetY = dragOriginY + dy
  })

  // 3. Pointer Up with Momentum Fling
  const stopDrag = () => {
    if (!isDragging) return
    isDragging = false
    // Apply inertia fling
    targetX += velX * 7
    targetY += velY * 7

    setTimeout(() => {
      viewport.classList.remove('is-dragging')
      hasDragged = false
    }, 60)
  }
  window.addEventListener('pointerup', stopDrag)
  window.addEventListener('pointercancel', stopDrag)

  // 4. Intercept clicks if user was actively dragging
  cardElements.forEach(card => {
    card.addEventListener('click', (e) => {
      if (hasDragged) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    })
  })

  // 5. Mouse Wheel & Trackpad Panning
  window.addEventListener('wheel', (e) => {
    targetX -= e.deltaX * 1.05
    targetY -= e.deltaY * 1.05
  }, { passive: true })

  // Mathematical modulo wrap function
  function wrapCoordinate(val, min, max) {
    const range = max - min
    return ((((val - min) % range) + range) % range) + min
  }

  // 6. GSAP Physics Tick Loop: Smooth Damping & Seamless Modulo Wrap
  gsap.ticker.add(() => {
    const ease = isDragging ? 0.22 : 0.075
    curX += (targetX - curX) * ease
    curY += (targetY - curY) * ease

    // Position every card relative to current viewport with seamless modulo wrap
    cards.forEach(card => {
      const screenX = wrapCoordinate(card.baseX + curX, -bufferX, gridW - bufferX)
      const screenY = wrapCoordinate(card.baseY + curY, -bufferY, gridH - bufferY)
      card.el.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)`
    })
  })

  // Initial fade-in for center watermark
  gsap.from('.canvas-watermark', {
    scale: 1.15,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  })
}
