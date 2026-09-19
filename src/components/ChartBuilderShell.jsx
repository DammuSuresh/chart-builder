import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { chartsHydrated } from '../store/chartsSlice'
import { loadPersistedChartsState } from '../store/persistence'
import FieldPickerPanel from './FieldPickerPanel'
import ChartsDashboard from './ChartsDashboard'

export default function ChartBuilderShell() {
  const dispatch = useDispatch()

  useEffect(() => {
    let cancelled = false
    loadPersistedChartsState().then((persisted) => {
      if (!cancelled && persisted) dispatch(chartsHydrated(persisted))
    })
    return () => {
      cancelled = true
    }
  }, [dispatch])

  return (
    <div className="shell">
      <header className="shell-header">
        <h1>Dashboard</h1>
        <p className="shell-subtitle">
          Pick fields on the left to build a chart. Add as many charts as you need.
        </p>
      </header>

      <div className="shell-body">
        <FieldPickerPanel />
        <ChartsDashboard />
      </div>
    </div>
  )
}
