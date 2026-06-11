import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { PaletteGenerator } from '@/components/PaletteGenerator'

export default function PalettePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>调色板生成</CardTitle>
        <CardDescription>
          基于基色生成均匀色阶，支持多种色彩空间插值和导出格式
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaletteGenerator />
      </CardContent>
    </Card>
  )
}
