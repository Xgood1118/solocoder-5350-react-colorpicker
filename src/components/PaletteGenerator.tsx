import { useCallback, useMemo, useState } from 'react'
import { usePaletteStore } from '@/store/paletteStore'
import { generatePalette, getPaletteShadeNames } from '@/lib/palette'
import { exportPalette, paletteExportFilename } from '@/lib/export'
import { downloadFile, copyToClipboard } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { PaletteExportFormat, CurveType } from '@/types/color'
import { cn } from '@/lib/utils'
import { parseColor } from '@/lib/color'

export function PaletteGenerator() {
  const { baseColor, steps, curve, space, setBaseColor, setSteps, setCurve, setSpace } = usePaletteStore()
  const [baseInput, setBaseInput] = useState(baseColor)
  const [copied, setCopied] = useState<string | null>(null)

  const palette = useMemo(() => {
    const colors = generatePalette(baseColor, steps, curve, space)
    const names = getPaletteShadeNames(steps)
    return colors.map((hex, i) => ({ hex, name: names[i] || `${i + 1}` }))
  }, [baseColor, steps, curve, space])

  const handleBaseBlur = useCallback(() => {
    const result = parseColor(baseInput)
    if (result.ok) {
      setBaseColor(result.color.hex)
    } else {
      setBaseInput(baseColor)
    }
  }, [baseInput, baseColor, setBaseColor])

  const handleExport = useCallback((format: PaletteExportFormat) => {
    const content = exportPalette(palette, format, 'color')
    const filename = paletteExportFilename(format, 'palette')
    const mimeTypes: Record<PaletteExportFormat, string> = {
      json: 'application/json',
      css: 'text/css',
      scss: 'text/x-scss',
      tailwind: 'text/javascript',
    }
    downloadFile(content, filename, mimeTypes[format])
  }, [palette])

  const handleCopyExport = useCallback(async (format: PaletteExportFormat) => {
    const content = exportPalette(palette, format, 'color')
    const success = await copyToClipboard(content)
    if (success) {
      setCopied(format)
      setTimeout(() => setCopied(null), 1500)
    }
  }, [palette])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">基色</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={baseInput}
              onChange={e => setBaseInput(e.target.value)}
              onBlur={handleBaseBlur}
              className="font-mono"
              placeholder="#ff0000"
            />
            <label className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-input cursor-pointer overflow-hidden">
              <input
                type="color"
                value={baseColor}
                onChange={e => {
                  setBaseColor(e.target.value)
                  setBaseInput(e.target.value)
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: baseColor }} />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">色阶数量</label>
          <div className="flex gap-2">
            {[10, 20, 50].map(n => (
              <Button
                key={n}
                variant={steps === n ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSteps(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">曲线</label>
          <div className="flex gap-2">
            {(['linear', 'even', 'reverse'] as CurveType[]).map(c => (
              <Button
                key={c}
                variant={curve === c ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurve(c)}
              >
                {c === 'linear' ? '线性' : c === 'even' ? '均匀' : '反转'}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">色彩空间</label>
          <div className="flex gap-2 flex-wrap">
            {(['lch', 'lab', 'rgb', 'hsl'] as const).map(s => (
              <Button
                key={s}
                variant={space === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSpace(s)}
              >
                {s.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex rounded-lg overflow-hidden border shadow-sm">
          {palette.map(({ hex, name }) => (
            <div
              key={name}
              className="flex-1 group relative cursor-pointer transition-transform hover:scale-y-110 hover:origin-bottom"
              style={{ backgroundColor: hex }}
              title={`${name}: ${hex}`}
            >
              <div className="aspect-square w-full" />
              <div className="absolute inset-0 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity pb-2">
                <span className="text-[10px] font-mono font-bold px-1 rounded bg-black/50 text-white">
                  {name}
                </span>
                <span className="text-[9px] font-mono px-1 rounded bg-black/50 text-white mt-0.5">
                  {hex.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-10 gap-1">
          {palette.map(({ hex, name }) => (
            <div
              key={name}
              className="text-center p-2 rounded border hover:bg-accent transition-colors cursor-pointer"
              onClick={() => copyToClipboard(hex)}
            >
              <div
                className="w-full aspect-square rounded border"
                style={{ backgroundColor: hex }}
              />
              <p className="text-xs font-semibold mt-1">{name}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{hex.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">导出色板</h3>
        <div className="flex flex-wrap gap-2">
          {(['json', 'css', 'scss', 'tailwind'] as PaletteExportFormat[]).map(format => (
            <div key={format} className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => handleExport(format)}>
                下载 {format.toUpperCase()}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyExport(format)}
                className={cn(copied === format && 'text-green-500')}
              >
                {copied === format ? '已复制' : '复制'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
