import { useColorStore } from '@/store/colorStore'
import { useHistoryStore } from '@/store/historyStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function ColorHistory() {
  const { entries, clearHistory, removeColor } = useHistoryStore()
  const { setCurrentHex, setInputFormat, setInputValue } = useColorStore()

  const handleSelect = (hex: string) => {
    setCurrentHex(hex)
    setInputFormat('hex')
    setInputValue(hex)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">历史记录 ({entries.length})</h3>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory}>
            清空
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无历史记录，选一个颜色试试吧</p>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {entries.map(entry => (
            <div key={`${entry.hex}-${entry.timestamp}`} className="group relative">
              <button
                onClick={() => handleSelect(entry.hex)}
                className={cn(
                  'w-full aspect-square rounded-lg border shadow-sm transition-all hover:scale-110 hover:shadow-md',
                )}
                style={{ backgroundColor: entry.hex }}
                title={entry.hex.toUpperCase()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeColor(entry.hex)
                }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
