import { parse, interpolate, formatHex, samples, converter, type Color } from 'culori'
import type { CurveType } from '@/types/color'

const toLch = converter('lch65')

function easeLinear(t: number): number {
  return t
}

function easeEven(t: number, total: number): number {
  if (total <= 1) return t
  return t
}

function easeReverse(t: number): number {
  return 1 - t
}

export function generatePalette(
  baseHex: string,
  steps: number = 10,
  curve: CurveType = 'linear',
  space: 'lch' | 'lab' | 'rgb' | 'hsl' = 'lch',
): string[] {
  const base = parse(baseHex)
  if (!base) return []

  const baseLch = toLch(base)

  const lightStart = Math.max(5, baseLch.l - 45)
  const lightEnd = Math.min(95, baseLch.l + 45)

  const getEasedT = (t: number): number => {
    switch (curve) {
      case 'reverse':
        return easeReverse(t)
      case 'even':
        return easeEven(t, steps)
      case 'linear':
      default:
        return easeLinear(t)
    }
  }

  const tValues = samples(steps).map((_, i, arr) => {
    const rawT = arr.length === 1 ? 0.5 : i / (arr.length - 1)
    return getEasedT(rawT)
  })

  const result: string[] = []

  for (const t of tValues) {
    const lightness = lightStart + (lightEnd - lightStart) * t
    const modified: Color = {
      mode: 'lch',
      l: lightness,
      c: baseLch.c,
      h: baseLch.h,
    }

    const interpolatedColor = interpolate([base, modified], space)(0.5)
    result.push(formatHex(interpolatedColor))
  }

  return result
}

export function getPaletteShadeNames(count: number): string[] {
  if (count === 10) {
    return ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  }
  if (count === 20) {
    return Array.from({ length: 20 }, (_, i) => `${(i + 1) * 50}`)
  }
  if (count === 50) {
    return Array.from({ length: 50 }, (_, i) => `${i * 2 + 1}`)
  }
  return Array.from({ length: count }, (_, i) => `${i + 1}`)
}
