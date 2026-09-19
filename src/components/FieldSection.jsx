import { useState } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import FieldGroup from './FieldGroup'

// Each section (Attributes / Measures) is its own accordion: only the first
// group starts open, the rest start collapsed. While searching, every group
// still on screen is forced open — a match can never be hidden behind a
// collapsed accordion just because it isn't in the first group.
export default function FieldSection({ section, query, isFiltering, selectedIdSet, onToggleField }) {
  const firstGroupName = section.groups[0]?.name
  const [openGroups, setOpenGroups] = useState(firstGroupName ? [firstGroupName] : [])
  const openValue = isFiltering ? section.groups.map((g) => g.name) : openGroups

  return (
    <section className="field-section">
      <h2 className="field-section-title">{section.label}</h2>
      <Accordion.Root
        type="multiple"
        className="field-accordion"
        value={openValue}
        onValueChange={setOpenGroups}
      >
        {section.groups.map((group) => (
          <Accordion.Item key={group.name} value={group.name} className="field-accordion-item">
            <Accordion.Header className="field-accordion-header">
              <Accordion.Trigger className="field-group-trigger">
                <span className="field-group-chevron" aria-hidden="true" />
                {group.name}
                <span className="field-group-count">
                  {query ? `${group.matched} of ${group.total}` : group.total}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="field-accordion-content">
              <FieldGroup group={group} query={query} selectedIdSet={selectedIdSet} onToggleField={onToggleField} />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}
