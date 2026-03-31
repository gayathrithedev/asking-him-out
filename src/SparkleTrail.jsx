import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SparkleTrail() {
  const [sparkles, setSparkles] = useState([])

  useEffect(() => {
    const handleMove = (e) => {
      if (Math.random() > 0.82) {
        const colors = ['#e67e22', '#f39c12', '#fad7a0', '#f5b041', '#fff']
        const id = Date.now() + Math.random()
        setSparkles(prev => [...prev.slice(-15), {
          id,
          x: e.clientX,
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 10,
        }])
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== id))
        }, 700)
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000 }}>
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 1, x: s.x, y: s.y }}
            animate={{ opacity: 0, scale: 0, y: s.y - 25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: s.color,
              boxShadow: `0 0 6px ${s.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
