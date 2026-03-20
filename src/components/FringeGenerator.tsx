"use client"

import React, { useState } from 'react'
import { generateGoldFringePattern } from '@/ai/flows/generate-gold-fringe-pattern'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Sparkles, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface FringeGeneratorProps {
  onPatternGenerated: (dataUri: string) => void;
  onClose: () => void;
}

export function FringeGenerator({ onPatternGenerated, onClose }: FringeGeneratorProps) {
  const [prompt, setPrompt] = useState('Classic ornate floral gold embroidery with shimmering metallic thread')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const result = await generateGoldFringePattern({ aestheticPreferences: prompt })
      onPatternGenerated(result.patternImage)
    } catch (error) {
      console.error("Failed to generate pattern:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="fixed top-24 right-4 z-50 w-80 shadow-2xl border-accent/30 bg-background/95 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          Fringe Designer
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="aesthetic" className="text-xs text-muted-foreground uppercase tracking-widest">Aesthetic Vision</Label>
          <Input 
            id="aesthetic"
            placeholder="Describe your gold fringe..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary/50 border-accent/20"
          />
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Crafting Gold...
            </>
          ) : (
            'Generate Pattern'
          )}
        </Button>
        <p className="text-[10px] text-center text-muted-foreground italic">
          AI will generate a unique gold border for your curtains.
        </p>
      </CardContent>
    </Card>
  )
}
