import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import CuteCat from './CuteCat'
import SpaceBackground from './SpaceBackground'
import SparkleText from './SparkleText'

const sadMessages = [
  "Please Daddy, Your kitty wants to watch Project Hail Mary with you! 🥺",
  "Daddy nooo... kitty will be so lonely without you 😿",
  "But Daddy... kitty promises to share the popcorn! 🍿🥺",
  "Daddy please... kitty's heart is breaking into pieces 💔",
  "DADDY PLEASEEE 😭 Kitty will never stop asking!",
]

const TRAILER_URL = "https://youtu.be/m08TxIsFTRI"

// ─── Paw prints on click ──────────────────────────────────────────────────────
function PawPrints() {
  const [paws, setPaws] = useState([])

  useEffect(() => {
    const handle = (e) => {
      const id = Date.now() + Math.random()
      const x = e.touches ? e.touches[0].clientX : e.clientX
      const y = e.touches ? e.touches[0].clientY : e.clientY
      setPaws(prev => [...prev.slice(-4), { id, x, y }])
      setTimeout(() => setPaws(prev => prev.filter(p => p.id !== id)), 1000)
    }
    window.addEventListener('click', handle)
    window.addEventListener('touchstart', handle, { passive: true })
    return () => {
      window.removeEventListener('click', handle)
      window.removeEventListener('touchstart', handle)
    }
  }, [])

  return (
    <AnimatePresence>
      {paws.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed', left: p.x - 10, top: p.y - 10,
            fontSize: 16, pointerEvents: 'none', zIndex: 999,
          }}
        >
          🐾
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

// ─── Cursor glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 })

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x - 150,
        top: pos.y - 150,
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(230,125,34,0.035) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 5,
        transition: 'left 0.15s ease-out, top 0.15s ease-out',
      }}
    />
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [noCount, setNoCount] = useState(0)
  const [mood, setMood] = useState('happy')
  const [showBubble, setShowBubble] = useState(false)
  const [bubbleText, setBubbleText] = useState('')
  const [bubbleType, setBubbleType] = useState('love')
  const [yesClicked, setYesClicked] = useState(false)
  const [showQuestion, setShowQuestion] = useState(true)

  useEffect(() => {
    if (showBubble) {
      const t = setTimeout(() => setShowBubble(false), 3200)
      return () => clearTimeout(t)
    }
  }, [showBubble, bubbleText])

  const fireConfetti = useCallback(() => {
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#fff', '#fad7a0', '#ff6b8a', '#f5b041']
    const defaults = { startVelocity: 35, spread: 360, ticks: 150, zIndex: 200, colors, gravity: 0.8 }

    confetti({ ...defaults, particleCount: 100, origin: { x: 0.2, y: 0.5 }, spread: 60, startVelocity: 55 })
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.5, y: 0.35 }, spread: 140 })
    confetti({ ...defaults, particleCount: 100, origin: { x: 0.8, y: 0.5 }, spread: 60, startVelocity: 55 })
  }, [])

  const handleYes = () => {
    if (yesClicked) return
    setYesClicked(true)
    setMood('smirk')
    setBubbleText('Love you Daddy! 💕')
    setBubbleType('love')
    setShowBubble(true)

    fireConfetti()
    setTimeout(fireConfetti, 1800)
    setTimeout(fireConfetti, 4000)

    setTimeout(() => setShowQuestion(false), 2800)
  }

  const handleNo = () => {
    const c = noCount + 1
    setNoCount(c)
    setMood('sad')
    setBubbleText(sadMessages[Math.min(c - 1, sadMessages.length - 1)])
    setBubbleType('sad')
    setShowBubble(true)
  }

  const yesScale = Math.min(1 + noCount * 0.18, 2)
  const noScale = Math.max(1 - noCount * 0.13, 0.3)
  const noOpacity = Math.max(1 - noCount * 0.18, 0.2)
  const yesText = noCount >= 5 ? 'SAY YES ALREADY! 💕' : noCount >= 3 ? 'YES PLEASE! 💕' : 'Yes'
  const noText = noCount >= 5 ? '...' : 'No'

  return (
    <>
      <SpaceBackground />
      <CursorGlow />
      <PawPrints />

      <div style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center',
        padding: 'clamp(1rem, 3vh, 2rem) clamp(1.5rem, 5vw, 3rem)',
        maxWidth: 800, width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        height: '100dvh',
        justifyContent: 'center',
        gap: 'clamp(0.8rem, 2vh, 1.5rem)',
      }}>

        {/* ─── Overline ─── */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <div style={{
            width: 30, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(210,120,70,0.5))',
          }} />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.6rem, 1.3vw, 0.75rem)',
            fontWeight: 500,
            color: 'rgba(220,140,80,0.7)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}>
            A question from your kitten
          </span>
          <div style={{
            width: 30, height: 1,
            background: 'linear-gradient(90deg, rgba(210,120,70,0.5), transparent)',
          }} />
        </motion.div>

        {/* ─── Question / Response ─── */}
        <AnimatePresence mode="wait">
          {showQuestion ? (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6 }}
              style={{ width: '100%' }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
                  fontWeight: 200,
                  color: '#e8c4a0',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 40px rgba(200,100,50,0.15)',
                }}
              >
                Daddy, will you watch
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.9,
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(1.8rem, 6vw, 3.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginTop: 'clamp(0.2rem, 0.5vh, 0.4rem)',
                  background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 20%, #e67e22 45%, #f39c12 65%, #f5b041 80%, #fad7a0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 35px rgba(230,125,34,0.35))',
                }}
              >
                Project Hail Mary
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.2,
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
                  fontWeight: 200,
                  color: '#e8c4a0',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  marginTop: 'clamp(0.1rem, 0.3vh, 0.2rem)',
                  marginBottom: 'clamp(0.8rem, 2vh, 1.5rem)',
                  textShadow: '0 0 40px rgba(200,100,50,0.15)',
                }}
              >
                with your{' '}
                <span style={{
                  color: '#f39c12',
                  fontWeight: 400,
                  textShadow: '0 0 20px rgba(243,156,18,0.3)',
                }}>
                  kitten
                </span>
                ?
              </motion.h1>

              {/* ─── Buttons ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  display: 'flex', justifyContent: 'center',
                  gap: 'clamp(0.8rem, 2vw, 1.2rem)',
                  alignItems: 'center',
                }}
              >
                <motion.button
                  onClick={handleYes}
                  animate={{ scale: yesScale }}
                  whileHover={{
                    scale: yesScale * 1.05,
                    boxShadow: '0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(139,92,246,0.15)',
                  }}
                  whileTap={{ scale: yesScale * 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    padding: `clamp(12px, 1.8vh, 18px) clamp(36px, 6vw, 56px)`,
                    border: 'none',
                    borderRadius: 60,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: `clamp(0.9rem, 2vw, 1.1rem)`,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa, #c084fc)',
                    color: 'white',
                    letterSpacing: '0.5px',
                    boxShadow: '0 0 30px rgba(139,92,246,0.25), 0 4px 20px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {yesText}
                </motion.button>

                <motion.button
                  onClick={handleNo}
                  animate={{ scale: noScale, opacity: noOpacity }}
                  whileHover={{ scale: noScale * 1.05 }}
                  whileTap={{ scale: noScale * 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    padding: 'clamp(12px, 1.8vh, 18px) clamp(28px, 5vw, 44px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 60,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(10px)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {noText}
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {noCount >= 2 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontSize: 'clamp(0.6rem, 1.2vw, 0.72rem)',
                      color: 'rgba(200,120,60,0.35)',
                      fontWeight: 300,
                      marginTop: 'clamp(0.4rem, 1vh, 0.6rem)',
                      letterSpacing: '1px',
                    }}
                  >
                    Daddy said no {noCount} times... but kitty never gives up 🐾
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

          ) : (

            /* ─── Yes response ─── */
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ textAlign: 'center' }}
            >
              <motion.h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(2.2rem, 7vw, 3.8rem)',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #e74c3c, #e67e22, #f39c12, #fad7a0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(230,125,34,0.35))',
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                It's a date.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                style={{
                  color: '#d4a574',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  lineHeight: 1.8,
                  fontWeight: 300,
                  marginTop: 'clamp(0.5rem, 1.5vh, 1rem)',
                }}
              >
                Kitty is so happy right now.<br />
                Can't wait to watch it with you, Daddy.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Cat + Speech Bubble ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'relative',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                style={{
                  position: 'relative',
                  background: bubbleType === 'love'
                    ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
                    : 'rgba(255,255,255,0.08)',
                  color: bubbleType === 'love' ? 'white' : 'rgba(255,255,255,0.7)',
                  padding: 'clamp(10px, 1.5vh, 14px) clamp(16px, 3vw, 24px)',
                  borderRadius: 16,
                  fontSize: 'clamp(0.72rem, 1.5vw, 0.85rem)',
                  fontWeight: 500,
                  maxWidth: 'clamp(220px, 55vw, 300px)',
                  textAlign: 'center',
                  backdropFilter: bubbleType === 'sad' ? 'blur(20px)' : 'none',
                  border: bubbleType === 'sad' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  boxShadow: bubbleType === 'love'
                    ? '0 10px 40px rgba(139,92,246,0.3)'
                    : '0 10px 40px rgba(0,0,0,0.3)',
                  zIndex: 30,
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {bubbleText}
                <div style={{
                  position: 'absolute', bottom: -6, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `8px solid ${bubbleType === 'love' ? '#a78bfa' : 'rgba(255,255,255,0.08)'}`,
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          <CuteCat mood={mood} />
        </motion.div>

        {/* ─── Footer ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 'clamp(0.3rem, 0.8vh, 0.5rem)',
          }}
        >
          <motion.a
            href={TRAILER_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              borderColor: 'rgba(230,125,34,0.35)',
              boxShadow: '0 0 20px rgba(230,125,34,0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center',
              gap: 8,
              padding: 'clamp(8px, 1vh, 12px) clamp(16px, 3vw, 24px)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 50,
              color: 'rgba(210,150,100,0.6)',
              textDecoration: 'none',
              fontWeight: 400,
              fontSize: 'clamp(0.65rem, 1.3vw, 0.78rem)',
              fontFamily: "'Space Grotesk', sans-serif",
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)' }}>▶</span>
            Watch Trailer
          </motion.a>

          <div style={{
            fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
            fontWeight: 400,
            color: '#c47a4a',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(200,120,60,0.3)',
          }}>
            <SparkleText>
              From Kitty, with all the love in the universe 💕
            </SparkleText>
          </div>
        </motion.div>
      </div>
    </>
  )
}
