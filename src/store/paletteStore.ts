import { create } from 'zustand'
import type { CurveType } from '@/types/color'

interface PaletteState {
  baseColor: string
  steps: number
  curve: CurveType
  space: 'lch' | 'lab' | 'rgb' | 'hsl'
  setBaseColor: (hex: string) => void
  setSteps: (steps: number) => void
  setCurve: (curve: CurveType) => void
  setSpace: (space: 'lch' | 'lab' | 'rgb' | 'hsl') => void
}

export const usePaletteStore = create<PaletteState>(set => ({
  baseColor: '#ff0000',
  steps: 10,
  curve: 'linear',
  space: 'lch',

  setBaseColor: (hex: string) => set({ baseColor: hex }),
  setSteps: (steps: number) => set({ steps: Math.max(2, Math.min(50, steps)) }),
  setCurve: (curve: CurveType) => set({ curve }),
  setSpace: (space: 'lch' | 'lab' | 'rgb' | 'hsl') => set({ space }),
}))
