import { useMemo, useState } from 'react'
import { useContrastStore } from '@/store/contrastStore'
import { getContrast } from '@/lib/wcag'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { parseColor } from '@/lib/color'
import { cn } from '@/lib/utils'

export function ContrastChecker() {
  const { foreground, background, setForeground, setBackground, swap } = useContrastStore()
  const [fgInput, setFgInput] = useState(foreground)
  const [bgInput, setBgInput] = useState(background)

  const contrast = useMemo(
    () => getContrast(foreground, background),
    [foreground, background],
  )

  const handleFgBlur = () => {
    const result = parseColor(fgInput)
    if (result.ok) setForeground(result.color.hex)
    else setFgInput(foreground)
  }

  const handleBgBlur = () => {
    const result = parseColor(bgInput)
    if (result.ok) setBackground(result.color.hex)
    else setBgInput(background)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">前景色（文字）</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={fgInput}
              onChange={e => setFgInput(e.target.value)}
              onBlur={handleFgBlur}
              className="font-mono"
              placeholder="#ffffff"
            />
            <label className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-input cursor-pointer overflow-hidden">
              <input
                type="color"
                value={foreground}
                onChange={e => {
                  setForeground(e.target.value)
                  setFgInput(e.target.value)
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: foreground }} />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">背景色</label>
            <Button variant="ghost" size="sm" onClick={swap}>
              ↕ 交换
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              value={bgInput}
              onChange={e => setBgInput(e.target.value)}
              onBlur={handleBgBlur}
              className="font-mono"
              placeholder="#000000"
            />
            <label className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-input cursor-pointer overflow-hidden">
              <input
                type="color"
                value={background}
                onChange={e => {
                  setBackground(e.target.value)
                  setBgInput(e.target.value)
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: background }} />
            </label>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-8 transition-colors"
        style={{ backgroundColor: background }}
      >
        <p
          className="text-2xl font-medium leading-relaxed"
          style={{ color: foreground }}
        >
          The quick brown fox jumps over the lazy dog
        </p>
        <p
          className="text-base mt-2 leading-relaxed"
          style={{ color: foreground }}
        >
          敏捷的棕色狐狸跳过懒狗。这是一段用来测试对比度的示例文字。
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold font-mono">{contrast.ratio.toFixed(2)}</span>
          <span className="text-muted-foreground">: 1 对比度</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {contrast.levels.map(level => (
            <Badge
              key={level.label}
              variant={level.pass ? 'success' : 'destructive'}
              className={cn('text-xs px-3 py-1')}
            >
              {level.label}: {level.pass ? '✓ 通过' : '✗ 未通过'} ({level.threshold}:1)
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
