import { Provider } from 'react-redux'
import { store } from './store/store'
import ChartBuilderShell from './components/ChartBuilderShell'

export default function App() {
  return (
    <Provider store={store}>
      <ChartBuilderShell />
    </Provider>
  )
}
