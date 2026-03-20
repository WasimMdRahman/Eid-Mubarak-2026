"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface RealisticLanternProps {
  size?: number;
  className?: string;
  topOffset?: number; // Distance from top of curtain to lantern ring
}

export function RealisticLantern({ size = 100, className, topOffset = 0 }: RealisticLanternProps) {
  const [isLit, setIsLit] = useState(false)
  const [isToggled, setIsToggled] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-ignite immediately
  useEffect(() => {
    const igniteTimeout = setTimeout(() => {
      setIsLit(true)
    }, 500)
    
    return () => clearTimeout(igniteTimeout)
  }, [])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsToggled(!isToggled)
    setIsShaking(true)
    // Stop shaking after a short duration for the click effect
    setTimeout(() => setIsShaking(false), 800)
  }

  // Dark yellow/golden color for the glow
  const darkYellow = "218, 165, 32"

  return (
    <div 
      className={cn(
        "relative cursor-pointer transition-all duration-700 ease-in-out",
        isLit && !isToggled && "lantern-on",
        isLit && isToggled && "lantern-on-intense",
        (isShaking || isHovered) && "lantern-shake-anim",
        className
      )}
      style={{ 
        width: size, 
        height: size * 1.6,
        marginTop: topOffset
      }}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#4d4d4d" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <radialGradient id="innerGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={`rgba(${darkYellow}, ${isToggled ? '1' : '0.8'})`} />
            <stop offset="100%" stopColor={`rgba(${darkYellow}, 0)`} />
          </radialGradient>
        </defs>

        {/* The Black String extending upwards */}
        <line x1="50" y1="-1000" x2="50" y2="4" stroke="#000" strokeWidth="2" />

        {/* Hanging Ring */}
        <circle cx="50" cy="12" r="8" stroke="url(#metalGradient)" strokeWidth="3" />
        
        {/* Top Cap */}
        <path d="M30 25H70L85 45H15L30 25Z" fill="url(#metalGradient)" />
        <path d="M40 18H60L65 25H35L40 18Z" fill="#111" />

        {/* Main Body Frame */}
        <path d="M15 45H85V125H15V45Z" stroke="url(#metalGradient)" strokeWidth="4" />
        <path d="M50 45V125" stroke="url(#metalGradient)" strokeWidth="2" opacity="0.5" />
        
        {/* Glass Panels */}
        <rect 
          x="20" y="50" width="60" height="70" 
          fill={isLit ? "url(#innerGlow)" : "rgba(255,255,255,0.05)"} 
          rx="2" 
          className="transition-all duration-1000" 
        />
        
        {/* Intricate Geometric Pattern */}
        <path d="M20 70H80M20 95H80M40 50V120M60 50V120" stroke="rgba(218, 165, 32, 0.15)" strokeWidth="0.5" />
        
        {/* The Candle/Light Source */}
        {isLit && (
          <g className={cn("transition-all duration-500", isToggled ? "scale-110 origin-center" : "animate-pulse")}>
            <path d="M45 105 Q50 85 55 105 Z" fill={`rgba(${darkYellow}, 1)`} />
            <circle cx="50" cy="100" r={isToggled ? "18" : "12"} fill="white" opacity={isToggled ? "0.4" : "0.2"} />
          </g>
        )}

        {/* Corner Supports */}
        <path d="M15 45L8 35" stroke="url(#metalGradient)" strokeWidth="2" />
        <path d="M85 45L92 35" stroke="url(#metalGradient)" strokeWidth="2" />

        {/* Base */}
        <path d="M10 125H90L80 145H20L10 125Z" fill="url(#metalGradient)" />
        <path d="M25 145H75V155H25V145Z" fill="#000" />
      </svg>
    </div>
  )
}
