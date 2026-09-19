import FieldRow from './FieldRow'

export default function FieldGroup({ group, query, selectedIdSet, onToggleField }) {
  return (
    <div className="field-grid">
      {group.fields.map((field) => (
        <FieldRow
          key={field.id}
          field={field}
          query={query}
          selected={selectedIdSet.has(field.id)}
          onToggle={onToggleField}
        />
      ))}
    </div>
  )
}
