import { wcagContrast, parse } from 'culori'
import type { ContrastResult, WCAGLevelResult } from '@/types/color'

export function getContrast(fgHex: string, bgHex: string): ContrastResult {
  const fg = parse(fgHex)
  const bg = parse(bgHex)

  if (!fg || !bg) {
    return {
      ratio: 1,
      levels: [],
    }
  }

  const ratio = wcagContrast(fg, bg)

  const thresholds: WCAGLevelResult[] = [
    { level: 'AA', size: 'large', threshold: 3, pass: ratio >= 3, label: 'AA Large' },
    { level: 'AA', size: 'normal', threshold: 4.5, pass: ratio >= 4.5, label: 'AA Normal' },
    { level: 'AAA', size: 'large', threshold: 4.5, pass: ratio >= 4.5, label: 'AAA Large' },
    { level: 'AAA', size: 'normal', threshold: 7, pass: ratio >= 7, label: 'AAA Normal' },
  ]

  return {
    ratio: Math.round(ratio * 100) / 100,
    levels: thresholds,
  }
}
