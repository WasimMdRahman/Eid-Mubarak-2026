
"use client"

import React from 'react'
import { RealisticLantern } from './RealisticLantern'
import { cn } from '@/lib/utils'

interface CurtainSceneProps {
  scrollProgress: number
}

export function CurtainScene({ scrollProgress }: CurtainSceneProps) {
  // Phase 1: 0 to 0.15 scroll - Lanterns go up
  const lanternPhaseProgress = Math.min(scrollProgress / 0.15, 1)
  const lanternY = lanternPhaseProgress * -1200

  // Phase 2: 0.15 to 0.4 scroll - Curtains open & Date fades
  const curtainPhaseProgress = scrollProgress < 0.15 ? 0 : Math.min((scrollProgress - 0.15) / 0.25, 1)
  const dateOpacity = Math.max(1 - curtainPhaseProgress * 3, 0) // Fade out faster
  
  // Curtain transforms with flare (A-shape)
  const curtainLeftTransform = `translateX(calc(-${curtainPhaseProgress * 120}% - 25px))`
  const curtainRightTransform = `translateX(calc(${curtainPhaseProgress * 120}% + 25px))`

  // Phase 4: 0.65 to 0.8 - Headline appears
  const headlineProgress = scrollProgress < 0.65 ? 0 : Math.min((scrollProgress - 0.65) / 0.15, 1)
  const showEidMubarak = headlineProgress > 0.5
  
  // Phase 5: 0.8 to 1.0 - Punchline appears
  const punchlineProgress = scrollProgress < 0.8 ? 0 : Math.min((scrollProgress - 0.8) / 0.2, 1)
  const showPunchline = punchlineProgress > 0.5

  // Hide the entire reveal overlay when we reach the game section (scrollProgress >= 1.0)
  // Using visibility and pointer-events to prevent overlap and interaction issues
  const isFinished = scrollProgress >= 1.0
  const revealOpacity = isFinished ? 0 : 1

  return (
    <div 
      className="relative w-full h-[1000vh]" 
      style={{ 
        opacity: revealOpacity,
        visibility: isFinished ? 'hidden' : 'visible',
        pointerEvents: isFinished ? 'none' : 'auto',
        transition: 'opacity 0.5s ease-out'
      }}
    >
      {/* Date Reveal Layer */}
      <div className="fixed inset-0 z-15 pointer-events-none flex items-center justify-center">
        <div 
          className="text-center mt-[400px] transition-opacity duration-300" 
          style={{ opacity: dateOpacity }}
        >
          <p className="text-accent/30 font-serif italic text-sm tracking-[0.5em] mb-4 uppercase">Coming Together</p>
          <h2 className="text-[36px] font-serif text-accent tracking-widest drop-shadow-2xl">
            21 . 03 . 2026
          </h2>
        </div>
      </div>

      {/* Curtain Layer */}
      <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
        {/* Left Curtain */}
        <div 
          className="absolute top-0 left-0 w-1/2 h-full bg-primary curtain-left shadow-[20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-75 ease-out border-r border-accent/10 pointer-events-auto"
          style={{ transform: curtainLeftTransform }}
        >
          <div className="absolute inset-0 curtain-creases opacity-80" />
          <div className="absolute top-0 right-0 w-1 h-full bg-accent/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-80" />
          
          <div className="z-20 relative h-full w-full" style={{ transform: `translateY(${lanternY}px)`, transition: 'transform 0.1s ease-out' }}>
            <div className="absolute left-[15%] top-0"><RealisticLantern size={120} /></div>
            <div className="absolute left-[45%] top-0"><RealisticLantern size={80} /></div>
            <div className="absolute left-[30%] top-0"><RealisticLantern size={150} topOffset={200} /></div>
          </div>
        </div>

        {/* Right Curtain */}
        <div 
          className="absolute top-0 right-0 w-1/2 h-full bg-primary curtain-right shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-75 ease-out border-l border-accent/10 pointer-events-auto"
          style={{ transform: curtainRightTransform }}
        >
          <div className="absolute inset-0 curtain-creases opacity-80" />
          <div className="absolute top-0 left-0 w-1 h-full bg-accent/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent opacity-80" />

          <div className="z-20 relative h-full w-full" style={{ transform: `translateY(${lanternY}px)`, transition: 'transform 0.1s ease-out' }}>
            <div className="absolute right-[10%] top-0"><RealisticLantern size={100} /></div>
            <div className="absolute right-[25%] top-0"><RealisticLantern size={70} topOffset={150} /></div>
            <div className="absolute right-[40%] top-0"><RealisticLantern size={130} topOffset={300} /></div>
            <div className="absolute right-[15%] top-0"><RealisticLantern size={90} topOffset={450} /></div>
          </div>
        </div>
      </div>

      {/* Foreground Greeting Layer (Text) */}
      <section className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center px-4 max-w-5xl">
          <h1 className={cn(
            "text-7xl md:text-[10rem] font-headline text-accent animate-glow leading-none tracking-tighter transition-all duration-1000 ease-out transform",
            showEidMubarak ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}>
            Eid Mubarak
          </h1>
          
          <p className={cn(
            "text-xl md:text-3xl font-serif italic text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed font-light mt-12 transition-all duration-1000 ease-out transform",
            showPunchline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            Wishing you a season of light, a home filled with laughter, and a heart brimming with peace.
          </p>
        </div>

        {/* Scroll Prompt */}
        <div className={cn(
          "absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-500",
          scrollProgress > 0.05 ? 'opacity-0' : 'opacity-100'
        )}>
          <div className="w-8 h-12 border-2 border-accent/30 rounded-full flex justify-center p-2">
            <div className="w-1.5 h-3 bg-accent/60 rounded-full animate-bounce" />
          </div>
          <span className="text-[10px] text-accent/50 uppercase tracking-[0.5em] font-bold">Scroll to Reveal</span>
        </div>
      </section>
    </div>
  )
}
