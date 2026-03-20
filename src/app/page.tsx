
"use client"

import { useEffect, useState } from 'react'
import { CurtainScene } from '@/components/CurtainScene'
import { GameSection } from '@/components/GameSection'
import { PersistentMoon } from '@/components/PersistentMoon'
import { SpaceBackground } from '@/components/SpaceBackground'

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      // 1000vh is the height of the CurtainScene reveal
      const revealHeight = viewportHeight * 10 
      const progress = scrollY / revealHeight
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="relative min-h-screen bg-black">
      {/* Galactic Animation sits at the very bottom of the stack */}
      <SpaceBackground />
      
      {/* Persistent Moon stays fixed in the background across all sections */}
      <PersistentMoon scrollProgress={scrollProgress} />
      
      {/* The Scroll-Reveal Curtain Experience (1000vh height) */}
      <CurtainScene scrollProgress={scrollProgress} />

      {/* The Game Section (Appears after the reveal is complete) */}
      <div className="relative z-40 bg-background border-t border-accent/10">
        <GameSection />
      </div>
    </main>
  )
}
