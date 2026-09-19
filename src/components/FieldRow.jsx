import { useRef, useState } from 'react'
import FieldTooltip from './FieldTooltip'

const TOOLTIP_WIDTH = 260
const TOOLTIP_EST_HEIGHT = 90
const VIEWPORT_MARGIN = 8

function computeTooltipPosition(rect) {
  let left = rect.left
  if (left + TOOLTIP_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
    left = rect.right - TOOLTIP_WIDTH // flip to right-aligned so it never crosses the viewport edge
  }
  left = Math.max(VIEWPORT_MARGIN, left)

  let top = rect.bottom + 6
  if (top + TOOLTIP_EST_HEIGHT > window.innerHeight - VIEWPORT_MARGIN) {
    top = rect.top - TOOLTIP_EST_HEIGHT - 6 // flip above the row when there's no room below
  }

  return { top, left }
}

function HighlightedLabel({ label, query }) {
  const trimmed = query.trim()
  if (!trimmed) return label
  const idx = label.toLowerCase().indexOf(trimmed.toLowerCase())
  if (idx === -1) return label
  const end = idx + trimmed.length
  return (
    <>
      {label.slice(0, idx)}
      <mark>{label.slice(idx, end)}</mark>
      {label.slice(end)}
    </>
  )
}

export default function FieldRow({ field, query, selected, onToggle }) {
  const [tooltipPosition, setTooltipPosition] = useState(null)
  const timeoutRef = useRef(null)
  const buttonRef = useRef(null)

  const scheduleShow = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (buttonRef.current) {
        setTooltipPosition(computeTooltipPosition(buttonRef.current.getBoundingClientRect()))
      }
    }, 300)
  }
  const hide = () => {
    clearTimeout(timeoutRef.current)
    setTooltipPosition(null)
  }

  return (
    <div className="field-row-wrapper" onMouseEnter={scheduleShow} onMouseLeave={hide}>
      <button
        ref={buttonRef}
        type="button"
        className={`field-row${selected ? ' is-selected' : ''}`}
        role="checkbox"
        aria-checked={selected}
        onClick={() => onToggle(field.id)}
        onFocus={scheduleShow}
        onBlur={hide}
      >
        <span className={`field-dot field-dot-${field.type}`} aria-hidden="true" />
        <span className="field-label">
          <HighlightedLabel label={field.label} query={query} />
        </span>
        {selected && (
          <span className="field-check" aria-hidden="true">
            ✓
          </span>
        )}
      </button>
      <FieldTooltip field={field} position={tooltipPosition} />
    </div>
  )
}
