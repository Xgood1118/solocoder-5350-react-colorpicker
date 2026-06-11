import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { ColorPreview } from '@/components/ColorPreview'
import { ColorInput } from '@/components/ColorInput'
import { FormatDisplay } from '@/components/FormatDisplay'
import { ColorBlindSim } from '@/components/ColorBlindSim'
import { ColorHistory } from '@/components/ColorHistory'
import { NamedColorPicker } from '@/components/NamedColorPicker'

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>颜色预览</CardTitle>
            <CardDescription>
              当前选择的颜色及其各种表示格式
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ColorPreview />
            <ColorInput />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>转换结果</CardTitle>
            <CardDescription>
              点击任意卡片即可复制对应格式的颜色值
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormatDisplay />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>辅助功能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ColorBlindSim />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>历史记录</CardTitle>
          </CardHeader>
          <CardContent>
            <ColorHistory />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSS 命名颜色</CardTitle>
          </CardHeader>
          <CardContent>
            <NamedColorPicker />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
