import { useDispatch, useSelector } from 'react-redux'
import { FIELDS_BY_ID } from '../data/fields'
import {
  activeChartFieldsCleared,
  fieldRemovedFromActiveChart,
  selectActiveChart,
} from '../store/chartsSlice'

export default function EditingBar() {
  const dispatch = useDispatch()
  const activeChart = useSelector(selectActiveChart)

  if (!activeChart) {
    return (
      <div className="editing-bar editing-bar-empty">
        Add a chart, then pick fields on the left to build it.
      </div>
    )
  }

  const fields = activeChart.fieldIds.map((id) => FIELDS_BY_ID[id])

  return (
    <div className="editing-bar">
      <span className="editing-bar-title">Editing: {activeChart.title}</span>
      <div className="editing-bar-chips">
        {fields.length === 0 ? (
          <span className="editing-bar-empty" style={{ padding: 0 }}>
            No fields yet — select some on the left.
          </span>
        ) : (
          fields.map((field) => (
            <span key={field.id} className={`chip chip-${field.type}`}>
              {field.label}
              <button
                type="button"
                aria-label={`Remove ${field.label}`}
                onClick={() => dispatch(fieldRemovedFromActiveChart(field.id))}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
      {fields.length > 0 && (
        <button
          type="button"
          className="link-button"
          onClick={() => dispatch(activeChartFieldsCleared())}
        >
          Clear all
        </button>
      )}
    </div>
  )
}
