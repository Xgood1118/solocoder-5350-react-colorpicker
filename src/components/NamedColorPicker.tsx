import { useMemo, useState } from 'react'
import { useColorStore } from '@/store/colorStore'
import { useHistoryStore } from '@/store/historyStore'
import { NAMED_COLORS } from '@/lib/namedColors'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

export function NamedColorPicker() {
  const { setCurrentHex, setInputFormat, setInputValue } = useColorStore()
  const { addColor } = useHistoryStore()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return NAMED_COLORS
    const q = search.toLowerCase()
    return NAMED_COLORS.filter(c => c.name.toLowerCase().includes(q))
  }, [search])

  const handleSelect = (hex: string) => {
    setCurrentHex(hex)
    setInputFormat('hex')
    setInputValue(hex)
    addColor(hex)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">CSS 命名颜色</h3>
      <Input
        type="text"
        placeholder="搜索颜色名称..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="text-sm"
      />
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto scrollbar-thin p-1">
        {filtered.map(color => (
          <button
            key={color.name}
            onClick={() => handleSelect(color.hex)}
            className={cn(
              'group relative flex flex-col items-center p-1 rounded hover:bg-accent transition-colors',
            )}
            title={`${color.name} ${color.hex}`}
          >
            <div
              className="w-full aspect-square rounded border shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-[10px] truncate w-full text-center mt-1 text-muted-foreground group-hover:text-foreground transition-colors">
              {color.name}
            </span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">未找到匹配的颜色</p>
      )}
    </div>
  )
}
