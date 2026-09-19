import { createPortal } from 'react-dom'

export default function FieldTooltip({ field, position }) {
  if (!position) return null

  return createPortal(
    <div className="field-tooltip" role="tooltip" style={{ top: position.top, left: position.left }}>
      <strong>{field.label}</strong>
      <p>{field.description}</p>
    </div>,
    document.body,
  )
}
