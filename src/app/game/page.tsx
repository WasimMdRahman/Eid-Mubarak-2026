
"use client"

import React from 'react'
import { EidiCollect } from '@/components/EidiCollect'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function GamePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Back Button shifted to top-left */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-[60] flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/80 text-sm rounded-full transition-all border border-white/10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Exit Game
      </Link>
      
      <EidiCollect />
    </main>
  )
}
