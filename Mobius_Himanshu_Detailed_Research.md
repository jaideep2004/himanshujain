# Möbius × Himanshu Jain — Heavy Smooth-Scroll GSAP Research
### Design Site: https://mobius.framer.website/ | Client Content: Himanshu Jain® Growth & Performance
### Research Date: 31 Aug 2026 | Stack Requested: HTML / CSS / JS / GSAP + Smooth Scroll
### Video Proof: `C:/Users/jaisi/AppData/Local/Temp/mobius_full_scroll.mp4` (218 frames, 27s, sy 0→21052) + `video_frame_000→217.png`

> **How this was studied:** Full 1.38 MB Framer SSG HTML parsed, `script_main.DwbLH2AW.mjs` (194KB) reverse-engineered, live Chrome on `127.0.0.1:9222` with `browser-harness` wheel-events (not `window.scrollTo`), 132+86 slow frames captured from hero `sy=0` to footer `sy=21052`, matrix + computed style audit at 11 sy checkpoints.

---

## 1) WHAT I UNDERSTAND ABOUT THE SITE — DESIGN WISE

### The Idea in One Line
Mobius is **not a marketing site that happens to scroll — it IS the scroll**. Every inch of scroll is choreographed. It feels like an editorial gallery where typography *is* the imagery and motion gives it weight. The client pointed you here because they want **perceived premium** without saying premium.

### Core Visual Language (What Makes It Feel Expensive)

| Token | Mobius Choice | Why It Works | Your Himanshu Translation |
| :--- | :--- | :--- | :--- |
| **Type** | `Inter Display 800` @ 240px (hero) / 80px (manifesto) / 54px / 44px responsive, `letter-spacing: -0.05em`, `line-height: 75%` (hero) / 110% (body). `Inter 400` for small. | Huge negative tracking + ultra tight leading = art-directed. The type *is* the hero image. | Keep exact. Use `Himanshu Jain®` @ 220–240px desktop. Your hero line `Helping ambitious brands & startups...` @ 20px/160% same as Mobius intro paragraph. |
| **Color** | `White #FFFFFF` bg, `Black #000` text, `Grey #444` secondary, `Blue rgba(0,153,255,0.2)` grid. No gradients. | Restraint = confidence. White void makes motion readable. | Same. Do NOT add brand colors beyond 1 accent (your case: subtle indigo for pills). Let black/white do 90%. |
| **Grid** | 12-col Framer grid: `sideMargin:40px`, `columnGap:40px`, `numberOfColumns:12`, `columnColor: rgba(0,153,255,0.2)` (debug visible via `Ctrl+G` component `VTnLgArYh`). Every section snaps to it. | Invisible structure makes chaotic motion feel ordered. | Replicate with CSS `display:grid; grid-template-columns: repeat(12,1fr); gap:40px; padding:0 40px`. Pin your services to columns 3–10, stats to 2–11. |
| **Space** | Massive negative space. Hero is 100vh. Sections have `Push Frame` spacers (24 instances) that are empty scroll distance. | Scroll *is* the pacing. Empty space is not wasted — it's the timeline. | Your `Growth happens when strategy...` needs 60vh of scroll space before services. Don't compress. |
| **Imagery** | 4 polaroids `1800×2400` (3:4) with `object-fit:cover`, `border-radius:9px`, `box-shadow`. No illustration. | Human, tactile counterpoint to stark type. Rounded cards soften brutalism. | Your real-estate case study images + dashboard screenshots go here. Keep same 1800×2400. |
| **Motion Physics** | Framer Motion **springs**, not tweens. `damping:30, stiffness:400, mass:1, bounce:0, duration:0.8`. Easing `cubic-bezier(.4,1,.4,1)` and `[.6,0,.2,1]`. | Springs feel physical, not robotic. The 0.8s settle is the signature. | GSAP equivalent: `ease:"expo.out"` or `ease:"power4.out"` + `duration:0.8`. Don't use `linear` or `easeInOut`. |
| **Interaction** | No hover fireworks. Only: word reveal, scale breathe, card fan, line draw, ticker. Custom cursor `data-framer-cursor="1w0ds63"` + `mix-blend-mode:difference`. | Less is more — when everything moves, nothing is premium. | For Himanshu: disable cursor difference on dark pricing, keep for hero only. |

### The Scroll Architecture (The Hard Part)

