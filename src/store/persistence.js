import { get, set } from 'idb-keyval'

const STORAGE_KEY = 'bi-tool:charts-state'
const SAVE_DEBOUNCE_MS = 400

export async function loadPersistedChartsState() {
  try {
    return (await get(STORAGE_KEY)) ?? null
  } catch {
    // IndexedDB unavailable (e.g. private browsing) — fall back to in-memory only.
    return null
  }
}

let saveTimeoutId = null

export function schedulePersistChartsState(state) {
  clearTimeout(saveTimeoutId)
  saveTimeoutId = setTimeout(() => {
    set(STORAGE_KEY, state).catch(() => {})
  }, SAVE_DEBOUNCE_MS)
}
