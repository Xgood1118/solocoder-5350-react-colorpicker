import { parse, converter, formatHex, type Color } from 'culori'

const toRgb = converter('rgb')

function applyMatrix(r: number, g: number, b: number, m: number[]): [number, number, number] {
  return [
    r * m[0] + g * m[1] + b * m[2],
    r * m[3] + g * m[4] + b * m[5],
    r * m[6] + g * m[7] + b * m[8],
  ]
}

const MATRICES: Record<string, number[]> = {
  protanopia: [
    0.567, 0.433, 0.000,
    0.558, 0.442, 0.000,
    0.000, 0.242, 0.758,
  ],
  deuteranopia: [
    0.625, 0.375, 0.000,
    0.700, 0.300, 0.000,
    0.000, 0.300, 0.700,
  ],
  tritanopia: [
    0.950, 0.050, 0.000,
    0.000, 0.433, 0.567,
    0.000, 0.475, 0.525,
  ],
  achromatopsia: [
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
  ],
}

export type ColorBlindness = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

export function simulateColorBlindness(hex: string, type: ColorBlindness): string {
  if (type === 'normal') return hex

  const matrix = MATRICES[type]
  if (!matrix) return hex

  const parsed = parse(hex)
  if (!parsed) return hex

  const rgbColor = toRgb(parsed)
  const r = rgbColor.r / 255
  const g = rgbColor.g / 255
  const b = rgbColor.b / 255

  const [sr, sg, sb] = applyMatrix(r, g, b, matrix)

  const simulated: Color = {
    mode: 'rgb',
    r: Math.max(0, Math.min(1, sr)) * 255,
    g: Math.max(0, Math.min(1, sg)) * 255,
    b: Math.max(0, Math.min(1, sb)) * 255,
  }

  return formatHex(simulated)
}