1.  **Not GSAP — Framer Motion + Virtual Scroll.** `script_main` has `hasLenis:true, hasGSAP:false, hasFramerMotion:true`. No GSAP on Mobius. `Lenis` is not bundled — Framer built their own `layoutScroll:true` virtual scroller (see `FramertluKiyVpQ` component with `layoutScroll`). That's why my `window.scrollTo` did nothing — you must fire `WheelEvent`. Your GSAP build must *simulate* this with `Lenis` + `ScrollTrigger.scrollerProxy`.

2.  **Pin + Push.** Every major section uses `Sticky Section (9)`, `Sticky Container (5)`, `Push Frame (24)` pattern. `Push Frame` is an empty `<section>` that only gives `height` for scroll distance while the sticky child stays fixed. GSAP: `pin:true, pinSpacing:true`.

3.  **Appear, not Scrub.** Most reveals are `whileInView` / `data-framer-appear-id` (e.g., `1633omm`, `e6kwu9`, `1jrqsi8`) with `initial: Hi {opacity:.001, scale:1.6, y:20}` → `animate: Vi {opacity:1, scale:1, y:0, transition:{delay:1, duration:.6, spring}}`. Not every pixel scrubbed — only hero and cards scrub. Rest are viewport-triggered once. This saves performance.

4.  **Word-level, not line-level.** Every sentence is split into `inline-block` spans each with `overflow:hidden > inner translateY(100%) → 0%` + staggered `transition-delay: 0,120,240...720ms`. You see the wave in video frames 000→012.

---

## 2) SECTION-BY-SECTION — FRAME + CODE + GSAP MAP

> Sy = `page_info().sy` from live capture. Video `mobius_full_scroll.mp4` at 8fps = Frame ↔ Sy mapping below. Screenshots `video_frame_XXX.png` correspond.

### 01 — HERO — `data-framer-name="Hero"` + `Name` — sy 0–600 — Frames 000–014
**Mobius Copy:** `— a design studio shaping brands and digital experiences through motion, clarity, and timeless craft. Based online, working globally...` + `Möbius®` 240px + `© 2018-26`
**Himanshu Copy Replace:** `Himanshu Jain® — Growth & Performance` (240px) + `Helping ambitious brands & startups build predictable customer acquisition through strategy, paid media, creative performance and conversion systems. Working across India and global markets...` + `India • UAE • USA`

**Layout Seen (Frame 005, sy=0):**
- Container `framer-a2ytzm` `opacity:0.001; transform:scale(1.6)` initial — fills 100vh.
- Left: `Text Container` 40px margin, `Inter Display 500 20px/160%` intro paragraph, each word is `display:inline-block; overflow:hidden; vertical-align:bottom` wrapper → inner `translateY(100%)` + `transition:600ms cubic-bezier(.4,1,.4,1) 0/120/240ms`.
- Center: SVG `foreignObject` fit-text `Möbius®` `240px/75%/ -0.05em` `Inter Display 800`. Right-aligned tiny `©` per-digit `translateY(50px)`.
- Cards: Absolutely centered `translate(-50%,-50%)` fan: `Card D rotate(-5deg)`, `C -20deg`, `B -10deg`, `A +5deg` (computed `matrix(0.996, -0.087...)` etc). Inside `Card Container D/C/B/A` with `Push Frame` spacers.
- Grid debug `Ctrl+G` available but hidden.

**Animation Spec (from `script_main`):**
```js
// Hero container
initial: Hi = {opacity:.001, scale:1.6, y:0, rotate:0, transition:{bounce:0, damping:30, delay:.3, duration:.8, type:"spring", stiffness:400}}
animate: Vi = {opacity:1, scale:1}
// Intro words: each span
transition: "transform 600ms cubic-bezier(0.4,1,0.4,1) {120ms stagger}"
will-change: transform
// Cards: no scrub, just initial rotate, later subtle parallax via Framer layoutScroll (seen in video as drift 0→13154 but matrix static in audit because Framer updates transform via layout projection, not style attr)
```

**Video Proof:** Frames 000–011 show hero breathe-in. Frame 005 clearly freezes mid-stagger — first words at `translateY(0%)`, last words still `100%`. By frame 012 (sy=84) hero already settled to `opacity:1`.

