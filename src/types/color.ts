export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv' | 'cmyk' | 'lab' | 'lch'

export interface RGB {
  r: number
  g: number
  b: number
  a?: number
}

export interface HSL {
  h: number
  s: number
  l: number
  a?: number
}

export interface HSV {
  h: number
  s: number
  v: number
  a?: number
}

export interface CMYK {
  c: number
  m: number
  y: number
  k: number
  a?: number
}

export interface LAB {
  l: number
  a: number
  b: number
  alpha?: number
}

export interface LCH {
  l: number
  c: number
  h: number
  alpha?: number
}

export type ColorObject = RGB | HSL | HSV | CMYK | LAB | LCH

export interface ParsedColor {
  format: ColorFormat
  value: ColorObject
  hex: string
  hasAlpha: boolean
}

export interface ParseResultSuccess {
  ok: true
  color: ParsedColor
}

export interface ParseResultError {
  ok: false
  error: string
}

export type ParseResult = ParseResultSuccess | ParseResultError

export interface ColorBlindnessType {
  id: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  name: string
  description: string
}

export interface WCAGLevel {
  level: 'AA' | 'AAA'
  size: 'normal' | 'large'
  threshold: number
  label: string
}

export interface ContrastResult {
  ratio: number
  levels: WCAGLevelResult[]
}

export interface WCAGLevelResult {
  level: 'AA' | 'AAA'
  size: 'normal' | 'large'
  threshold: number
  pass: boolean
  label: string
}

export interface PaletteOptions {
  steps: number
  curve: 'linear' | 'even' | 'reverse'
  space: 'lch' | 'lab' | 'rgb' | 'hsl'
}

export type PaletteExportFormat = 'json' | 'css' | 'scss' | 'tailwind'

export interface HistoryEntry {
  hex: string
  timestamp: number
}

export interface Settings {
  defaultFormat: ColorFormat
  historyCapacity: number
  theme: 'light' | 'dark' | 'system'
}

export interface NamedColor {
  name: string
  hex: string
}

export type CurveType = 'linear' | 'even' | 'reverse'
