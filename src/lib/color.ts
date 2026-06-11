import {
  converter,
  formatHex,
  parse,
  type Color,
} from 'culori'
import type {
  ParseResult,
  ColorFormat,
  RGB,
  HSL,
  HSV,
  CMYK,
  LAB,
  LCH,
  ColorBlindnessType,
} from '@/types/color'
import { clamp, normalizeAngle, round, stripUnicode } from './utils'

export const COLOR_FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'lab', 'lch']

export const COLOR_BLINDNESS_TYPES: ColorBlindnessType[] = [
  { id: 'normal', name: '正常视觉', description: '标准色彩感知' },
  { id: 'protanopia', name: '红色盲', description: '无法感知红色光' },
  { id: 'deuteranopia', name: '红绿色盲', description: '最常见的色盲类型' },
  { id: 'tritanopia', name: '蓝黄色盲', description: '无法感知蓝黄色光' },
  { id: 'achromatopsia', name: '全色盲', description: '完全无法感知色彩' },
]

const toRgb = converter('rgb')
const toHsl = converter('hsl')
const toHsv = converter('hsv')
const toLab = converter('lab65')
const toLch = converter('lch65')

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255

  const k = 1 - Math.max(rn, gn, bn)
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }
  const c = (1 - rn - k) / (1 - k)
  const m = (1 - gn - k) / (1 - k)
  const y = (1 - bn - k) / (1 - k)

  return {
    c: clamp(round(c * 100, 1), 0, 100),
    m: clamp(round(m * 100, 1), 0, 100),
    y: clamp(round(y * 100, 1), 0, 100),
    k: clamp(round(k * 100, 1), 0, 100),
  }
}

function colorToCmyk(color: Color): CMYK {
  const c = toRgb(color)
  const r = clamp(Math.round(c.r * 255), 0, 255)
  const g = clamp(Math.round(c.g * 255), 0, 255)
  const b = clamp(Math.round(c.b * 255), 0, 255)
  const cmyk = rgbToCmyk(r, g, b)
  if ((c as { alpha?: number }).alpha !== undefined) {
    cmyk.a = clamp(round((c as { alpha: number }).alpha, 2), 0, 1)
  }
  return cmyk
}

export function parseColor(input: string | null | undefined): ParseResult {
  if (input == null) {
    return { ok: false, error: '输入不能为空' }
  }

  const cleaned = stripUnicode(input.trim())

  if (!cleaned) {
    return { ok: false, error: '输入不能为空' }
  }

  try {
    const detected = detectAndParse(cleaned)
    if (detected) {
      return detected
    }

    const parsed = parse(cleaned)
    if (parsed) {
      const hex = formatHex(parsed)
      const format = mapCuloriModeToFormat(parsed.mode)
      return {
        ok: true,
        color: {
          format,
          value: culoriToOurFormat(parsed, format),
          hex,
          hasAlpha: typeof (parsed as { alpha?: number }).alpha === 'number',
        },
      }
    }

    return { ok: false, error: `无法解析颜色: ${cleaned}` }
  } catch (e) {
    return { ok: false, error: `解析错误: ${(e as Error).message}` }
  }
}

function detectAndParse(input: string): ParseResult | null {
  const pureNumbers = input.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(-?\d+(?:\.\d+)?))?$/)
  if (pureNumbers) {
    const [, r, g, b, a] = pureNumbers
    const rgbObj: RGB = {
      r: clamp(parseFloat(r), 0, 255),
      g: clamp(parseFloat(g), 0, 255),
      b: clamp(parseFloat(b), 0, 255),
    }
    if (a !== undefined) {
      rgbObj.a = clamp(parseFloat(a), 0, 1)
    }
    const parsed = parse(`rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`)
    if (parsed) {
      return {
        ok: true,
        color: {
          format: 'rgb',
          value: rgbObj,
          hex: formatHex(parsed),
          hasAlpha: a !== undefined,
        },
      }
    }
  }

  const hexMatch = input.match(/^#?([0-9a-fA-F]{3,8})$/)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('')
    } else if (hex.length === 4) {
      hex = hex.split('').map(c => c + c).join('')
    }
    if (hex.length === 6 || hex.length === 8) {
      const parsed = parse('#' + hex)
      if (parsed) {
        const hasAlpha = hex.length === 8
        return {
          ok: true,
          color: {
            format: 'hex',
            value: hexToRgb('#' + hex, hasAlpha),
            hex: formatHex(parsed),
            hasAlpha,
          },
        }
      }
    }
  }

  return null
}

function hexToRgb(hex: string, hasAlpha: boolean): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0 }
  const rgb: RGB = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
  if (result[4]) {
    rgb.a = round(parseInt(result[4], 16) / 255, 2)
  }
  if (hasAlpha && rgb.a === undefined) rgb.a = 1
  return rgb
}

function mapCuloriModeToFormat(mode: string): ColorFormat {
  const map: Record<string, ColorFormat> = {
    rgb: 'rgb',
    hsl: 'hsl',
    hsv: 'hsv',
    lab65: 'lab',
    lch65: 'lch',
    lab: 'lab',
    lch: 'lch',
  }
  return map[mode] || 'hex'
}

