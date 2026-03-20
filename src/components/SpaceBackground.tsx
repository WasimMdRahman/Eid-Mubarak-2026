
"use client"

import React, { useRef, useEffect } from 'react'

/**
 * @fileOverview Galactic star background animation.
 * Features orbiting stars with variable speeds and opacities.
 */

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        initStars()
      }
    }

    const STAR_COUNT = 350
    let stars: Star[] = []

    class Star {
      centerX: number
      centerY: number
      radius: number
      angle: number
      speed: number
      size: number
      opacity: number

      constructor() {
        this.centerX = Math.random() * window.innerWidth
        this.centerY = Math.random() * window.innerHeight

        this.radius = Math.random() * 300 + 50
        this.angle = Math.random() * Math.PI * 2
        this.speed = Math.random() * 0.0015 + 0.0005

        this.size = Math.random() * 1.5 + 0.5
        this.opacity = Math.random() * 0.8 + 0.2
      }

      update() {
        this.angle += this.speed
      }

      draw(context: CanvasRenderingContext2D) {
        const x = this.centerX + Math.cos(this.angle) * this.radius
        const y = this.centerY + Math.sin(this.angle) * this.radius

        context.beginPath()
        context.arc(x, y, this.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        context.fill()
      }
    }

    function initStars() {
      stars = []
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star())
      }
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.update()
        star.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}
