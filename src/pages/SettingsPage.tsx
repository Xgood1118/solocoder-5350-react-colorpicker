import { useSettingsStore } from '@/store/settingsStore'
import { useHistoryStore } from '@/store/historyStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { COLOR_FORMATS } from '@/lib/color'
import type { ColorFormat } from '@/types/color'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { defaultFormat, historyCapacity, theme, setDefaultFormat, setHistoryCapacity, setTheme } = useSettingsStore()
  const { setMaxCapacity } = useHistoryStore()

  const handleCapacityChange = (capacity: number) => {
    setHistoryCapacity(capacity)
    setMaxCapacity(capacity)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>外观</CardTitle>
          <CardDescription>
            配置应用的主题模式
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">主题</label>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map(t => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  onClick={() => setTheme(t)}
                >
                  {t === 'light' ? '☀️ 浅色' : t === 'dark' ? '🌙 深色' : '💻 跟随系统'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>颜色设置</CardTitle>
          <CardDescription>
            自定义颜色工具的默认行为
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium block mb-2">默认颜色格式</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_FORMATS.map(format => (
                <button
                  key={format}
                  onClick={() => setDefaultFormat(format as ColorFormat)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    defaultFormat === format
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              历史记录容量：{historyCapacity} 个
            </label>
            <div className="flex gap-2">
              {[10, 25, 50, 100].map(capacity => (
                <Button
                  key={capacity}
                  variant={historyCapacity === capacity ? 'default' : 'outline'}
                  onClick={() => handleCapacityChange(capacity)}
                >
                  {capacity}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>关于</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>ColorKit 是一个纯前端的在线颜色工具集。</p>
          <p>核心依赖：React 18 + Vite + TypeScript + Tailwind CSS + Radix UI + culori + zustand</p>
          <p>所有颜色计算均在浏览器本地完成，数据不会上传到任何服务器。</p>
        </CardContent>
      </Card>
    </div>
  )
}
