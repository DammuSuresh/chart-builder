export function formatMeasureValue(field, value) {
  if (value == null || Number.isNaN(value)) return '—'
  switch (field.unit) {
    case 'currency':
      return `$${Math.round(value).toLocaleString()}`
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'days':
      return `${Math.round(value)} days`
    case 'score':
      return `${Math.round(value)}`
    case 'count':
    default:
      return Math.round(value).toLocaleString()
  }
}

export function aggregateLabel(field) {
  return field.agg === 'sum' ? 'Total' : 'Average'
}