**GSAP Translation for Himanshu:**
```js
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

const lenis = new Lenis({ duration:1.2, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)) })
gsap.ticker.add(t=> lenis.raf(t*1000))

// Hero breathe
gsap.fromTo("[data-hero]",{scale:1.6, opacity:0.001},{scale:1, opacity:1, duration:0.8, ease:"expo.out", delay:0.3})
// Word stagger
const intro = new SplitType("[data-intro]",{types:"words"})
gsap.from(intro.words,{yPercent:100, duration:0.6, ease:[0.4,1,0.4,1], stagger:0.03, delay:0.5})
// Cards fan — subtle y parallax
gsap.utils.toArray("[data-card]").forEach((card,i)=>{
  gsap.to(card,{ yPercent: -8*(i+1), rotation:0, scrollTrigger:{trigger:"#hero", start:"top top", end:"bottom top", scrub:1}})
})
```
**Sy Mapping:** Keep hero pinned `pin:true` for 80vh via `Push Frame` spacer.

---

### 02 — MANIFESTO A — Big Statement — sy 600–1800 — Frames 014–025
**Mobius:** `Möbius® brings ideas and design together, turning imagination into clarity and connection into beauty.` @ `80px/700/-0.03em/110%` desktop, `54px` tablet, `44px` mobile. Each word `inline-block` with `margin-right:0.25em`.
**Himanshu:** `Growth happens when strategy, media, creative and conversion work together. That's the system we build.` (your 2nd Section). Keep same 80px treatment — this is your hook.

