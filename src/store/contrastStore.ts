import { create } from 'zustand'

interface ContrastState {
  foreground: string
  background: string
  setForeground: (hex: string) => void
  setBackground: (hex: string) => void
  swap: () => void
}

export const useContrastStore = create<ContrastState>(set => ({
  foreground: '#ffffff',
  background: '#000000',

  setForeground: (hex: string) => set({ foreground: hex }),
  setBackground: (hex: string) => set({ background: hex }),
  swap: () => set(state => ({ foreground: state.background, background: state.foreground })),
}))
