import { CATEGORICAL_COLORS, CHART_CHROME } from './palette'
import { aggregateLabel, formatMeasureValue } from './formatMeasure'

function aggregateValues(values, agg) {
  const total = values.reduce((a, b) => a + b, 0)
  return agg === 'sum' ? total : total / values.length
}

function aggregateMeasure(rows, field) {
  return aggregateValues(
    rows.map((r) => r[field.id]),
    field.agg,
  )
}

// Groups rows by one or two attribute fields and aggregates one measure per
// group — the SAME numbers drive the chart, its direct value labels, and the
// "Show the numbers" table underneath, so they can never disagree with
// each other. Returns plain objects keyed by attribute id, plus `__value`
// (the raw aggregate), `__label` (its formatted string) and `__count`
// (how many synthetic rows fed that bar) for the table's "Records" column.
function aggregateGroups(rows, attrFields, measureField) {
  const groups = new Map()
  for (const row of rows) {
    const key = attrFields.map((f) => row[f.id]).join('|||')
    if (!groups.has(key)) {
      groups.set(key, { keys: attrFields.map((f) => row[f.id]), values: [] })
    }
    groups.get(key).values.push(row[measureField.id])
  }
  return [...groups.values()].map(({ keys, values }) => {
    const value = aggregateValues(values, measureField.agg)
    const entry = { __value: value, __label: formatMeasureValue(measureField, value), __count: values.length }
    attrFields.forEach((f, i) => {
      entry[f.id] = keys[i]
    })
    return entry
  })
}

const axisStyle = {
  labelColor: CHART_CHROME.mutedLabel,
  titleColor: CHART_CHROME.secondaryInk,
  domainColor: CHART_CHROME.baseline,
  tickColor: CHART_CHROME.baseline,
  gridColor: CHART_CHROME.gridline,
}

const lower = (label) => label.toLowerCase()

function buildNarrative({ primaryMeasure, primaryAttr, colorAttr, isLine }) {
  const aggWord = aggregateLabel(primaryMeasure)
  const title = colorAttr
    ? `${primaryMeasure.label} by ${primaryAttr.label} and ${colorAttr.label}`
    : `${primaryMeasure.label} by ${primaryAttr.label}`
  const hoverHint = isLine ? 'Hover a point for exact values.' : 'Hover a bar for exact values.'
  const subtitle = colorAttr
    ? `${aggWord} per ${lower(primaryAttr.label)}, split by ${lower(colorAttr.label)}. ${hoverHint}`
    : `${aggWord} per ${lower(primaryAttr.label)}. ${hoverHint}`
  return { title, subtitle }
}

