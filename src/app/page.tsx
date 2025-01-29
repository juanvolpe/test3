'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [pageMouseX, setPageMouseX] = useState(0)
  const [pageMouseY, setPageMouseY] = useState(0)
  const [ballPosition, setBallPosition] = useState(270)
  const [ballRotation, setBallRotation] = useState(0)
  const [imagePosition, setImagePosition] = useState('absolute')
  const [imageTop, setImageTop] = useState(window.innerHeight - 300)  // Start at bottom of screen
  const [imageVisible, setImageVisible] = useState(true)  // Add this state
  const [hasInitialized, setHasInitialized] = useState(false)
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([])

  const section1Ref = useRef(null)
  const isSection1InView = useInView(section1Ref, { once: false })

  useEffect(() => {
    // Initial scroll check
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const initialPercent = (window.scrollY / maxScroll) * 100
    setScrollPercent(initialPercent)
    setImageVisible(initialPercent < 20)
    setHasInitialized(true)

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollY(window.scrollY)
      const percent = (window.scrollY / maxScroll) * 100
      setScrollPercent(percent)
      
      // Update image visibility based on scroll percentage
      // Only show image when scrolling up past 20%
      if (percent < 20) {
        setImageVisible(true)
      } else {
        setImageVisible(false)
      }
      
      // Ball position calculations
      const startPosition = 270
      const endPosition = window.innerWidth - 270 - 90
      const moveRange = endPosition - startPosition
      const movePercent = Math.min(percent / 15, 1)
      const newPosition = startPosition + (moveRange * movePercent)
      
      // Ball rotation
      const rotation = (movePercent * 1800)
      
      setBallPosition(newPosition)
      setBallRotation(rotation)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
      setPageMouseX(e.clientX + window.scrollX)
      setPageMouseY(e.clientY + window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 1000)
  }

  const AnimatedText = ({ text }: { text: string }) => (
    <motion.h2
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {text}
    </motion.h2>
  )

  const calculateTilt = (e: React.MouseEvent, card: HTMLElement) => {
    const cardRect = card.getBoundingClientRect()
    const cardCenterX = cardRect.left + cardRect.width / 2
    const cardCenterY = cardRect.top + cardRect.height / 2
    const maxTilt = 15 // maximum tilt angle

    const deltaX = e.clientX - cardCenterX
    const deltaY = e.clientY - cardCenterY
    
    const percentX = deltaX / (cardRect.width / 2)
    const percentY = deltaY / (cardRect.height / 2)

    return {
      rotateX: -percentY * maxTilt,
      rotateY: percentX * maxTilt
    }
  }

  const MagneticButton = () => {
    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    }

    const handleMouseLeave = () => {
      const button = buttonRef.current
      if (!button) return
      
      button.style.transform = `translate(0px, 0px)`
    }

    return (
      <motion.button
        ref={buttonRef}
        className={styles.magneticButton}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Explore Jutsu
      </motion.button>
    )
  }

  return (
      <main className={styles.main}>
      <div className={styles.tracker}>
        <p>Scroll Y: {Math.round(scrollY)}px</p>
        <p>Scroll: {Math.round(scrollPercent)}%</p>
        <p>Mouse X: {mouseX}px</p>
        <p>Mouse Y: {mouseY}px</p>
        <p>Page Mouse X: {Math.round(pageMouseX)}px</p>
        <p>Page Mouse Y: {Math.round(pageMouseY)}px</p>
      </div>

      <motion.div 
        className={styles.scrollProgress}
        style={{
          scaleX: scrollPercent / 100,
          transformOrigin: "left"
        }}
      />

      <motion.section 
        ref={section1Ref}
        className={`${styles.section} ${styles.section1}`}
        initial={{ backgroundColor: "#2c3e50" }}
        whileInView={{
          backgroundColor: ["#2c3e50", "#34495e", "#2c3e50"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={handleClick}
      >
        <motion.div className={styles.floatingShapes}>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.shape}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        <motion.div 
          className={styles.kunai}
          style={{ 
            left: `${ballPosition}px`,
          }}
          animate={{
            rotate: 180
          }}
          transition={{
            duration: 0.1,
            ease: "linear"
          }}
        >
          <Image
            src="/kunai.png"
            alt="Kunai"
            width={360}
            height={360}
            style={{ 
              filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
              transform: 'scale(1)',
              maxWidth: 'none',
              height: 'auto'
            }}
          />
        </motion.div>
        <div className={styles.horizontalLine}></div>
        <div 
          className={`${styles.personaImage} ${!imageVisible ? styles.exit : ''}`}
          style={{
            position: 'fixed',
            top: '323px',
            display: hasInitialized ? 'block' : 'none'
          }}
        >
          <Image
            src="/itachi1.png"
            alt="Itachi"
            width={600}
            height={900}
            style={{ 
              objectFit: 'contain',
              maxWidth: '100%',
              height: 'auto',
              background: 'transparent',
              mixBlendMode: 'normal'
            }}
            priority
            unoptimized
          />
        </div>
        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Path of the Shinobi
        </motion.h1>
        <AnimatedText text="Where legends are forged in the shadows" />
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className={styles.ripple}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            style={{
              left: ripple.x,
              top: ripple.y
            }}
          />
        ))}
      </motion.section>

      <section className={`${styles.section} ${styles.section2}`}>
        <h1>Ninja Alliance</h1>
        <AnimatedText text="United villages, countless jutsu, infinite possibilities" />
        <MagneticButton />
      </section>

      <motion.section 
        className={`${styles.section} ${styles.section3}`}
        initial={{ backgroundColor: "#1a1a1a" }}
        whileInView={{
          backgroundColor: ["#1a1a1a", "#2a2a2a", "#1a1a1a"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={handleClick}
      >
        {/* White Fire Effect */}
        <div className={styles.fireContainer}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.firePart}
              initial={{
                x: 500 + (Math.random() * 1000 - 500),
                y: 0,
                scale: 0
              }}
              animate={{
                x: 500 + (Math.random() * 1000 - 500),
                y: [-100, -600 - (i * 75)],
                scale: [1, 0],
                opacity: [0.7, 0]
              }}
              transition={{
                duration: 4 + (Math.random() * 2),
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>

        {/* 3D Cards Container */}
        <div className={styles.scene3d}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.card3d}
              initial={{
                rotateX: 45,
                rotateY: -45,
                rotateZ: 0,
                z: -200 * i
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget
                const { rotateX, rotateY } = calculateTilt(e, card)
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`
              }}
              style={{
                background: `rgba(255, 255, 255, ${0.1 - (i * 0.02)})`,
                backdropFilter: "blur(8px)",
                transition: "transform 0.1s ease-out"
              }}
            />
          ))}
    </div>

        {/* Content */}
        <motion.div
          className={styles.content3d}
          initial={{ opacity: 0, z: -100 }}
          whileInView={{ opacity: 1, z: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Eternal Mangekyo
          </motion.h1>
          
          <AnimatedText text="Power that transcends generations" />
        </motion.div>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className={styles.ripple}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            style={{
              left: ripple.x,
              top: ripple.y
            }}
          />
        ))}
      </motion.section>
    </main>
  )
}
