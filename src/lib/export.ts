import type { PaletteExportFormat } from '@/types/color'

export function exportPalette(
  palette: { name: string; hex: string }[],
  format: PaletteExportFormat,
  baseName: string = 'color',
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(
        palette.reduce((acc, c) => {
          acc[c.name] = c.hex
          return acc
        }, {} as Record<string, string>),
        null,
        2,
      )

    case 'css':
      return [
        ':root {',
        ...palette.map(c => `  --${baseName}-${c.name}: ${c.hex};`),
        '}',
      ].join('\n')

    case 'scss':
      return palette.map(c => `$${baseName}-${c.name}: ${c.hex};`).join('\n')

    case 'tailwind':
      return [
        `module.exports = {`,
        `  theme: {`,
        `    extend: {`,
        `      colors: {`,
        `        '${baseName}': {`,
        ...palette.map(c => `          '${c.name}': '${c.hex}',`),
        `        },`,
        `      },`,
        `    },`,
        `  },`,
        `};`,
      ].join('\n')

    default:
      return ''
  }
}

export function paletteExportFilename(format: PaletteExportFormat, baseName: string = 'palette'): string {
  switch (format) {
    case 'json':
      return `${baseName}.json`
    case 'css':
      return `${baseName}.css`
    case 'scss':
      return `_${baseName}.scss`
    case 'tailwind':
      return `${baseName}.tailwind.js`
    default:
      return `${baseName}.txt`
  }
}
