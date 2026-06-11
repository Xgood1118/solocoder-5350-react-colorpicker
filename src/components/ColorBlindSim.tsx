import { useMemo } from 'react'
import { useColorStore } from '@/store/colorStore'
import { simulateColorBlindness, type ColorBlindness } from '@/lib/colorblind'
import { COLOR_BLINDNESS_TYPES } from '@/lib/color'
import { cn } from '@/lib/utils'

export function ColorBlindSim() {
  const { currentHex } = useColorStore()

  const simulations = useMemo(() => {
    return COLOR_BLINDNESS_TYPES.map(type => ({
      ...type,
      hex: simulateColorBlindness(currentHex, type.id as ColorBlindness),
    }))
  }, [currentHex])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">色盲模拟</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {simulations.map(sim => (
          <div key={sim.id} className="space-y-1">
            <div
              className={cn(
                'w-full aspect-square rounded-lg border shadow-sm transition-transform hover:scale-105',
              )}
              style={{ backgroundColor: sim.hex }}
              title={sim.description}
            />
            <div className="text-center">
              <p className="text-xs font-medium truncate">{sim.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{sim.hex.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
