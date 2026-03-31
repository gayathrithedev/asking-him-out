import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Instagram-style sparkle text — random glitter particles continuously
// popping in and out across the text surface

const SPARKLE_COLORS = ['#fff', '#fad7a0', '#f5b041', '#e67e22', '#f39c12', '#fce4c0']

function generateSparkle() {
  return {
    id: Math.random().toString(36).slice(2),
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: 6 + Math.random() * 14,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    duration: 0.6 + Math.random() * 0.6,
    rotation: Math.random() * 360,
  }
}

function Sparkle({ sparkle }) {
  return (
    <motion.svg
      key={sparkle.id}
      width={sparkle.size}
      height={sparkle.size}
      viewBox="0 0 24 24"
      style={{
        position: 'absolute',
        left: sparkle.x,
        top: sparkle.y,
        pointerEvents: 'none',
        transform: `translate(-50%, -50%) rotate(${sparkle.rotation}deg)`,
        zIndex: 2,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: sparkle.duration, ease: 'easeOut' }}
    >
      {/* 4-point star sparkle shape */}
      <path
        d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z"
        fill={sparkle.color}
      />
    </motion.svg>
  )
}

export default function SparkleText({ children, style = {} }) {
  const [sparkles, setSparkles] = useState([])

  const addSparkle = useCallback(() => {
    const newSparkle = generateSparkle()
    setSparkles(prev => [...prev, newSparkle])
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, newSparkle.duration * 1000)
  }, [])

  useEffect(() => {
    // Spawn sparkles at random intervals — like Instagram stories
    const spawn = () => {
      addSparkle()
      // Random interval between spawns for organic feel
      const next = 80 + Math.random() * 250
      timeoutId = setTimeout(spawn, next)
    }
    let timeoutId = setTimeout(spawn, 100)

    return () => clearTimeout(timeoutId)
  }, [addSparkle])

  return (
    <span style={{
      position: 'relative',
      display: 'inline-block',
      ...style,
    }}>
      {/* Sparkle layer */}
      <span style={{
        position: 'absolute',
        inset: '-8px -4px',
        pointerEvents: 'none',
        overflow: 'visible',
      }}>
        <AnimatePresence>
          {sparkles.map(s => (
            <Sparkle key={s.id} sparkle={s} />
          ))}
        </AnimatePresence>
      </span>

      {/* Actual text */}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </span>
  )
}
