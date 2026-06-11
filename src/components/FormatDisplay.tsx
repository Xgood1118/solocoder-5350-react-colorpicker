import { useMemo, useState } from 'react'
import { useColorStore } from '@/store/colorStore'
import { COLOR_FORMATS, formatColor } from '@/lib/color'
import { copyToClipboard } from '@/lib/utils'
import type { ColorFormat } from '@/types/color'
import { cn } from '@/lib/utils'

export function FormatDisplay() {
  const { currentHex } = useColorStore()
  const [copiedFormat, setCopiedFormat] = useState<ColorFormat | null>(null)

  const formats = useMemo(() => {
    const result = {} as Record<ColorFormat, string>
    for (const format of COLOR_FORMATS) {
      result[format] = formatColor(currentHex, format)
    }
    return result
  }, [currentHex])

  const handleCopy = async (format: ColorFormat, value: string) => {
    const success = await copyToClipboard(value)
    if (success) {
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 1500)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {COLOR_FORMATS.map(format => (
        <div
          key={format}
          className="group relative rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => handleCopy(format, formats[format])}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {format}
            </span>
            <span
              className={cn(
                'text-xs',
                copiedFormat === format ? 'text-green-500' : 'text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity',
              )}
            >
              {copiedFormat === format ? '已复制' : '点击复制'}
            </span>
          </div>
          <code className="text-sm font-mono break-all">{formats[format]}</code>
        </div>
      ))}
    </div>
  )
}
