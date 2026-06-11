import { create } from 'zustand'
import type { ColorFormat } from '@/types/color'
import { parseColor, formatColor } from '@/lib/color'

interface ColorState {
  currentHex: string
  inputFormat: ColorFormat
  inputValue: string
  parseError: string | null
  setCurrentHex: (hex: string) => void
  setInputFormat: (format: ColorFormat) => void
  setInputValue: (value: string) => void
  setFromInput: (value: string) => void
}

export const useColorStore = create<ColorState>((set, get) => ({
  currentHex: '#ff0000',
  inputFormat: 'hex',
  inputValue: '#ff0000',
  parseError: null,

  setCurrentHex: (hex: string) => {
    set({ currentHex: hex })
  },

  setInputFormat: (format: ColorFormat) => {
    const { currentHex } = get()
    const formatted = formatColor(currentHex, format)
    set({ inputFormat: format, inputValue: formatted, parseError: null })
  },

  setInputValue: (value: string) => {
    set({ inputValue: value })
  },

  setFromInput: (value: string) => {
    const result = parseColor(value)
    if (result.ok) {
      set({
        currentHex: result.color.hex,
        inputValue: value,
        parseError: null,
      })
    } else {
      set({ parseError: result.error, inputValue: value })
    }
  },
}))
