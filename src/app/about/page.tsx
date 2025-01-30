'use client'

import { motion } from 'framer-motion'
import styles from './about.module.css'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className={styles.main}>
      {/* Background gradient that follows mouse */}
      <div 
        className={styles.gradientBackground}
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />
      
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.title}
        >
          About the Journey
        </motion.h1>

        <motion.div 
          className={styles.imageContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Image
            src="/itachi2.png"
            alt="Ninja Profile"
            width={400}
            height={400}
            className={styles.profileImage}
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={styles.description}
        >
          In the shadows of ancient traditions and modern innovation, we forge a path
          that transcends ordinary boundaries. Our journey is one of constant growth,
          relentless pursuit of excellence, and unwavering dedication to the art of
          the shinobi.
        </motion.p>

        <motion.div
          className={styles.statsContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className={styles.stat}>
            <h3>1000+</h3>
            <p>Jutsu Mastered</p>
          </div>
          <div className={styles.stat}>
            <h3>5</h3>
            <p>Great Nations</p>
          </div>
          <div className={styles.stat}>
            <h3>∞</h3>
            <p>Possibilities</p>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
} 