import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function CuteCat({ mood = 'happy' }) {
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 180)
    }, 3000 + Math.random() * 1500)
    return () => clearInterval(blinkInterval)
  }, [])

  const eyeHeight = isBlinking ? 1.5 : 14
  const pupilVisible = !isBlinking

  const tailVariants = {
    happy: {
      d: [
        "M 270 310 Q 310 270 320 300 Q 330 330 310 340",
        "M 270 310 Q 320 260 330 290 Q 340 320 315 335",
        "M 270 310 Q 310 270 320 300 Q 330 330 310 340",
      ],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
    smirk: {
      d: [
        "M 270 310 Q 320 240 340 270 Q 360 300 330 320",
        "M 270 310 Q 330 230 350 260 Q 370 290 340 315",
        "M 270 310 Q 320 240 340 270 Q 360 300 330 320",
      ],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
    },
    sad: {
      d: "M 270 310 Q 290 330 280 350 Q 270 370 260 360",
      transition: { duration: 0.8 }
    }
  }

  const mouthPaths = {
    happy: "M 155 225 Q 165 240 175 225 Q 185 240 195 225",
    smirk: "M 148 222 Q 165 248 175 230 Q 185 248 202 222",
    sad: "M 155 238 Q 165 225 175 238 Q 185 225 195 238",
  }

  const bodyVariants = {
    happy: {
      y: [0, -5, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    smirk: {
      y: [0, -15, -12],
      scale: [1, 1.08, 1.06],
      transition: { duration: 1, ease: "easeOut" }
    },
    sad: {
      y: [0, 8],
      scale: [1, 0.92],
      rotate: [0, 3],
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <motion.div style={{ position: 'relative', display: 'inline-block' }}>
      <motion.svg
        viewBox="0 0 350 400"
        style={{
          width: 'clamp(150px, 22vh, 260px)',
          height: 'clamp(170px, 25vh, 300px)',
          overflow: 'visible',
        }}
        variants={bodyVariants}
        animate={mood}
      >
        <defs>
          <radialGradient id="catGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6b8a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff6b8a" stopOpacity="0" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="3" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.15"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4066" />
            <stop offset="100%" stopColor="#ff8fa3" />
          </linearGradient>
          <filter id="heartGlow">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="175" cy="260" r="140" fill="url(#catGlow)" />

        <g filter="url(#softShadow)">
          {/* Body */}
          <ellipse cx="175" cy="310" rx="85" ry="60" fill="#ffcad4" />
          <ellipse cx="175" cy="320" rx="75" ry="50" fill="#ffc0cb" />

          {/* Tail */}
          <motion.path
            variants={tailVariants}
            animate={mood}
            stroke="#ffc0cb"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />

          {/* Front paws */}
          <ellipse cx="130" cy="360" rx="28" ry="14" fill="#ffcad4" />
          <ellipse cx="220" cy="360" rx="28" ry="14" fill="#ffcad4" />
          <circle cx="120" cy="358" r="5" fill="#ff8fa3" opacity="0.4" />
          <circle cx="132" cy="355" r="5" fill="#ff8fa3" opacity="0.4" />
          <circle cx="143" cy="358" r="5" fill="#ff8fa3" opacity="0.4" />
          <circle cx="210" cy="358" r="5" fill="#ff8fa3" opacity="0.4" />
          <circle cx="222" cy="355" r="5" fill="#ff8fa3" opacity="0.4" />
          <circle cx="233" cy="358" r="5" fill="#ff8fa3" opacity="0.4" />

          {/* Head */}
          <circle cx="175" cy="195" r="72" fill="#ffc0cb" />
          <circle cx="165" cy="180" r="55" fill="#ffcad4" opacity="0.4" />

          {/* Left ear */}
          <polygon points="112,155 90,75 145,130" fill="#ffc0cb" />
          <polygon points="118,145 100,85 140,130" fill="#ff8fa3" opacity="0.6" />

          {/* Right ear */}
          <polygon points="238,155 260,75 205,130" fill="#ffc0cb" />
          <polygon points="232,145 250,85 210,130" fill="#ff8fa3" opacity="0.6" />

          {/* Eyes */}
          <g>
            <ellipse cx="148" cy="190" rx="18" ry="20" fill="white" />
            <motion.ellipse
              cx="150" cy="192" rx="10"
              animate={{ ry: eyeHeight }}
              transition={{ duration: 0.1 }}
              fill="#2c2c2c"
            />
            {pupilVisible && (
              <>
                <circle cx="155" cy="185" r="5" fill="white" opacity="0.9" />
                <circle cx="145" cy="195" r="2.5" fill="white" opacity="0.5" />
              </>
            )}

            <ellipse cx="202" cy="190" rx="18" ry="20" fill="white" />
            <motion.ellipse
              cx="200" cy="192" rx="10"
              animate={{ ry: eyeHeight }}
              transition={{ duration: 0.1, delay: 0.05 }}
              fill="#2c2c2c"
            />
            {pupilVisible && (
              <>
                <circle cx="205" cy="185" r="5" fill="white" opacity="0.9" />
                <circle cx="195" cy="195" r="2.5" fill="white" opacity="0.5" />
              </>
            )}
          </g>

          {/* Sad eye tears shimmer */}
          <AnimatePresence>
            {mood === 'sad' && (
              <>
                <motion.ellipse
                  cx="148" cy="210" rx="6" ry="4"
                  fill="#89CFF0" opacity="0.5"
                  initial={{ opacity: 0, ry: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3], ry: [2, 5, 2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.ellipse
                  cx="202" cy="210" rx="6" ry="4"
                  fill="#89CFF0" opacity="0.5"
                  initial={{ opacity: 0, ry: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3], ry: [2, 5, 2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Tear drops */}
          <AnimatePresence>
            {mood === 'sad' && (
              <>
                <motion.circle
                  cx="145" cy="215" r="3" fill="#89CFF0"
                  initial={{ opacity: 0, cy: 215 }}
                  animate={{ opacity: [0, 0.7, 0], cy: [215, 260] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn" }}
                />
                <motion.circle
                  cx="205" cy="215" r="3" fill="#89CFF0"
                  initial={{ opacity: 0, cy: 215 }}
                  animate={{ opacity: [0, 0.7, 0], cy: [215, 260] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn", delay: 0.7 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Nose */}
          <path d="M 171 213 L 175 220 L 179 213 Z" fill="#ff6b8a" />

          {/* Mouth */}
          <motion.path
            d={mouthPaths[mood]}
            animate={{ d: mouthPaths[mood] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            stroke="#ff6b8a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Whiskers */}
          <g stroke="#ffb3c1" strokeWidth="1.8" opacity="0.5" strokeLinecap="round">
            <line x1="85" y1="195" x2="135" y2="205" />
            <line x1="82" y1="210" x2="133" y2="212" />
            <line x1="85" y1="225" x2="135" y2="219" />
            <line x1="265" y1="195" x2="215" y2="205" />
            <line x1="268" y1="210" x2="217" y2="212" />
            <line x1="265" y1="225" x2="215" y2="219" />
          </g>

          {/* Blush */}
          <circle cx="120" cy="215" r="14" fill="url(#blushGrad)" />
          <circle cx="230" cy="215" r="14" fill="url(#blushGrad)" />

          {/* Pulsing heart on chest */}
          <motion.g
            animate={{
              scale: [0.9, 1.15, 0.9],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: '175px', originY: '297px' }}
          >
            <motion.path
              d="M 165 290 Q 165 278 175 284 Q 185 278 185 290 Q 185 303 175 308 Q 165 303 165 290"
              fill="url(#heartGrad)"
              filter="url(#heartGlow)"
              animate={{
                scale: [0.9, 1.15, 0.9],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>
        </g>
      </motion.svg>

      {/* Happy sparkles around cat */}
      <AnimatePresence>
        {mood === 'smirk' && (
          <>
            {[
              { x: '-8%', y: '15%', delay: 0 },
              { x: '95%', y: '10%', delay: 0.3 },
              { x: '100%', y: '50%', delay: 0.6 },
              { x: '-12%', y: '55%', delay: 0.9 },
            ].map((s, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute', left: s.x, top: s.y,
                  fontSize: 'clamp(14px, 2vw, 22px)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0], rotate: [0, 180] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: s.delay }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
