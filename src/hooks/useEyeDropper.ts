import { useState, useEffect, useCallback } from 'react'

interface EyeDropperOpenResult {
  sRGBHex: string
}

interface EyeDropperAPI {
  open: (options?: { signal?: AbortSignal }) => Promise<EyeDropperOpenResult>
}

declare global {
  interface Window {
    EyeDropper?: new () => EyeDropperAPI
  }
}

export function useEyeDropper(): {
  isSupported: boolean
  pick: () => Promise<string | null>
  isPicking: boolean
} {
  const [isSupported, setIsSupported] = useState(false)
  const [isPicking, setIsPicking] = useState(false)

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'EyeDropper' in window)
  }, [])

  const pick = useCallback(async (): Promise<string | null> => {
    if (!isSupported || !window.EyeDropper) return null

    try {
      setIsPicking(true)
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()
      return result.sRGBHex
    } catch {
      return null
    } finally {
      setIsPicking(false)
    }
  }, [isSupported])

  return { isSupported, pick, isPicking }
}