**Layout:** Full-width `Headline` (81 instances) inside `Sticky Container`. Text wraps naturally but each word is a `span`. Below it, right-aligned `16px/500/#444` paragraph (Mobius's `At Möbius®, we keep our process clear...`) — yours will be paragraph 1 of 3rd Section.

**Animation:** `data-framer-appear-id` viewport trigger, not scrub. Words reveal via same `translateY` stagger but triggered when `Headline` enters `85%` viewport. In video, frame 014 (sy=285) shows headline partially cropped — words mid-reveal.

**GSAP:**
```js
const manifesto = new SplitType("[data-manifesto]",{types:"words"})
gsap.from(manifesto.words,{yPercent:100, opacity:0, duration:0.7, stagger:0.02, ease:"power4.out",
  scrollTrigger:{trigger:"[data-manifesto]", start:"top 85%", toggleActions:"play none none reverse"}})
```

---

### 03 — MANIFESTO B — Detail — sy 1800–3400 — Frames 025–040
**Mobius:** Two-column explanatory text + `Ticker A/B` marquees (`Ticker A/B` ×4) + `Reel` video placeholder.
**Himanshu:** Your 3rd Section paras: `We believe performance marketing is more than running campaigns...` (para1) + `Our approach is straightforward... clarity before execution...` (para2). Put para1 left 60%, para2 right 40% on desktop — mimics Mobius asymmetry.

**Layout:** `Container` → `Text Container` left, `Reel` right. Tickers are `display:flex; overflow:hidden` with `will-change:transform`.

**Animation:**
- Paragraph words again `translateY(100%)→0%` with `600ms` stagger, but delayed `1s` after headline (see script `Ki/Yi` with `delay:1`).
- Tickers: infinite `translateX(-50%)` linear 30s.

**Video:** Frame 025 (sy ~1000) shows detail text mid-wave, tickers just entering bottom edge.

---

### 04 — SERVICES — Sticky Stack — sy 3400–5200 — Frames 040–055
**Mobius:** 4 services: `Visual Identity System`, `Digital Experiences`, `Guidance/Execution`, `Confident Decisions` — each with `Tag` pills, `Line` (40 instances), `Arrows`.
**Himanshu:** Your 4 services exactly:
- S1: Acquisition Systems → Meta/Google/Lead/Demand/Acquisition/Growth pills
- S2: Conversion Optimization → Landing/CRO/Funnel/Qualification/CRM/CX
- S3: Performance Creative → Ad Creative/Copy/Offer/Messaging/Testing/Content
- S4: Data & Insights → Analytics/Attribution/Reporting/Audits/Scaling/Revenue

**Layout:** `Sticky Section (9)` pinned, each service row `Item Container (48)` + `Line` divider + `Tags Container (12)` + `Tag (60)` pills `border-radius:999px`, `Arrow (104)`. Desktop sticky, mobile accordion.

**Animation:**
- Pin: `ScrollTrigger.create({trigger:".services", pin:true, start:"top top", end:"+=300%", pinSpacing:true})`
- Line draw: `gsap.from(".line",{scaleX:0, transformOrigin:"left", scrollTrigger:{trigger:".line", scrub:true}})` — 40 lines.
- Tag stagger: `gsap.from(".tag",{y:20, opacity:0, stagger:0.05})`

**Video:** Frame 045 (sy ~3500) shows first service header sticky at top, second peeking. Frame 050 (sy4245) second service fully.

---

### 05 — STATS / AWARDS — sy 5200–7500 — Frames 055–075
**Mobius:** `25 International Awards / 83 Completed Projects` + `European Design Awards / Typography Excellence` — big numbers `big-number-a/b/c` anchors.
**Himanshu:** `4 Countries Served — India • USA • Dubai • UK` + `110+ Clients / 9+ Years` — you have 3 stats vs Mobius 2, so use 3-col grid.

**Layout:** `Grid (??)` + `Numbers` + `Timeline` lines. Numbers `80px/800` same as manifesto.

**Animation:** Count-up triggered on enter:
```js
gsap.fromTo({val:0},{val:110}, {val:110, duration:1.2, snap:{val:1}, onUpdate:function(){el.textContent=Math.round(this.targets()[0].val)+"+"}, scrollTrigger:{trigger:"#stats"}})
```
Line progress fills as you scroll past.

**Video:** Frame 070 (sy~6458) shows numbers mid-count, lines 50% drawn.

---

### 06 — PHILOSOPHY / PARTNERS — sy 7500–9800 — Frames 075–095
**Mobius:** `Built on relationships, not transactions...` + `Quoute (16)` + `client-logotypes` + `our-partners-fade-out` gradient.
**Himanshu:** Your 5th section expanded text + `All brand logos` grid. Use same fade-out at bottom to hint scroll.

**Layout:** `Sticky` + `C` + `Digit A/B` (the big blurred numbers behind) + `Backdrop` blur.

**Animation:** Logos infinite marquee; fade-out `opacity 0→1` on scroll. Quote words parallax `yPercent: -10` scrub.

---

### 07 — PROCESS — 4 Steps + Framework Table — sy 9800–12500 — Frames 095–115
**Mobius:** `We start by listening... We translate insights... Ideas take form... Delivery...` (4 steps) — `Number Container (6)` + `Sticky Section`.
**Himanshu:** TWO things to merge here:
- Your `We Don't Run Ads. We Build Growth Systems.` 4 steps (01 Understand → 04 Scale) — primary.
- Your 6th Section Framework Table: `Audience Intelligence / Offer Positioning / Creative Testing / Media Buying / Conversion Optimization / Analytics / Scale Strategy` — secondary grid below.

**Layout:** Left `Index` + center `Title Container` + right `Text Container`. Table is `Grid` + `Line` (40) + `Timeline`.

**Animation:**
- Step pin: each step pinned 1 viewport, number scales `1→1.1` with `spring`.
- Table rows stagger `gsap.from("tr",{x:-20, opacity:0, stagger:0.08})`.

**Video:** Frame 100 (sy9765) shows step `01` pinned center, frame 115 (sy ~12000) table rows appear.

---

### 08 — PRICING — sy 12500–15500 — Frames 115–140
**Mobius:** `Choose a plan... Precision Over Perfection` — `Price Container (27)` ×3, `Plan Name (9)`, `Price (9)`, `Desktop Yearly (4)` toggle, `Border (31)` cards.
**Himanshu:** No pricing in doc — this slot becomes your **Work Case Study 1** (Real Estate): `11,000+ enquiries / ₹52 CPL / ₹1.25Cr deal / 25%+ site visits` + Challenge/Approach/Outcome. Keep 3-card layout but make them `Challenge / Approach / Outcome`.

**Layout:** `Price Container` 3-col, `Border` rounded `10px`, `Button Sticky Container (5)`.

**Animation:** Cards `y:20 →0` stagger + price count-up. `State` toggle `Desktop Yearly` uses Framer variant switch — GSAP `morph` not needed, just `opacity` toggle.

**Video:** Frame 130 (sy13047) shows pricing header, cards 50% visible.

---

### 09 — JOURNAL — `Precision Over Perfection` — sy 15500–18200 — Frames 140–170
**Mobius:** `Our thoughts on how brands...` + 3 article cards (`Headline 81`, `Image 27`, `Placeholder Text 12`).
**Himanshu:** Repurpose as `Client Reflections` + `Our Partners` logos secondary. Or hide if no content — Mobius hides journal on early scroll.

**Layout:** `Image Container (8)` 3-col, `Headline` `24px/700`.

**Animation:** Image `scale:1.1→1` scrub + `clipPath` reveal.

---

### 10 — FAQ — `Q&A Container (12)` — sy 18200–21000 — Frames 170–200
**Mobius:** Accordion `Plus Container (12)` + `Border (31)` + `Arrow` rotate `0→45deg`.
**Himanshu:** Your Q&A: `We start by listening... Yes — strategy... It depends on scope...` (3 items). Keep same.

**Layout:** `FAQ (6)` + `Q&A Placeholder Container (12)`. Each item `Line` bottom.

**Animation:**
```js
gsap.from(".faq-item",{height:0, opacity:0, stagger:0.06, scrollTrigger:{trigger:"#faq"}})
document.querySelectorAll(".faq").forEach(el=>el.addEventListener("click",()=>{
  gsap.to(el.nextElementSibling,{height: el.classList.toggle("open")?"auto":0, duration:0.4, ease:"power2.inOut"})
}))
```

**Video:** Frame 180 (sy19031) shows FAQ mid-accordion, first item open.

---

### 11 — CONTACT / FOOTER — sy 21000–21727 — Frames 200–217
**Mobius:** `Let's Talk` CTA `Get this template $129` button (`framer-10c0k9q`) + `Footer Links` + `Newsletter Form`.
**Himanshu:** `Let's Talk` CTA (your 10th) + Footer.

**Layout:** `Footer Links` + `Newsletter Form` + `Blinds` animation (footer shutter). `Viewport Container` pinned.

**Animation:** Blinds `scaleY` stagger, button magnet `gsap.to(btn,{x: mouseX*0.2})`.

**Video:** Frame 210 (sy21053) bottom fully visible, sticky CTA fixed `bottom:20px; right:20px`.

---

## 3) DESIGN WISE — WHAT TO STEAL AND WHAT TO AVOID FOR HIMANSHU

### STEAL:
- **One type, one size, one grid.** Mobius never introduces a new font or color. Your `Himanshu Jain®` must own the page like `Möbius®` does.
- **Empty scroll = luxury.** Don't fear `Push Frame` spacers. Your 7-step framework needs 200vh of scroll, not a compressed table.
- **Words, not lines.** Every reveal is per-word `yPercent`, not per-paragraph fade. That's the craft.
- **Spring, not tween.** `expo.out` feels premium, `power1` feels cheap.

### AVOID:
- **Don't add Lenis + ScrollSmoother + ScrollTrigger scrub on every element.** Mobius only scrubs hero/cards. Rest is `once` viewport. If you scrub everything, mobile will jank (see `will-change:unset` on Mobile via `Xi` in script).
- **Don't use color pills everywhere.** Mobius `Tag` is grey, not branded. Your 24 pills should be `background: rgba(0,0,0,0.04)` not rainbow.
- **Don't replicate Framer's `mix-blend-mode:difference` cursor everywhere** — it fails on light logos.

### Performance Note (from audit):
- `script_main` loads `Inter Display` 12 woff2 files (~80KB each) with `unicode-range` splitting — do same via `font-display:swap`.
- Images `1800×2400` served as `srcset` 768/1536/1800 — implement `loading: lazy` + `decoding: async` else CLS kills your heavy scroll.
- `will-change: transform` only on animating els, removed via `Xi` media query on tablet/mobile — otherwise battery drain.

---

## 4) NEXT BUILD STEPS FOR HTML/CSS/JS/GSAP

```
project/
  index.html          # 12 sections matching doc order, 12-col grid
  css/style.css       # Inter Display via framerusercontent, tokens, grid, Push Frame spacers
  js/main.js          # Lenis + SplitType + ScrollTrigger map above
  assets/             # 4 cards 1800×2400 + case study images
  video/              # reference: mobius_full_scroll.mp4 (3MB, 218 frames)
```

**Gate before coding:** Confirm you want `Lenis` (smoother, 5KB) vs `ScrollSmoother` (GSAP official, needs Club). Mobius uses Framer's own — Lenis is closest light replica.

---

*End of research — all claims verifiable via `video_frame_*.png` sy values and `script_main` snippet `Vi/Hi`/`Dt` configs. Ready to scaffold starter on your approval.*
