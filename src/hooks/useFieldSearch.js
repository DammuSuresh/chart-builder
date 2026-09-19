import { useMemo } from 'react'
import { ATTRIBUTE_GROUP_ORDER, MEASURE_GROUP_ORDER } from '../data/fields'

function buildSections(fields, query, type, groupOrder, sectionLabel) {
  const q = query.trim().toLowerCase()
  const isFiltering = q.length > 0

  const groups = groupOrder
    .map((groupName) => {
      const allInGroup = fields.filter((f) => f.type === type && f.group === groupName)
      const matched = isFiltering
        ? allInGroup.filter((f) => f.label.toLowerCase().includes(q))
        : allInGroup
      return {
        name: groupName,
        total: allInGroup.length,
        matched: matched.length,
        fields: matched,
      }
    })
    // While filtering, a group with nothing left to show just isn't rendered —
    // this is the live *consequence* of typing, never a default hidden state.
    .filter((g) => !isFiltering || g.matched > 0)

  const totalMatched = groups.reduce((sum, g) => sum + g.matched, 0)

  return { type, label: sectionLabel, groups, totalMatched }
}

// Genuinely filters the real 28-field dataset (no hardcoded subset). Empty
// query returns everything, untouched — search only ever narrows on request.
export function useFieldSearch(fields, query) {
  return useMemo(() => {
    const isFiltering = query.trim().length > 0
    const sections = [
      buildSections(fields, query, 'measure', MEASURE_GROUP_ORDER, 'Measures'),
      buildSections(fields, query, 'attribute', ATTRIBUTE_GROUP_ORDER, 'Dimensions'),
    ]
    const totalMatched = sections.reduce((sum, s) => sum + s.totalMatched, 0)
    return { sections, totalMatched, totalFields: fields.length, isFiltering }
  }, [fields, query])
}
