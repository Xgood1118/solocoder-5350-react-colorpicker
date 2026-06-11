import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { ContrastChecker } from '@/components/ContrastChecker'

export default function ContrastPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>WCAG 对比度检查</CardTitle>
        <CardDescription>
          根据 WCAG 2.1 标准计算前景色与背景色的对比度，检查是否符合 AA/AAA 无障碍标准
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContrastChecker />
      </CardContent>
    </Card>
  )
}
