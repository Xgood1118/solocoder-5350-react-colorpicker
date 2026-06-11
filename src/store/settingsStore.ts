import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColorFormat, Settings } from '@/types/color'

interface SettingsState extends Settings {
  setDefaultFormat: (format: ColorFormat) => void
  setHistoryCapacity: (capacity: number) => void
  setTheme: (theme: Settings['theme']) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      defaultFormat: 'hex',
      historyCapacity: 50,
      theme: 'system',

      setDefaultFormat: (format: ColorFormat) => set({ defaultFormat: format }),
      setHistoryCapacity: (capacity: number) => set({ historyCapacity: capacity }),
      setTheme: (theme: Settings['theme']) => set({ theme }),
    }),
    {
      name: 'colorpicker-settings',
    },
  ),
)
