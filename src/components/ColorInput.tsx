import { useCallback, useEffect, useMemo } from 'react'
import { useColorStore } from '@/store/colorStore'
import { useHistoryStore } from '@/store/historyStore'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { parseColor, COLOR_FORMATS } from '@/lib/color'
import type { ColorFormat } from '@/types/color'
import { cn } from '@/lib/utils'

export function ColorInput() {
  const {
    inputFormat,
    inputValue,
    parseError,
    setInputFormat,
    setInputValue,
    setFromInput,
    setCurrentHex,
  } = useColorStore()
  const { addColor } = useHistoryStore()

  const debouncedValue = useDebounce(inputValue, 500)

  useEffect(() => {
    if (debouncedValue.trim()) {
      const result = parseColor(debouncedValue)
      if (result.ok) {
        setCurrentHex(result.color.hex)
      }
    }
  }, [debouncedValue, setCurrentHex])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [setInputValue])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFromInput(inputValue)
      const result = parseColor(inputValue)
      if (result.ok) {
        addColor(result.color.hex)
      }
    }
  }, [inputValue, setFromInput, addColor])

  const tabs = useMemo(() => COLOR_FORMATS, [])

  const placeholderMap: Record<ColorFormat, string> = {
    hex: '#ff0000 或 #f00',
    rgb: 'rgb(255, 0, 0) 或 255,0,0',
    hsl: 'hsl(0, 100%, 50%)',
    hsv: 'hsv(0, 100%, 100%)',
    cmyk: 'cmyk(0%, 100%, 100%, 0%)',
    lab: 'lab(53.24 80.09 67.20)',
    lch: 'lch(53.24 104.55 40.00)',
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tabs.map(format => (
          <button
            key={format}
            onClick={() => setInputFormat(format)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              inputFormat === format
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {format.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderMap[inputFormat]}
          className={cn(
            'font-mono text-base',
            parseError && 'border-destructive focus-visible:ring-destructive',
          )}
        />
        <Button
          onClick={() => {
            setFromInput(inputValue)
            const result = parseColor(inputValue)
            if (result.ok) {
              addColor(result.color.hex)
            }
          }}
        >
          转换
        </Button>
      </div>

      {parseError && (
        <p className="text-sm text-destructive">{parseError}</p>
      )}

      <p className="text-xs text-muted-foreground">
        提示：支持 HEX 简写 (#f00)、RGB 字符串、纯数字 (255,0,0) 等多种格式
      </p>
    </div>
  )
}
