import { useDispatch, useSelector } from 'react-redux'
import { FIELDS_BY_ID } from '../data/fields'
import { activeChartChanged, chartRemoved, selectActiveChartId } from '../store/chartsSlice'
import ChartPreview from './ChartPreview'

export default function ChartCard({ chart }) {
  const dispatch = useDispatch()
  const activeChartId = useSelector(selectActiveChartId)
  const isActive = chart.id === activeChartId
  const selectedFields = chart.fieldIds.map((id) => FIELDS_BY_ID[id])

  return (
    <div className={`chart-card${isActive ? ' is-active' : ''}`}>
      <div className="chart-card-header">
        <span className="chart-card-handle">{chart.title}</span>
        <div className="chart-card-actions">
          <button
            type="button"
            className="chart-card-icon-button"
            aria-label={`Edit ${chart.title}`}
            title="Edit fields"
            onClick={() => dispatch(activeChartChanged(chart.id))}
          >
            ✎
          </button>
          <button
            type="button"
            className="chart-card-icon-button"
            aria-label={`Delete ${chart.title}`}
            title="Delete chart"
            onClick={() => dispatch(chartRemoved(chart.id))}
          >
            🗑
          </button>
        </div>
      </div>
      <div className="chart-card-body">
        <ChartPreview selectedFields={selectedFields} />
      </div>
    </div>
  )
}
