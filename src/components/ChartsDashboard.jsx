// react-grid-layout v2 rewrote its API around hooks/composable config objects;
// the /legacy subpath keeps the well-known v1 API (WidthProvider, layouts,
// draggableHandle, compactType) which is what this component is built against.
import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
import { useDispatch, useSelector } from 'react-redux'
import {
  chartAdded,
  colsChanged,
  layoutChanged,
  selectCharts,
  selectLayout,
} from '../store/chartsSlice'
import ChartCard from './ChartCard'
import EditingBar from './EditingBar'

const ResponsiveGridLayout = WidthProvider(Responsive)

const BREAKPOINTS = { lg: 900, md: 600, sm: 480, xs: 0 }
const COLS = { lg: 12, md: 8, sm: 4, xs: 2 }

export default function ChartsDashboard() {
  const dispatch = useDispatch()
  const charts = useSelector(selectCharts)
  const layout = useSelector(selectLayout)

  return (
    <div className="canvas">
      <EditingBar />

      <div className="dashboard-toolbar">
        <button type="button" className="add-chart-button" onClick={() => dispatch(chartAdded())}>
          + Add chart
        </button>
      </div>

      {charts.length === 0 ? (
        <div className="dashboard-empty">
          <p>No charts yet.</p>
          <button type="button" className="add-chart-button" onClick={() => dispatch(chartAdded())}>
            + Add chart
          </button>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout, md: layout, sm: layout, xs: layout }}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={30}
          margin={[16, 16]}
          compactType="vertical"
          preventCollision={false}
          draggableHandle=".chart-card-handle"
          onLayoutChange={(currentLayout) => dispatch(layoutChanged(currentLayout))}
          onWidthChange={(width, margin, newCols) => dispatch(colsChanged(newCols))}
        >
          {charts.map((chart) => (
            <div key={chart.id}>
              <ChartCard chart={chart} />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  )
}
