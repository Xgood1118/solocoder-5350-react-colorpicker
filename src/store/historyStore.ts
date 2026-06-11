import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry } from '@/types/color'

interface HistoryState {
  entries: HistoryEntry[]
  maxCapacity: number
  addColor: (hex: string) => void
  removeColor: (hex: string) => void
  clearHistory: () => void
  setMaxCapacity: (capacity: number) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      maxCapacity: 50,

      addColor: (hex: string) => {
        const { entries, maxCapacity } = get()
        const normalized = hex.toLowerCase()
        const filtered = entries.filter(e => e.hex.toLowerCase() !== normalized)
        const newEntry: HistoryEntry = { hex: normalized, timestamp: Date.now() }
        const newEntries = [newEntry, ...filtered].slice(0, maxCapacity)
        set({ entries: newEntries })
      },

      removeColor: (hex: string) => {
        const normalized = hex.toLowerCase()
        set(state => ({
          entries: state.entries.filter(e => e.hex.toLowerCase() !== normalized),
        }))
      },

      clearHistory: () => {
        set({ entries: [] })
      },

      setMaxCapacity: (capacity: number) => {
        set(state => ({
          maxCapacity: capacity,
          entries: state.entries.slice(0, capacity),
        }))
      },
    }),
    {
      name: 'colorpicker-history',
    },
  ),
)
