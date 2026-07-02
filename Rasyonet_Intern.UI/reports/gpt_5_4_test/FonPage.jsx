import {
  CalendarIcon,
  DownloadIcon,
  ExcelIcon,
  ReportHeader,
  ReportSubTabs,
  ReportTopTabs,
} from './ReportChrome'
import NavigationButton from '../../src/components/NavigationButton'

const comparisonTabs = ['Fon-Fon', 'Kurum (Büyüklük)', 'Fon-Diğer Yatırım Araçları']
const rangeTabs = ['1H', '1A', '3A', '1Y', '2Y', '3Y']
const yAxisValues = [95, 100, 105, 110, 115]

const chartSeries = [
  {
    color: '#15881f',
    strokeWidth: 1.3,
    values: [
      99.9, 99.9, 100.0, 100.0, 100.0, 100.0, 102.3, 101.0, 101.1, 100.3,
      100.5, 100.9, 101.3, 101.7, 101.2, 101.1, 101.5, 103.8, 105.0, 106.2,
      107.4, 108.1, 107.7, 109.9, 109.4, 109.6, 109.8, 109.2, 109.1, 109.2,
      109.3, 109.4, 109.5, 109.0,
    ],
  },
  {
    color: '#0a73ff',
    strokeWidth: 1.25,
    values: [
      99.9, 100.0, 100.1, 100.3, 100.4, 100.5, 100.6, 100.8, 103.2, 102.1,
      102.1, 101.2, 101.4, 101.6, 101.8, 101.2, 100.6, 99.9, 100.0, 101.3,
      102.4, 103.5, 104.4, 104.5, 104.0, 106.0, 105.6, 105.5, 105.4, 105.3,
      104.2, 103.3, 102.4, 102.2,
    ],
  },
  {
    color: '#ff4a46',
    strokeWidth: 1.05,
    values: [
      99.9, 99.9, 99.9, 99.9, 99.9, 99.9, 100.0, 100.1, 100.2, 98.9, 99.0,
      99.3, 99.4, 99.4, 99.4, 99.5, 99.6, 99.7, 99.8, 100.0, 100.0, 100.1,
      100.2, 100.3, 100.4, 100.5, 100.6, 100.9, 100.9, 101.0, 101.0, 101.1,
      101.2, 101.3,
    ],
  },
]

const xAxisLabels = [
  { label: 'May 28', index: 1 },
  { label: 'May 30', index: 3 },
  { label: 'Haz 01', index: 5 },
  { label: 'Haz 03', index: 7 },
  { label: 'Haz 05', index: 9 },
  { label: 'Haz 07', index: 11 },
  { label: 'Haz 09', index: 13 },
  { label: 'Haz 11', index: 15 },
  { label: 'Haz 13', index: 17 },
  { label: 'Haz 15', index: 19 },
  { label: 'Haz 17', index: 21 },
  { label: 'Haz 19', index: 23 },
  { label: 'Haz 21', index: 25 },
  { label: 'Haz 23', index: 27 },
  { label: 'Haz 25', index: 29 },
  { label: 'Haz 27', index: 31 },
  { label: 'Haz 29', index: 33 },
  { label: 'Tem', index: 34 },
]

const chartBounds = {
  min: 95,
  max: 115,
  left: 38,
  top: 24,
  width: 1132,
  height: 248,
}

function getPointString(values) {
  return values
    .map((value, index) => {
      const x = chartBounds.left + (index / (values.length - 1)) * chartBounds.width
      const y =
        chartBounds.top +
        ((chartBounds.max - value) / (chartBounds.max - chartBounds.min)) * chartBounds.height

      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function RangeButton({ label, active = false }) {
  return (
    <button
      className={`h-9 min-w-9 border px-3 text-[14px] font-medium transition-colors ${
        active
          ? 'border-[#49a566] bg-[#49a566] text-white'
          : 'border-[#bcc6cf] bg-white text-[#22303c]'
      }`}
      type="button"
    >
      {label}
    </button>
  )
}

function ChartControls() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <div className="flex items-center gap-2">
        {rangeTabs.map((label) => (
          <RangeButton active={label === '1A'} key={label} label={label} />
        ))}
      </div>

      <span className="h-5 w-px bg-[#c8cdd4]" />

      <button
        className="grid h-9 w-9 place-items-center border border-[#bcc6cf] bg-white text-[#28313a]"
        type="button"
      >
        <CalendarIcon />
      </button>

      <button
        className="flex h-10 min-w-[192px] items-center justify-between rounded border border-[#c8cfd6] bg-white px-4 text-[15px] font-semibold text-[#2d3136]"
        type="button"
      >
        Kapanış
        <svg className="h-4 w-4 text-[#20262d]" fill="none" viewBox="0 0 16 16">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </svg>
      </button>

      <button className="h-10 rounded bg-[#2f9653] px-6 text-[15px] font-semibold text-white" type="button">
        Fon Seçici
      </button>

      <button className="grid h-8 w-8 place-items-center text-[#207044]" type="button">
        <ExcelIcon className="h-6 w-6" />
      </button>

      <button
        className="grid h-8 w-8 place-items-center rounded-full bg-[#8e8f93] text-white"
        type="button"
      >
        <DownloadIcon />
      </button>
    </div>
  )
}

function ComparisonChart() {
  return (
    <section className="mx-auto mt-2 max-w-[1710px] px-4">
      <div className="bg-[#f4f7fb] px-5 pb-4 pt-3">
        <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="text-[22px] font-bold text-[#1f5f94]">Fon - Fon</h1>
          <ChartControls />
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1185px]">
            <svg className="h-[320px] w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 320">
              {yAxisValues.map((value) => {
                const y =
                  chartBounds.top +
                  ((chartBounds.max - value) / (chartBounds.max - chartBounds.min)) *
                    chartBounds.height

                return (
                  <g key={value}>
                    <line
                      stroke="#d2d8e0"
                      strokeWidth="1"
                      x1={chartBounds.left}
                      x2={chartBounds.left + chartBounds.width}
                      y1={y}
                      y2={y}
                    />
                    <text fill="#172a37" fontSize="12" x="8" y={y + 4}>
                      {value}
                    </text>
                  </g>
                )
              })}

              {xAxisLabels.map(({ label, index }) => {
                const x = chartBounds.left + ((index - 1) / 33) * chartBounds.width

                return (
                  <g key={label}>
                    <line
                      stroke="#cfd6de"
                      strokeWidth="0.9"
                      x1={x}
                      x2={x}
                      y1={chartBounds.top + chartBounds.height}
                      y2={chartBounds.top + chartBounds.height + 5}
                    />
                    <text fill="#172a37" fontSize="12" textAnchor="middle" x={x} y="297">
                      {label}
                    </text>
                  </g>
                )
              })}

              {chartSeries.map(({ color, strokeWidth, values }) => (
                <polyline
                  fill="none"
                  key={color}
                  points={getPointString(values)}
                  stroke={color}
                  strokeWidth={strokeWidth}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

function FonPage() {
  return (
    <main className="min-h-screen bg-white text-[#1d2732]">
      <ReportHeader />
      <div className="mx-auto flex max-w-[1710px] justify-end px-4 py-3">
        <NavigationButton to="/report" text="Rapor Sayfasına Dön" />
      </div>
      <ReportTopTabs
        activeTab="Karşılaştırma"
        breadcrumb={['Yatırım Fonları', 'Karşılaştırma', 'Fon-Fon']}
      />
      <ReportSubTabs activeTab="Fon-Fon" tabs={comparisonTabs} />
      <ComparisonChart />
    </main>
  )
}

export default FonPage
