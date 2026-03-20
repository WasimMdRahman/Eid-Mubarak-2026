"use client"

import React from 'react'

interface PersistentMoonProps {
  scrollProgress: number
}

export function PersistentMoon({ scrollProgress }: PersistentMoonProps) {
  // Moon lifts 300px between 0.4 and 0.65 of the reveal phase
  // We'll normalize this relative to the reveal section's 1000vh
  // However, for simplicity across the whole page, we react to the progress
  const moonLiftProgress = scrollProgress < 0.4 ? 0 : Math.min((scrollProgress - 0.4) / 0.25, 1)
  const moonTransform = `translateY(${moonLiftProgress * -300}px) rotate(-30deg)`

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full">
        <div 
          className="relative animate-moon mt-[100px] transition-transform duration-75 ease-out" 
          style={{ transform: moonTransform }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(255,255,200,0.4)]">
            <defs>
              <radialGradient id="moonGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="70%" stopColor="#FFF9C4" />
                <stop offset="100%" stopColor="#FFF59D" />
              </radialGradient>
            </defs>
            <path 
              d="M75 15C55 15 35 35 35 55C35 75 55 95 75 95C60 95 20 85 20 55C20 25 60 15 75 15Z" 
              fill="url(#moonGradient)" 
            />
          </svg>
          <div className="absolute inset-0 blur-3xl bg-accent/10 rounded-full scale-[2.5]" />
        </div>
      </div>
    </div>
  )
}
