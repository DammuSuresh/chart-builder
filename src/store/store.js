import { configureStore } from '@reduxjs/toolkit'
import chartsReducer from './chartsSlice'
import { schedulePersistChartsState } from './persistence'

export const store = configureStore({
  reducer: {
    charts: chartsReducer,
  },
})

store.subscribe(() => {
  schedulePersistChartsState(store.getState().charts)
})
