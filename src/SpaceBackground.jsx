import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/*
  Dense spiral galaxy — matching the reference image:
  - Many tightly wound spiral arms (not just 3)
  - Stars densely packed along arms forming visible ring-like curves
  - Color: bright white/yellow core → purple/violet middle → blue/cyan outer arms
  - Bright cyan highlight particles scattered on outer arms
  - Brilliant core with lens flare cross
  - Tilted elliptical perspective (viewed at ~30° angle)
*/

function GalaxyCanvas() {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    if (particlesRef.current.length === 0) {
      const particles = []
      const w = window.innerWidth
      const h = window.innerHeight
      const cx = w * 0.5
      const cy = h * 0.72
      const maxRadius = Math.min(w, h) * 0.38

      // ── Diffuse star cloud (no spiral arms) ──
      const totalParticles = 5000

      for (let i = 0; i < totalParticles; i++) {
        // Distance from center — gaussian-ish distribution, denser toward center
        const rawDist = Math.pow(Math.random(), 0.6)
        const dist = rawDist * maxRadius

        // Fully random angle — no spiral structure
        const angle = Math.random() * Math.PI * 2

        // Normalize distance for color
        const t = rawDist

        // Color gradient: core warm white → middle violet/purple → outer blue/cyan
        let r, g, b
        if (t < 0.15) {
          // Core: warm white/yellow
          r = 240 + Math.random() * 15
          g = 210 + Math.random() * 30
          b = 180 + Math.random() * 40
        } else if (t < 0.45) {
          // Middle: violet / purple
          const mt = (t - 0.15) / 0.3
          r = Math.floor(220 - mt * 90)
          g = Math.floor(180 - mt * 80)
          b = Math.floor(220 + mt * 35)
        } else {
          // Outer: blue / indigo
          const ot = (t - 0.45) / 0.55
          r = Math.floor(130 - ot * 60)
          g = Math.floor(100 - ot * 30 + ot * 40)
          b = Math.floor(255 - ot * 20)
        }

        const size = (1 - t * 0.4) * (0.3 + Math.random() * 1.2)
        const alpha = (1 - t * 0.3) * (0.25 + Math.random() * 0.55)

        particles.push({
          dist,
          angle,
          baseAngle: angle,
          cx, cy,
          size,
          color: `rgb(${r},${g},${b})`,
          alpha,
          speed: (0.0001 + Math.random() * 0.00015) * (1 + (1 - t) * 0.5),
          twinkleSpeed: 0.3 + Math.random() * 1.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          tiltY: 0.4,  // elliptical tilt
        })
      }

      // ── Bright cyan accent particles scattered in outer region ──
      for (let i = 0; i < 200; i++) {
        const rawDist = 0.35 + Math.random() * 0.65
        const dist = rawDist * maxRadius
        const angle = Math.random() * Math.PI * 2

        particles.push({
          dist,
          angle,
          baseAngle: angle,
          cx, cy,
          size: 0.5 + Math.random() * 1,
          color: `rgb(${100 + Math.random() * 40},${180 + Math.random() * 55},${255})`,
          alpha: 0.3 + Math.random() * 0.4,
          speed: 0.0001 + Math.random() * 0.0001,
          twinkleSpeed: 1 + Math.random() * 3,
          twinkleOffset: Math.random() * Math.PI * 2,
          tiltY: 0.4,
          isCyan: true,
        })
      }

      // ── Dense core cluster ──
      for (let i = 0; i < 500; i++) {
        const dist = Math.random() * maxRadius * 0.12
        const angle = Math.random() * Math.PI * 2
        const brightness = 200 + Math.random() * 55

        particles.push({
          dist,
          angle,
          baseAngle: angle,
          cx, cy,
          size: 0.4 + Math.random() * 1.8,
          color: `rgb(${brightness},${brightness - 20},${brightness - 10 + Math.random() * 40})`,
          alpha: 0.5 + Math.random() * 0.5,
          speed: 0.0002 + Math.random() * 0.0003,
          twinkleSpeed: 1 + Math.random() * 3,
          twinkleOffset: Math.random() * Math.PI * 2,
          tiltY: 0.4,
        })
      }

      // ── Diffuse inter-arm dust (fills gaps, makes it look fuller) ──
      for (let i = 0; i < 1500; i++) {
        const dist = Math.random() * maxRadius
        const angle = Math.random() * Math.PI * 2
        const t = dist / maxRadius

        let r = Math.floor(80 + t * 40)
        let g = Math.floor(50 + t * 30)
        let b = Math.floor(120 + t * 80)

        particles.push({
          dist,
          angle,
          baseAngle: angle,
          cx, cy,
          size: 0.2 + Math.random() * 0.8,
          color: `rgb(${r},${g},${b})`,
          alpha: 0.08 + Math.random() * 0.15,
          speed: 0.00008 + Math.random() * 0.0001,
          twinkleSpeed: 0.2 + Math.random() * 0.8,
          twinkleOffset: Math.random() * Math.PI * 2,
          tiltY: 0.4,
        })
      }

      // ── Background field stars ──
      for (let i = 0; i < 60; i++) {
        particles.push({
          dist: 9999,
          angle: 0, baseAngle: 0,
          cx: 0, cy: 0,
          fieldX: Math.random() * w,
          fieldY: Math.random() * h,
          size: 0.4 + Math.random() * 1,
          color: '#fff',
          alpha: 0.04 + Math.random() * 0.15,
          speed: 0,
          twinkleSpeed: 0.3 + Math.random() * 1,
          twinkleOffset: Math.random() * Math.PI * 2,
          tiltY: 0.4,
          isField: true,
        })
      }

      particlesRef.current = particles
    }

    let time = 0
    const animate = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      time += 0.016

      ctx.clearRect(0, 0, w, h)

      const cxDraw = w * 0.5
      const cyDraw = h * 0.72

      // ── Core glow layers ──
      // Outer haze
      const haze = ctx.createRadialGradient(cxDraw, cyDraw, 0, cxDraw, cyDraw, 200)
      haze.addColorStop(0, 'rgba(160,130,220,0.06)')
      haze.addColorStop(0.4, 'rgba(100,60,180,0.025)')
      haze.addColorStop(1, 'transparent')
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, w, h)

      // Inner bright core
      const core = ctx.createRadialGradient(cxDraw, cyDraw, 0, cxDraw, cyDraw, 50)
      core.addColorStop(0, 'rgba(255,245,230,0.15)')
      core.addColorStop(0.3, 'rgba(200,170,255,0.06)')
      core.addColorStop(1, 'transparent')
      ctx.fillStyle = core
      ctx.fillRect(0, 0, w, h)

      // ── Draw particles ──
      for (const p of particlesRef.current) {
        if (p.isField) {
          const twinkle = 0.5 + 0.5 * Math.sin(time * p.twinkleSpeed + p.twinkleOffset)
          ctx.globalAlpha = p.alpha * twinkle
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.fieldX, p.fieldY, p.size, 0, Math.PI * 2)
          ctx.fill()
          continue
        }

        // Rotate
        p.angle = p.baseAngle + time * p.speed * 60

        const x = p.cx + Math.cos(p.angle) * p.dist
        const y = p.cy + Math.sin(p.angle) * p.dist * p.tiltY

        // Skip if off screen
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue

        const twinkle = 0.6 + 0.4 * Math.sin(time * p.twinkleSpeed + p.twinkleOffset)
        ctx.globalAlpha = p.alpha * twinkle
        ctx.fillStyle = p.color

        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Subtle glow for brighter particles only
        if (p.size > 1.5) {
          ctx.globalAlpha = p.alpha * twinkle * 0.08
          ctx.beginPath()
          ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ── Lens flare cross on core ──
      ctx.globalAlpha = 0.12 + 0.06 * Math.sin(time * 0.5)
      ctx.strokeStyle = 'rgba(255,245,255,0.5)'
      ctx.lineWidth = 1
      // Vertical flare
      ctx.beginPath()
      ctx.moveTo(cxDraw, cyDraw - 60)
      ctx.lineTo(cxDraw, cyDraw + 60)
      ctx.stroke()
      // Horizontal flare (wider, tilted with galaxy)
      ctx.beginPath()
      ctx.moveTo(cxDraw - 90, cyDraw)
      ctx.lineTo(cxDraw + 90, cyDraw)
      ctx.stroke()

      // Core bright point
      ctx.globalAlpha = 0.4 + 0.15 * Math.sin(time * 0.8)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(cxDraw, cyDraw, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.15 + 0.05 * Math.sin(time * 0.8)
      ctx.beginPath()
      ctx.arc(cxDraw, cyDraw, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 1
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    />
  )
}

// ─── Ambient Layers ───────────────────────────────────────────────────────────
function AmbientLayers() {
  return (
    <>
      {/* Vignette focused around galaxy */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse at 50% 72%, transparent 12%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.92) 65%)',
      }} />

      {/* Top darkener for text readability */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 30%, transparent 55%)',
      }} />

      {/* Lens flare glow */}
      <motion.div
        style={{
          position: 'absolute',
          left: '50%', top: '72%',
          width: 350, height: 1.5,
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(90deg, transparent, rgba(150,120,255,0.06), rgba(255,255,255,0.1), rgba(150,120,255,0.06), transparent)',
          zIndex: 3,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3], scaleX: [0.8, 1.15, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

// ─── Shooting Star ────────────────────────────────────────────────────────────
function ShootingStar({ delay, startX, startY }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${startX}%`, top: `${startY}%`,
        width: 70, height: 1,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(150,130,255,0.2), transparent)',
        borderRadius: 1,
        transformOrigin: 'left center',
        rotate: '28deg',
        zIndex: 4,
      }}
      animate={{ x: [0, 380], y: [0, 170], opacity: [0, 0.7, 0] }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        delay,
        repeatDelay: 14 + Math.random() * 10,
        ease: 'easeIn',
      }}
    />
  )
}

// ─── Floating Spaceships & Rockets ───────────────────────────────────────────
function SpaceVehicle({ type, delay, duration, startX, startY, endX, endY, scale = 1, rotate = 0 }) {
  const rockets = {
    // Sleek rocket with flame
    rocket1: (
      <svg width="40" height="80" viewBox="0 0 40 80" fill="none" style={{ transform: `scale(${scale})` }}>
        {/* Flame */}
        <motion.g
          animate={{ opacity: [0.6, 1, 0.6], scaleY: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: '20px 75px' }}
        >
          <ellipse cx="20" cy="75" rx="6" ry="10" fill="#f39c12" opacity="0.9" />
          <ellipse cx="20" cy="73" rx="4" ry="7" fill="#f5b041" opacity="0.8" />
          <ellipse cx="20" cy="71" rx="2" ry="4" fill="#fad7a0" />
        </motion.g>
        {/* Body */}
        <path d="M 14 60 L 14 28 Q 14 8 20 4 Q 26 8 26 28 L 26 60 Z" fill="#d5d8dc" />
        <path d="M 17 60 L 17 30 Q 17 12 20 8 Q 23 12 23 30 L 23 60 Z" fill="#eaecee" />
        {/* Nose cone */}
        <path d="M 14 28 Q 14 8 20 2 Q 26 8 26 28" fill="#e74c3c" />
        {/* Window */}
        <circle cx="20" cy="32" r="4" fill="#2c3e50" />
        <circle cx="20" cy="32" r="3" fill="#5dade2" opacity="0.7" />
        <circle cx="18.5" cy="30.5" r="1" fill="white" opacity="0.6" />
        {/* Fins */}
        <path d="M 14 52 L 6 65 L 14 60 Z" fill="#e74c3c" />
        <path d="M 26 52 L 34 65 L 26 60 Z" fill="#e74c3c" />
      </svg>
    ),
    // Spaceship / UFO style
    ship1: (
      <svg width="60" height="30" viewBox="0 0 60 30" fill="none" style={{ transform: `scale(${scale})` }}>
        {/* Engine glow */}
        <motion.ellipse
          cx="30" cy="22" rx="12" ry="3"
          fill="#5dade2" opacity="0.4"
          animate={{ opacity: [0.2, 0.5, 0.2], ry: [2, 4, 2] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        {/* Hull */}
        <ellipse cx="30" cy="18" rx="25" ry="8" fill="#7f8c8d" />
        <ellipse cx="30" cy="17" rx="22" ry="6" fill="#95a5a6" />
        {/* Dome */}
        <ellipse cx="30" cy="13" rx="12" ry="10" fill="#aab7b8" />
        <ellipse cx="30" cy="11" rx="10" ry="8" fill="#bdc3c7" />
        {/* Window */}
        <ellipse cx="30" cy="10" rx="6" ry="5" fill="#2c3e50" />
        <ellipse cx="30" cy="9" rx="5" ry="4" fill="#1a5276" />
        <ellipse cx="28" cy="8" rx="2" ry="1.5" fill="white" opacity="0.3" />
        {/* Lights */}
        <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <circle cx="12" cy="18" r="1.5" fill="#f39c12" />
          <circle cx="22" cy="20" r="1.5" fill="#e74c3c" />
          <circle cx="38" cy="20" r="1.5" fill="#e74c3c" />
          <circle cx="48" cy="18" r="1.5" fill="#f39c12" />
        </motion.g>
      </svg>
    ),
    // Small shuttle
    shuttle: (
      <svg width="35" height="60" viewBox="0 0 35 60" fill="none" style={{ transform: `scale(${scale})` }}>
        {/* Flame trail */}
        <motion.g
          animate={{ opacity: [0.5, 0.9, 0.5], scaleY: [0.7, 1.3, 0.7] }}
          transition={{ duration: 0.25, repeat: Infinity }}
          style={{ transformOrigin: '17.5px 58px' }}
        >
          <ellipse cx="17.5" cy="58" rx="4" ry="6" fill="#e67e22" opacity="0.8" />
          <ellipse cx="17.5" cy="56" rx="2.5" ry="4" fill="#fad7a0" />
        </motion.g>
        {/* Body */}
        <path d="M 11 48 L 11 18 Q 11 4 17.5 2 Q 24 4 24 18 L 24 48 Z" fill="#bdc3c7" />
        <path d="M 14 46 L 14 20 Q 14 8 17.5 5 Q 21 8 21 20 L 21 46 Z" fill="#d5d8dc" />
        {/* Nose */}
        <path d="M 11 18 Q 11 4 17.5 0 Q 24 4 24 18" fill="#2ecc71" />
        {/* Wings */}
        <path d="M 11 38 L 2 50 L 11 46 Z" fill="#2ecc71" />
        <path d="M 24 38 L 33 50 L 24 46 Z" fill="#2ecc71" />
        {/* Window */}
        <circle cx="17.5" cy="22" r="3" fill="#2c3e50" />
        <circle cx="17.5" cy="22" r="2" fill="#5dade2" opacity="0.6" />
      </svg>
    ),
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        zIndex: 3,
        pointerEvents: 'none',
        rotate: `${rotate}deg`,
        opacity: 0.35,
      }}
      animate={{
        x: [`0vw`, `${endX - startX}vw`],
        y: [`0vh`, `${endY - startY}vh`],
        opacity: [0, 0.35, 0.35, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        repeatDelay: 2,
        ease: 'linear',
      }}
    >
      {rockets[type]}
    </motion.div>
  )
}

export default function SpaceBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      overflow: 'hidden',
      zIndex: 0,
    }}>
      <GalaxyCanvas />
      <AmbientLayers />
      <ShootingStar delay={4} startX={8} startY={12} />
      <ShootingStar delay={14} startX={55} startY={6} />
      <ShootingStar delay={25} startX={20} startY={65} />

      {/* Floating space vehicles — all visible together, gentle drift */}
      <SpaceVehicle type="rocket1" delay={0} duration={28} startX={5} startY={90} endX={25} endY={-15} scale={0.7} rotate={-15} />
      <SpaceVehicle type="ship1" delay={1} duration={32} startX={-5} startY={35} endX={110} endY={28} scale={0.6} rotate={5} />
      <SpaceVehicle type="shuttle" delay={0.5} duration={25} startX={85} startY={95} endX={70} endY={-10} scale={0.6} rotate={-8} />
      <SpaceVehicle type="rocket1" delay={1.5} duration={30} startX={75} startY={100} endX={90} endY={-15} scale={0.5} rotate={-5} />
      <SpaceVehicle type="ship1" delay={0.8} duration={35} startX={110} startY={60} endX={-15} endY={50} scale={0.5} rotate={-3} />
    </div>
  )
}
