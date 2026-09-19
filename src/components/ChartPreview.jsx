import { VegaEmbed } from 'react-vega'
import { SAMPLE_ROWS } from '../data/sampleRows'
import { buildChartSpec } from '../lib/buildChartSpec'
import StatTile from './StatTile'
import DataTable from './DataTable'

function Footer({ note }) {
  return (
    <>
      <hr className="chart-preview-divider" />
      <p className="chart-preview-samplenote">{note}</p>
    </>
  )
}

export default function ChartPreview({ selectedFields }) {
  const result = buildChartSpec(selectedFields, SAMPLE_ROWS)

  if (result.kind === 'empty') {
    return (
      <div className="chart-preview chart-preview-empty">
        <p>{result.message}</p>
      </div>
    )
  }

  if (result.kind === 'stat-tiles') {
    return (
      <div className="chart-preview">
        <div className="chart-preview-header">
          <h3 className="chart-preview-title">{result.title}</h3>
          <p className="chart-preview-subtitle">{result.subtitle}</p>
        </div>
        <StatTile field={result.field} value={result.value} hero />
        <p className="chart-preview-hint">{result.hint}</p>
        {result.extraTiles.length > 0 && (
          <div className="stat-tiles stat-tiles-secondary">
            {result.extraTiles.map((tile) => (
              <StatTile key={tile.field.id} field={tile.field} value={tile.value} compact />
            ))}
          </div>
        )}
        <Footer note={result.sampleNote} />
      </div>
    )
  }

  return (
    <div className="chart-preview">
      <div className="chart-preview-header">
        <h3 className="chart-preview-title">{result.title}</h3>
        <p className="chart-preview-subtitle">{result.subtitle}</p>
      </div>
      <div className="chart-preview-canvas">
        <VegaEmbed spec={result.spec} options={{ actions: false }} />
      </div>
      {result.extraTiles.length > 0 && (
        <div className="stat-tiles stat-tiles-secondary">
          {result.extraTiles.map((tile) => (
            <StatTile key={tile.field.id} field={tile.field} value={tile.value} compact />
          ))}
        </div>
      )}
      {result.droppedAttrs.length > 0 && (
        <p className="chart-note">
          Also selected: {result.droppedAttrs.join(', ')} — not shown on this chart. Remove an
          attribute above to swap one of these into the chart instead.
        </p>
      )}
      <DataTable table={result.table} />
      <Footer note={result.sampleNote} />
    </div>
  )
}