// Pure function: what should the chart preview show for this selection?
// Never receives a hardcoded subset — `selectedFields` is whatever the user
// picked from the real 28-field list, in the order they picked it.
export function buildChartSpec(selectedFields, rows) {
  const attributes = selectedFields.filter((f) => f.type === 'attribute')
  const measures = selectedFields.filter((f) => f.type === 'measure')
  const sampleNote = `Sample data for illustration (${rows.length} synthetic rows) — a live version would calculate this from your connected data.`

  if (measures.length === 0) {
    return {
      kind: 'empty',
      message:
        attributes.length === 0
          ? 'Select fields on the left to build a chart.'
          : 'Select at least one measure to see a preview.',
    }
  }

  if (attributes.length === 0) {
    const [primary, ...rest] = measures
    return {
      kind: 'stat-tiles',
      title: primary.label,
      subtitle: `${aggregateLabel(primary)} across all records`,
      value: aggregateMeasure(rows, primary),
      field: primary,
      hint: 'Add an attribute field on the left to see how this breaks down.',
      extraTiles: rest.map((field) => ({ field, value: aggregateMeasure(rows, field) })),
      sampleNote,
    }
  }

  const [primaryAttr, colorAttr, ...restAttrs] = attributes
  const [primaryMeasure, ...restMeasures] = measures
  // A lone time-like attribute reads as a trend -> line. Once a second
  // attribute groups it too, it's a category comparison across cohorts
  // (e.g. "Gross Margin by Signup Cohort and Support Tier") -> bars read
  // better than several overlapping lines, matching how that case renders
  // in the reference design.
  const isLine = Boolean(primaryAttr.timeLike) && !colorAttr
  const groupFields = colorAttr ? [primaryAttr, colorAttr] : [primaryAttr]
  const groups = aggregateGroups(rows, groupFields, primaryMeasure)

  const categoryEncoding = {
    field: primaryAttr.id,
    type: isLine ? 'ordinal' : 'nominal',
    title: primaryAttr.label,
    sort: isLine ? 'ascending' : { op: 'sum', field: '__value', order: 'descending' },
  }
  const valueTitle = `${aggregateLabel(primaryMeasure)} ${primaryMeasure.label}`
  const tooltip = [
    { field: primaryAttr.id, type: isLine ? 'ordinal' : 'nominal', title: primaryAttr.label },
    ...(colorAttr ? [{ field: colorAttr.id, type: 'nominal', title: colorAttr.label }] : []),
    { field: '__label', type: 'nominal', title: primaryMeasure.label },
  ]

  const colorEncoding = colorAttr
    ? { field: colorAttr.id, type: 'nominal', title: colorAttr.label, scale: { range: CATEGORICAL_COLORS } }
    : { value: CATEGORICAL_COLORS[0] }

  let spec
  if (isLine) {
    spec = {
      encoding: {
        x: { ...categoryEncoding, axis: { ...axisStyle, labelAngle: -30 } },
        y: { field: '__value', type: 'quantitative', title: valueTitle, axis: axisStyle },
        color: colorEncoding,
        tooltip,
      },
      mark: { type: 'line', strokeWidth: 2, point: { size: 60, filled: true }, tooltip: true },
    }
  } else {
    // Horizontal bars with a direct value label at the end of each bar —
    // reading exact numbers shouldn't require hovering.
    spec = {
      encoding: {
        y: { ...categoryEncoding, axis: axisStyle },
        ...(colorAttr ? { yOffset: { field: colorAttr.id } } : {}),
        color: colorEncoding,
      },
      layer: [
        {
          mark: { type: 'bar', cornerRadiusTopRight: 4, cornerRadiusBottomRight: 4, tooltip: true },
          encoding: { x: { field: '__value', type: 'quantitative', title: valueTitle, axis: axisStyle }, tooltip },
        },
        {
          mark: { type: 'text', align: 'left', dx: 5, color: CHART_CHROME.secondaryInk },
          encoding: {
            x: { field: '__value', type: 'quantitative' },
            text: { field: '__label', type: 'nominal' },
          },
        },
      ],
    }
  }

  const fullSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    width: 'container',
    height: 'container',
    autosize: { type: 'fit', contains: 'padding' },
    padding: { left: 4, right: 40, top: 4, bottom: 4 },
    background: CHART_CHROME.surface,
    data: { values: groups },
    config: {
      font: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      view: { stroke: 'transparent' },
      legend: { labelColor: CHART_CHROME.secondaryInk, titleColor: CHART_CHROME.secondaryInk },
    },
    ...spec,
  }

  const droppedAttrs = restAttrs.length > 0 ? restAttrs.map((f) => f.label) : []
  const { title, subtitle } = buildNarrative({ primaryMeasure, primaryAttr, colorAttr, isLine })

  return {
    kind: 'chart',
    spec: fullSpec,
    title,
    subtitle,
    table: {
      columns: [...groupFields.map((f) => f.label), primaryMeasure.label, 'Records'],
      rows: groups.map((g) => [
        ...groupFields.map((f) => String(g[f.id])),
        g.__label,
        g.__count.toLocaleString(),
      ]),
    },
    extraTiles: restMeasures.map((field) => ({ field, value: aggregateMeasure(rows, field) })),
    droppedAttrs,
    sampleNote,
  }
}
