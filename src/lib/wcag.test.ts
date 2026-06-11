import { describe, it, expect } from 'vitest'
import { getContrast } from './wcag'

describe('getContrast', () => {
  it('黑底白字对比度约为 21:1', () => {
    const result = getContrast('#ffffff', '#000000')
    expect(result.ratio).toBeGreaterThanOrEqual(20.9)
    expect(result.ratio).toBeLessThanOrEqual(21.1)
  })

  it('同色对比度为 1:1', () => {
    const result = getContrast('#ff0000', '#ff0000')
    expect(result.ratio).toBeCloseTo(1, 1)
  })

  it('白底红字对比度约为 4:1', () => {
    const result = getContrast('#ff0000', '#ffffff')
    expect(result.ratio).toBeGreaterThan(3.5)
    expect(result.ratio).toBeLessThan(5)
  })

  it('返回正确的 WCAG 等级', () => {
    const result = getContrast('#ffffff', '#000000')
    expect(result.levels).toHaveLength(4)

    const aaLarge = result.levels.find(l => l.label === 'AA Large')
    expect(aaLarge?.pass).toBe(true)

    const aaNormal = result.levels.find(l => l.label === 'AA Normal')
    expect(aaNormal?.pass).toBe(true)

    const aaaLarge = result.levels.find(l => l.label === 'AAA Large')
    expect(aaaLarge?.pass).toBe(true)

    const aaaNormal = result.levels.find(l => l.label === 'AAA Normal')
    expect(aaaNormal?.pass).toBe(true)
  })

  it('低对比度未通过 AA Normal', () => {
    const result = getContrast('#666666', '#000000')
    const aaNormal = result.levels.find(l => l.label === 'AA Normal')
    expect(aaNormal?.pass).toBe(false)
  })
})
