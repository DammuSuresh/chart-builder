import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FIELDS } from '../data/fields'
import { useFieldSearch } from '../hooks/useFieldSearch'
import { fieldToggled, selectActiveFieldIdSet } from '../store/chartsSlice'
import FieldSearchBar from './FieldSearchBar'
import FieldSection from './FieldSection'

export default function FieldPickerPanel() {
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const selectedIdSet = useSelector(selectActiveFieldIdSet)
  const { sections, totalMatched, totalFields, isFiltering } = useFieldSearch(FIELDS, query)

  const onToggleField = (fieldId) => dispatch(fieldToggled(fieldId))

  return (
    <aside className="field-panel" aria-label="Field picker">
      <FieldSearchBar value={query} onChange={setQuery} />

      <div className="field-panel-status" role="status" aria-live="polite">
        {isFiltering ? `${totalMatched} of ${totalFields} fields match` : `${totalFields} fields`}
      </div>

      <div className="field-panel-scroll">
        {totalMatched === 0 && isFiltering ? (
          <div className="field-panel-empty">
            <p>No fields match &ldquo;{query}&rdquo;.</p>
            <button type="button" className="link-button" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
        ) : (
          sections
            .filter((section) => section.groups.length > 0)
            .map((section) => (
              <FieldSection
                key={section.type}
                section={section}
                query={query}
                isFiltering={isFiltering}
                selectedIdSet={selectedIdSet}
                onToggleField={onToggleField}
              />
            ))
        )}
      </div>
    </aside>
  )
}
