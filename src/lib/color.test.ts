import { describe, it, expect } from 'vitest'
import { parseColor, expandHexShorthand, formatColor, getAllFormats } from './color'

describe('expandHexShorthand', () => {
  it('展开 3 位 HEX 简写', () => {
    expect(expandHexShorthand('#f00')).toBe('#ff0000')
    expect(expandHexShorthand('#abc')).toBe('#aabbcc')
    expect(expandHexShorthand('f00')).toBe('#ff0000')
  })

  it('展开 4 位带 alpha 的 HEX 简写', () => {
    expect(expandHexShorthand('#f00f')).toBe('#ff0000ff')
    expect(expandHexShorthand('#abcd')).toBe('#aabbccdd')
  })

  it('保持 6 位和 8 位 HEX 不变', () => {
    expect(expandHexShorthand('#ff0000')).toBe('#ff0000')
    expect(expandHexShorthand('#ff000080')).toBe('#ff000080')
  })
})

describe('parseColor', () => {
  it('解析 null 和 undefined 返回错误', () => {
    expect(parseColor(null).ok).toBe(false)
    expect(parseColor(undefined).ok).toBe(false)
    expect(parseColor('').ok).toBe(false)
    expect(parseColor('   ').ok).toBe(false)
  })

  it('解析 HEX 格式', () => {
    const result = parseColor('#ff0000')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
      expect(result.color.format).toBe('hex')
    }
  })

  it('解析 3 位 HEX 简写', () => {
    const result = parseColor('#f00')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
    }
  })

  it('解析纯数字格式 "r,g,b"', () => {
    const result = parseColor('255,0,0')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
      expect(result.color.format).toBe('rgb')
    }
  })

  it('解析 RGB 字符串', () => {
    const result = parseColor('rgb(255, 0, 0)')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
    }
  })

  it('解析 HSL 字符串', () => {
    const result = parseColor('hsl(0, 100%, 50%)')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
    }
  })

  it('解析 HSV 字符串', () => {
    const result = parseColor('hsv(0, 100%, 100%)')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
      expect(result.color.format).toBe('hsv')
    }
  })

  it('解析 CMYK 字符串', () => {
    const result = parseColor('cmyk(0%, 100%, 100%, 0%)')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
      expect(result.color.format).toBe('cmyk')
    }
  })

  it('HSV 越界值处理', () => {
    const result = parseColor('hsv(720, 150%, 150%)')
    expect(result.ok).toBe(true)
    if (result.ok && result.color.format === 'hsv') {
      const hsv = result.color.value as { h: number; s: number; v: number }
      expect(hsv.h).toBe(0)
      expect(hsv.s).toBe(100)
      expect(hsv.v).toBe(100)
    }
  })

  it('CMYK 越界值处理', () => {
    const result = parseColor('cmyk(-50%, 150%, 100%, 100%)')
    expect(result.ok).toBe(true)
    if (result.ok && result.color.format === 'cmyk') {
      const cmyk = result.color.value as { c: number; m: number; y: number; k: number }
      expect(cmyk.c).toBe(0)
      expect(cmyk.m).toBe(100)
    }
  })

  it('RGB 越界值截断', () => {
    const result = parseColor('300, -10, 128')
    expect(result.ok).toBe(true)
    if (result.ok && result.color.format === 'rgb') {
      const rgb = result.color.value as { r: number; g: number; b: number }
      expect(rgb.r).toBe(255)
      expect(rgb.g).toBe(0)
      expect(rgb.b).toBe(128)
    }
  })

  it('剥离不可见 Unicode 字符', () => {
    const result = parseColor('#ff0000\u200B')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.color.hex.toLowerCase()).toBe('#ff0000')
    }
  })
})

describe('formatColor', () => {
  it('格式化各种颜色格式', () => {
    const hex = '#ff0000'
    expect(formatColor(hex, 'hex').toLowerCase()).toBe('#ff0000')
    expect(formatColor(hex, 'rgb')).toContain('255')
    expect(formatColor(hex, 'hsl')).toContain('hsl')
    expect(formatColor(hex, 'hsv')).toContain('hsv')
    expect(formatColor(hex, 'cmyk')).toContain('cmyk')
    expect(formatColor(hex, 'lab')).toContain('lab')
    expect(formatColor(hex, 'lch')).toContain('lch')
  })
})

describe('getAllFormats', () => {
  it('返回所有 7 种格式', () => {
    const formats = getAllFormats('#ff0000')
    expect(Object.keys(formats)).toHaveLength(7)
    expect(formats.hex).toBeTruthy()
    expect(formats.rgb).toBeTruthy()
    expect(formats.hsl).toBeTruthy()
  })
})
