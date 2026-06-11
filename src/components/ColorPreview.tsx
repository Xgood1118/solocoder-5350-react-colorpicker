import { useColorStore } from '@/store/colorStore'
import { useHistoryStore } from '@/store/historyStore'
import { Button } from '@/components/ui/Button'
import { useEyeDropper } from '@/hooks/useEyeDropper'
import { copyToClipboard, downloadCanvasAsPNG } from '@/lib/utils'
import { useCallback, useRef, useState } from 'react'

export function ColorPreview() {
  const { currentHex, setCurrentHex, setInputValue, setInputFormat } = useColorStore()
  const { addColor } = useHistoryStore()
  const { isSupported, pick, isPicking } = useEyeDropper()
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleEyeDropper = useCallback(async () => {
    const color = await pick()
    if (color) {
      setCurrentHex(color)
      setInputFormat('hex')
      setInputValue(color)
      addColor(color)
    }
  }, [pick, setCurrentHex, setInputFormat, setInputValue, addColor])

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(currentHex)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [currentHex])

  const handleSavePNG = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 200
    canvas.height = 200
    ctx.fillStyle = currentHex
    ctx.fillRect(0, 0, 200, 200)
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(currentHex, 100, 110)
    downloadCanvasAsPNG(canvas, `color-${currentHex.slice(1)}.png`)
  }, [currentHex])

  const handleSelect = useCallback(() => {
    addColor(currentHex)
  }, [currentHex, addColor])

  return (
    <div className="space-y-4">
      <div
        className="w-full h-48 md:h-64 rounded-xl shadow-inner border transition-all duration-300 relative overflow-hidden"
        style={{ backgroundColor: currentHex }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl md:text-6xl font-mono font-bold px-6 py-3 rounded-lg bg-white/20 backdrop-blur-sm"
            style={{
              color: parseInt(currentHex.slice(1, 3), 16) * 0.299 +
                parseInt(currentHex.slice(3, 5), 16) * 0.587 +
                parseInt(currentHex.slice(5, 7), 16) * 0.114 > 128
                ? '#000000'
                : '#ffffff',
            }}
          >
            {currentHex.toUpperCase()}
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleCopy} variant="outline" size="sm">
          {copied ? '已复制!' : '复制 HEX'}
        </Button>
        <Button onClick={handleSelect} variant="outline" size="sm">
          加入历史
        </Button>
        <Button onClick={handleSavePNG} variant="outline" size="sm">
          保存 PNG
        </Button>
        {isSupported && (
          <Button onClick={handleEyeDropper} variant="default" size="sm" disabled={isPicking}>
            {isPicking ? '取色中...' : '屏幕取色'}
          </Button>
        )}
        <label className="inline-flex items-center justify-center h-9 px-3 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer">
          从文件选色
          <input
            type="color"
            value={currentHex}
            onChange={e => {
              setCurrentHex(e.target.value)
              setInputFormat('hex')
              setInputValue(e.target.value)
              addColor(e.target.value)
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  )
}
