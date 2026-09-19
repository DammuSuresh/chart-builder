export default function FieldSearchBar({ value, onChange }) {
  return (
    <div className="field-search">
      <label htmlFor="field-search-input" className="sr-only">
        Search fields (optional — everything below is already visible)
      </label>
      <input
        id="field-search-input"
        type="text"
        placeholder="Jump to a field… (optional)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="field-search-clear"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          ×
        </button>
      )}
    </div>
  )
}