function culoriToOurFormat(color: Color, format: ColorFormat) {
  switch (format) {
    case 'rgb': {
      const c = toRgb(color)
      return {
        r: clamp(Math.round(c.r * 255), 0, 255),
        g: clamp(Math.round(c.g * 255), 0, 255),
        b: clamp(Math.round(c.b * 255), 0, 255),
        a: c.alpha !== undefined ? clamp(round(c.alpha, 2), 0, 1) : undefined,
      } as RGB
    }
    case 'hsl': {
      const c = toHsl(color)
      return {
        h: normalizeAngle(round(c.h ?? 0)),
        s: clamp(round(c.s * 100, 1), 0, 100),
        l: clamp(round(c.l * 100, 1), 0, 100),
        a: c.alpha !== undefined ? clamp(round(c.alpha, 2), 0, 1) : undefined,
      } as HSL
    }
    case 'hsv': {
      const c = toHsv(color)
      return {
        h: normalizeAngle(round(c.h ?? 0)),
        s: clamp(round(c.s * 100, 1), 0, 100),
        v: clamp(round(c.v * 100, 1), 0, 100),
        a: c.alpha !== undefined ? clamp(round(c.alpha, 2), 0, 1) : undefined,
      } as HSV
    }
    case 'cmyk': {
      return colorToCmyk(color)
    }
    case 'lab': {
      const c = toLab(color)
      return {
        l: round(c.l, 2),
        a: round(c.a, 2),
        b: round(c.b, 2),
        alpha: c.alpha !== undefined ? clamp(round(c.alpha, 2), 0, 1) : undefined,
      } as LAB
    }
    case 'lch': {
      const c = toLch(color)
      return {
        l: round(c.l, 2),
        c: round(c.c, 2),
        h: normalizeAngle(round(c.h ?? 0, 2)),
        alpha: c.alpha !== undefined ? clamp(round(c.alpha, 2), 0, 1) : undefined,
      } as LCH
    }
    default: {
      const c = toRgb(color)
      return {
        r: clamp(Math.round(c.r * 255), 0, 255),
        g: clamp(Math.round(c.g * 255), 0, 255),
        b: clamp(Math.round(c.b * 255), 0, 255),
        a: c.alpha !== undefined ? clamp(round(c.alpha, 2), 0, 1) : undefined,
      } as RGB
    }
  }
}

export function convertToFormat(hex: string, format: ColorFormat) {
  const parsed = parse(hex)
  if (!parsed) return null
  return culoriToOurFormat(parsed, format)
}

export function formatColor(hex: string, format: ColorFormat): string {
  const parsed = parse(hex)
  if (!parsed) return hex

  switch (format) {
    case 'hex':
      return formatHex(parsed)
    case 'rgb': {
      const c = toRgb(parsed)
      const r = clamp(Math.round(c.r * 255), 0, 255)
      const g = clamp(Math.round(c.g * 255), 0, 255)
      const b = clamp(Math.round(c.b * 255), 0, 255)
      if (c.alpha !== undefined && c.alpha < 1) {
        return `rgba(${r}, ${g}, ${b}, ${clamp(round(c.alpha, 2), 0, 1)})`
      }
      return `rgb(${r}, ${g}, ${b})`
    }
    case 'hsl': {
      const c = toHsl(parsed)
      const h = normalizeAngle(round(c.h ?? 0))
      const s = clamp(round(c.s * 100, 1), 0, 100)
      const l = clamp(round(c.l * 100, 1), 0, 100)
      if (c.alpha !== undefined && c.alpha < 1) {
        return `hsla(${h}, ${s}%, ${l}%, ${clamp(round(c.alpha, 2), 0, 1)})`
      }
      return `hsl(${h}, ${s}%, ${l}%)`
    }
    case 'hsv': {
      const c = toHsv(parsed)
      const h = normalizeAngle(round(c.h ?? 0))
      const s = clamp(round(c.s * 100, 1), 0, 100)
      const v = clamp(round(c.v * 100, 1), 0, 100)
      return `hsv(${h}, ${s}%, ${v}%)`
    }
    case 'cmyk': {
      const cmyk = colorToCmyk(parsed)
      return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
    }
    case 'lab': {
      const c = toLab(parsed)
      return `lab(${round(c.l, 2)} ${round(c.a, 2)} ${round(c.b, 2)}${c.alpha !== undefined ? ` / ${clamp(round(c.alpha, 2), 0, 1)}` : ''})`
    }
    case 'lch': {
      const c = toLch(parsed)
      return `lch(${round(c.l, 2)} ${round(c.c, 2)} ${normalizeAngle(round(c.h ?? 0, 2))}${c.alpha !== undefined ? ` / ${clamp(round(c.alpha, 2), 0, 1)}` : ''})`
    }
    default:
      return formatHex(parsed)
  }
}

export function expandHexShorthand(hex: string): string {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    return '#' + clean.split('').map(c => c + c).join('')
  }
  if (clean.length === 4) {
    return '#' + clean.split('').map(c => c + c).join('')
  }
  return hex.startsWith('#') ? hex : '#' + hex
}

export function getAllFormats(hex: string): Record<ColorFormat, string> {
  const result = {} as Record<ColorFormat, string>
  for (const format of COLOR_FORMATS) {
    result[format] = formatColor(hex, format)
  }
  return result
}
