// Validated categorical order from the dataviz reference palette (fixed hue
// order — never cycled/reordered per-chart). Mirrored as CSS custom properties
// in src/styles/index.css so the field-picker's type dots and the chart's
// series colors stay visually coherent.
export const CATEGORICAL_COLORS = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
]

export const CHART_CHROME = {
  surface: '#fcfcfb',
  gridline: '#e1e0d9',
  baseline: '#c3c2b7',
  mutedLabel: '#898781',
  secondaryInk: '#52514e',
}
