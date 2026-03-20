"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Trophy, RefreshCcw, Coins, Play, Pause, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Game Constants
const LANES = [-1, 0, 1] // Left, Middle, Right
const SPAWN_INTERVAL = 1200
const GAME_SPEED = 5 // Base speed of items moving towards the player

interface GameItem {
  id: number
  lane: number
  type: 'eidi' | 'obstacle'
  z: number // 0 (horizon) to 100 (player)
}

type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover'

export function EidiRunner() {
  const [lane, setLane] = useState(0)
  const [items, setItems] = useState<GameItem[]>([])
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<GameStatus>('idle')
  const gameLoopRef = useRef<number>(null)
  const lastSpawnRef = useRef<number>(0)

  const startGame = () => {
    setScore(0)
    setItems([])
    setStatus('playing')
    setLane(0)
    lastSpawnRef.current = performance.now()
  }

  const togglePause = () => {
    if (status === 'playing') setStatus('paused')
    else if (status === 'paused') setStatus('playing')
  }

  const resetGame = () => {
    setStatus('idle')
    setScore(0)
    setItems([])
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'playing') return
    if (e.key === 'ArrowLeft') setLane(prev => Math.max(-1, prev - 1))
    if (e.key === 'ArrowRight') setLane(prev => Math.min(1, prev + 1))
    if (e.key.toLowerCase() === 'p') togglePause()
  }, [status])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const gameLoop = useCallback((timestamp: number) => {
    if (status !== 'playing') return

    // Spawn items
    if (timestamp - lastSpawnRef.current > SPAWN_INTERVAL) {
      const newItem: GameItem = {
        id: Date.now(),
        lane: LANES[Math.floor(Math.random() * LANES.length)],
        type: Math.random() > 0.7 ? 'obstacle' : 'eidi',
        z: 0
      }
      setItems(prev => [...prev, newItem])
      lastSpawnRef.current = timestamp
    }

    // Move items and check collisions
    setItems(prev => {
      const updated = prev.map(item => ({ ...item, z: item.z + GAME_SPEED }))
      
      // Filter out passed items and check collisions
      return updated.filter(item => {
        if (item.z > 85 && item.z < 95 && item.lane === lane) {
          if (item.type === 'eidi') {
            setScore(s => s + 10)
            return false 
          } else {
            setStatus('gameover')
            return true
          }
        }
        return item.z < 110
      })
    })

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [status, lane])

  useEffect(() => {
    if (status === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [status, gameLoop])

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      {/* Game Header / Score Overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-10 py-4 bg-background/60 backdrop-blur-2xl rounded-full border border-accent/20 shadow-2xl">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-accent" />
          <span className="font-headline text-3xl text-accent tabular-nums">Score: {score}</span>
        </div>
        
        {status === 'playing' || status === 'paused' ? (
          <div className="flex items-center gap-3 border-l border-accent/20 pl-8">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 hover:bg-accent/20 text-accent"
              onClick={togglePause}
            >
              {status === 'paused' ? <Play className="h-6 h-6" /> : <Pause className="h-6 h-6" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 hover:bg-destructive/20 text-destructive"
              onClick={resetGame}
            >
              <RefreshCcw className="h-6 h-6" />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Full-Screen 3D Environment */}
      <div className="relative flex-1 perspective-[1200px] flex justify-center items-end overflow-hidden">
        <div 
          className="relative w-[120vw] h-[150vh] origin-bottom transform rotateX(60deg) bg-gradient-to-t from-primary/20 via-primary/5 to-transparent"
          style={{ transform: 'rotateX(55deg) translateY(10%)' }}
        >
          {/* Track Layout */}
          <div className="absolute inset-x-0 top-0 bottom-0 flex justify-between px-[33%] pointer-events-none">
            <div className="w-1.5 h-full bg-accent/10 dashed" />
            <div className="w-1.5 h-full bg-accent/10 dashed" />
          </div>

          {/* Lane Interaction Zones (Full Width) */}
          {status === 'playing' && (
            <div className="absolute inset-0 flex z-50">
              <div className="flex-1 cursor-pointer" onClick={() => setLane(-1)} />
              <div className="flex-1 cursor-pointer" onClick={() => setLane(0)} />
              <div className="flex-1 cursor-pointer" onClick={() => setLane(1)} />
            </div>
          )}

          {/* Render Items */}
          {items.map(item => (
            <div
              key={item.id}
              className="absolute transition-all duration-75"
              style={{
                left: `${50 + item.lane * 33}%`,
                bottom: `${item.z}%`,
                transform: `translate(-50%, 50%) scale(${0.1 + (item.z / 100) * 1.5})`,
                opacity: Math.min(item.z / 10, 1)
              }}
            >
              {item.type === 'eidi' ? (
                <div className="w-20 h-28 bg-red-600 rounded-sm border-2 border-yellow-400 flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-bounce">
                  <div className="text-[12px] font-bold text-yellow-400 mb-2">EIDI</div>
                  <Coins className="w-10 h-10 text-yellow-400" />
                </div>
              ) : (
                <div className="w-48 h-16 bg-accent/90 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] flex items-center justify-center border-t-8 border-accent">
                   <div className="w-full h-2 bg-black/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Player Character (Scaled for full screen) */}
      <div 
        className="absolute bottom-[10%] left-1/2 transition-all duration-300 ease-out z-40"
        style={{ 
          transform: `translateX(calc(-50% + ${lane * 200}px))`,
          opacity: status === 'idle' ? 0 : 1
        }}
      >
        <div className={cn(
          "relative w-24 h-36 transition-transform duration-300",
          lane !== 0 && (lane > 0 ? "rotate-12" : "-rotate-12")
        )}>
          {/* Stylized Boy Character */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#FFDAB9] rounded-full shadow-2xl border-2 border-black/5" />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-16 h-20 bg-accent rounded-b-2xl shadow-2xl border-x-2 border-accent-foreground/10" />
          <div className="absolute top-32 left-[15%] w-6 h-10 bg-primary rounded-b-lg animate-pulse" />
          <div className="absolute top-32 right-[15%] w-6 h-10 bg-primary rounded-b-lg animate-pulse delay-100" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/40 rounded-full blur-xl" />
        </div>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {status === 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-3xl"
          >
            <div className="text-center p-16 max-w-2xl space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-bold uppercase tracking-[0.2em]">
                  <Gamepad2 className="w-5 h-5" />
                  Eid Special
                </div>
                <h3 className="text-8xl md:text-9xl font-headline text-accent drop-shadow-2xl">Eidi Run</h3>
                <p className="text-muted-foreground text-2xl leading-relaxed italic max-w-xl mx-auto">
                  Dash through the festive streets, collect Eidi envelopes, and celebrate the spirit of giving!
                </p>
              </div>
              
              <button 
                onClick={startGame}
                className="group relative inline-flex items-center gap-6 px-16 py-7 bg-black text-white rounded-full font-bold text-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 border border-white/10"
              >
                <Play className="w-8 h-8 fill-white" />
                START GAME
              </button>
              
              <div className="pt-8 flex flex-col items-center gap-4">
                <p className="text-xs text-accent/50 uppercase tracking-[0.5em] font-black">Controls</p>
                <div className="flex gap-8 text-sm text-muted-foreground/60">
                  <span className="flex items-center gap-2"><kbd className="bg-secondary px-3 py-1.5 rounded-lg border border-accent/10">←</kbd> <kbd className="bg-secondary px-3 py-1.5 rounded-lg border border-accent/10">→</kbd> Move</span>
                  <span className="flex items-center gap-2"><kbd className="bg-secondary px-3 py-1.5 rounded-lg border border-accent/10">P</kbd> Pause</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'paused' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-xl"
          >
            <div className="text-center space-y-10">
              <h4 className="text-7xl font-headline text-accent">Game Paused</h4>
              <div className="flex gap-6 justify-center">
                <Button onClick={togglePause} className="bg-accent text-accent-foreground px-12 py-8 rounded-full font-bold text-xl hover:scale-105 transition-transform">
                  Resume
                </Button>
                <Button onClick={resetGame} variant="outline" className="border-accent/40 bg-background/40 px-12 py-8 rounded-full font-bold text-xl hover:bg-accent/10 transition-colors">
                  Quit
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-destructive/10 backdrop-blur-2xl"
          >
            <div className="text-center p-20 bg-background/90 rounded-[4rem] border border-accent/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] space-y-10">
              <div className="space-y-4">
                <h3 className="text-6xl font-headline text-destructive">Oops!</h3>
                <p className="text-muted-foreground text-2xl">Your Eidi Collection</p>
                <div className="text-8xl font-headline text-accent py-6">{score} Eidi</div>
              </div>
              
              <div className="flex flex-col gap-6">
                <button 
                  onClick={startGame}
                  className="group relative inline-flex items-center justify-center gap-4 px-14 py-6 bg-black text-white rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl"
                >
                  <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                  TRY AGAIN
                </button>
                <Button variant="ghost" onClick={resetGame} className="text-muted-foreground hover:text-accent text-lg">
                  Back to Menu
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
