
"use client"

import React from 'react'
import Link from 'next/link'
import { Gamepad2, Play, Coins, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export function GameSection() {
  return (
    <section className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center px-4 py-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        {/* Header Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold uppercase tracking-[0.3em] text-xs mx-auto"
        >
          <Gamepad2 className="w-4 h-4" />
          Eid Special
        </motion.div>

        {/* Title & Description */}
        <div className="space-y-6">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-7xl md:text-9xl font-headline text-accent drop-shadow-2xl"
          >
            Eidi Run
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto italic font-serif"
          >
            Dash through the shimmering desert sands, collect golden Eidi gems, and celebrate the spirit of giving in this 3D festive challenge.
          </motion.p>
        </div>

        {/* Game Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 text-sm text-accent/60 uppercase tracking-widest font-bold"
        >
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Collect Gems
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Set Highscores
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/game">
            <button className="group relative inline-flex items-center gap-6 px-16 py-7 bg-black text-white rounded-full font-bold text-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play className="w-8 h-8 fill-white relative z-10" />
              <span className="relative z-10">START GAME</span>
            </button>
          </Link>
        </motion.div>

        {/* Controls Guide */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="pt-12 space-y-4"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.5em] font-black">Controls</p>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded">←</kbd>
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded">→</kbd>
              <span>Move</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded">Space</kbd>
              <span>Jump</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
