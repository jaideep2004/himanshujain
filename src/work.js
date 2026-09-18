// Himanshu Jain® — Work / Blogs Archive Interactive 2D Spatial Canvas (1:1 Mobius)
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

// ——— 2D DRAGGABLE & MOUSE-WHEEL INFINITE CANVAS ———
const viewport = document.getElementById('canvas-viewport')
const plane = document.getElementById('canvas-plane')

if (viewport && plane) {
  // Center plane relative to viewport on initial load
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight
  const planeW = 3800
  const planeH = 2800

  // Target and Current coordinates for butter-smooth damping
  let curX = -(planeW - viewportW) / 2
  let curY = -(planeH - viewportH) / 2
  let targetX = curX
  let targetY = curY

  // Bounds
  const minX = -(planeW - viewportW + 200)
  const maxX = 200
  const minY = -(planeH - viewportH + 200)
  const maxY = 200

  let isDragging = false
  let hasDragged = false
  let startX = 0
  let startY = 0
  let dragOriginX = 0
  let dragOriginY = 0

  // 1. Pointer Down (Mouse & Touch Drag)
  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return
    isDragging = true
    hasDragged = false
    startX = e.clientX
    startY = e.clientY
    dragOriginX = targetX
    dragOriginY = targetY
  })

  // 2. Pointer Move
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      hasDragged = true
      viewport.classList.add('is-dragging')
    }
    targetX = Math.min(Math.max(dragOriginX + dx, minX), maxX)
    targetY = Math.min(Math.max(dragOriginY + dy, minY), maxY)
  })

  // 3. Pointer Up & Cancel
  const stopDrag = () => {
    if (!isDragging) return
    isDragging = false
    setTimeout(() => {
      viewport.classList.remove('is-dragging')
      hasDragged = false
    }, 50)
  }
  window.addEventListener('pointerup', stopDrag)
  window.addEventListener('pointercancel', stopDrag)

  // 4. Intercept card clicks if user was actively dragging
  document.querySelectorAll('.canvas-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (hasDragged) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    })
  })

  // 5. Mouse Wheel (2D Panning via Trackpad / Mouse Wheel)
  window.addEventListener('wheel', (e) => {
    targetX = Math.min(Math.max(targetX - e.deltaX * 1.2, minX), maxX)
    targetY = Math.min(Math.max(targetY - e.deltaY * 1.2, minY), maxY)
  }, { passive: true })

  // 6. Physics Tick Loop using GSAP Ticker
  gsap.ticker.add(() => {
    const ease = isDragging ? 0.2 : 0.08
    curX += (targetX - curX) * ease
    curY += (targetY - curY) * ease

    plane.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`
  })

  // Initial animation: Cards stagger into view
  gsap.from('.canvas-card', {
    scale: 0.85,
    opacity: 0,
    duration: 1.1,
    stagger: {
      amount: 0.5,
      from: 'center'
    },
    ease: 'expo.out',
    delay: 0.1
  })

  gsap.from('.canvas-watermark', {
    scale: 1.2,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  })
}
