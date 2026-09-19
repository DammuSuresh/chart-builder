import { createSlice, createSelector, nanoid } from '@reduxjs/toolkit'
import { FIELDS_BY_ID } from '../data/fields'

const DEFAULT_CARD_W = 4
const DEFAULT_CARD_H = 9
const FALLBACK_COLS = 12 // used only before the dashboard has reported a real measured width

function makeChart(number) {
  return { id: nanoid(), title: `Chart ${number}`, fieldIds: [] }
}

// `cols` is the ACTUAL column count of whichever react-grid-layout breakpoint
// is currently active (reported via onWidthChange -> colsChanged). Using a
// hardcoded column count here was the bug: the dashboard canvas is capped by
// `.shell`'s max-width minus the field panel, so it almost never reaches the
// 12-column 'lg' breakpoint in practice — it's usually 'md' (8 cols). An x
// computed assuming 12 columns lands out of bounds at 8, and react-grid-layout
// clamps out-of-range items to the rightmost valid column instead of wrapping
// to a new row, which is what produced "new charts always go on the right".
function makeLayoutSlot(id, index, cols) {
  const cardWidth = Math.min(DEFAULT_CARD_W, cols)
  const slotsPerRow = Math.max(1, Math.floor(cols / cardWidth))
  return {
    i: id,
    x: (index % slotsPerRow) * cardWidth,
    y: Infinity, // tells react-grid-layout to place it after the last row
    w: cardWidth,
    h: DEFAULT_CARD_H,
  }
}

const initialState = {
  charts: [],
  activeChartId: null,
  layout: [],
  nextChartNumber: 1,
  cols: FALLBACK_COLS,
}

function addChart(state) {
  const chart = makeChart(state.nextChartNumber)
  state.charts.push(chart)
  state.layout.push(makeLayoutSlot(chart.id, state.charts.length - 1, state.cols))
  state.activeChartId = chart.id
  state.nextChartNumber += 1
  return chart
}

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    chartAdded: (state) => {
      addChart(state)
    },
    chartRemoved: (state, action) => {
      const id = action.payload
      state.charts = state.charts.filter((c) => c.id !== id)
      state.layout = state.layout.filter((l) => l.i !== id)
      if (state.activeChartId === id) {
        state.activeChartId = state.charts.length > 0 ? state.charts[0].id : null
      }
    },
    activeChartChanged: (state, action) => {
      state.activeChartId = action.payload
    },
    fieldToggled: (state, action) => {
      const fieldId = action.payload
      let chart = state.charts.find((c) => c.id === state.activeChartId)
      if (!chart) {
        chart = addChart(state)
      }
      const idx = chart.fieldIds.indexOf(fieldId)
      if (idx === -1) {
        chart.fieldIds.push(fieldId)
      } else {
        chart.fieldIds.splice(idx, 1)
      }
    },
    fieldRemovedFromActiveChart: (state, action) => {
      const chart = state.charts.find((c) => c.id === state.activeChartId)
      if (!chart) return
      chart.fieldIds = chart.fieldIds.filter((id) => id !== action.payload)
    },
    activeChartFieldsCleared: (state) => {
      const chart = state.charts.find((c) => c.id === state.activeChartId)
      if (!chart) return
      chart.fieldIds = []
    },
    layoutChanged: (state, action) => {
      state.layout = action.payload
    },
    colsChanged: (state, action) => {
      state.cols = action.payload
    },
    chartsHydrated: (state, action) => {
      const persisted = action.payload
      if (!persisted) return
      // `cols` is deliberately NOT restored — it must always come from the
      // dashboard's live measured width (see makeLayoutSlot above), or a
      // layout saved on a wide screen would misplace cards on a narrower one.
      state.charts = (persisted.charts ?? []).map((chart) => ({
        ...chart,
        fieldIds: chart.fieldIds.filter((id) => FIELDS_BY_ID[id]),
      }))
      const validIds = new Set(state.charts.map((c) => c.id))
      state.layout = (persisted.layout ?? []).filter((slot) => validIds.has(slot.i))
      state.activeChartId = validIds.has(persisted.activeChartId) ? persisted.activeChartId : null
      state.nextChartNumber = persisted.nextChartNumber ?? state.nextChartNumber
    },
  },
})

export const {
  chartAdded,
  chartRemoved,
  activeChartChanged,
  fieldToggled,
  fieldRemovedFromActiveChart,
  activeChartFieldsCleared,
  layoutChanged,
  colsChanged,
  chartsHydrated,
} = chartsSlice.actions

export default chartsSlice.reducer

export const selectCharts = (state) => state.charts.charts
export const selectLayout = (state) => state.charts.layout
export const selectActiveChartId = (state) => state.charts.activeChartId

export const selectActiveChart = createSelector(
  [selectCharts, selectActiveChartId],
  (charts, activeChartId) => charts.find((c) => c.id === activeChartId) ?? null,
)

export const selectActiveFieldIdSet = createSelector([selectActiveChart], (chart) =>
  chart ? new Set(chart.fieldIds) : new Set(),
)
