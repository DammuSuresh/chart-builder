import { formatMeasureValue, aggregateLabel } from '../lib/formatMeasure'

export default function StatTile({ field, value, compact, hero }) {
  if (hero) {
    return <div className="stat-tile-hero">{formatMeasureValue(field, value)}</div>
  }

  return (
    <div className={`stat-tile${compact ? ' stat-tile-compact' : ''}`}>
      <div className="stat-tile-label">
        {aggregateLabel(field)} {field.label}
      </div>
      <div className="stat-tile-value">{formatMeasureValue(field, value)}</div>
    </div>
  )
}
