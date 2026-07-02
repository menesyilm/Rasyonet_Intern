import NavigationButton from '../../src/components/NavigationButton'

const navItems = [
  'Yatırım Fonları',
  'Emeklilik Fonları',
  'Analiz',
  'PYS Portföy Değerleri',
  'Fon Filtreleme',
  'Fon Piyasası Görünümü',
]

const mainTabs = [
  'Fon Bazında',
  'Yönetim Ücreti',
  'Benchmark',
  'Oranlar',
  'Endeks',
  'Kurum',
  'Karşılaştırma',
]

const periodTabs = ['1H', '1A', '3A', '1Y', '2Y', '3Y']

const greenSeries = [
  99.9, 100.1, 100.3, 100.5, 100.8, 102.2, 101, 101.1, 100.2, 100.8, 101.3,
  101.6, 101.2, 101.5, 103.6, 104.9, 106.2, 107.5, 108.0, 107.7, 109.8,
  109.4, 109.6, 109.8, 110.0, 109.6, 109.9, 109.3, 109.1, 109.2, 109.4,
  109.5, 109.1,
]

const blueSeries = [
  99.9, 100.1, 100.3, 100.5, 100.7, 100.9, 103.1, 102.0, 102.1, 101.1,
  101.4, 101.6, 101.8, 101.1, 99.8, 100.0, 101.2, 102.3, 103.4, 104.4,
  104.6, 104.0, 105.8, 105.4, 105.3, 105.2, 105.1, 103.8, 102.9, 102.2,
  101.9, 101.6, 99.8,
]

const redSeries = [
  99.9, 100.0, 100.1, 100.1, 100.0, 100.2, 100.1, 99.0, 99.1, 99.4, 99.4,
  99.5, 99.5, 99.8, 100.0, 100.1, 100.1, 100.2, 100.3, 100.4, 100.6, 100.9,
  100.9, 101.0, 101.0, 101.1, 101.2, 101.3, 101.6, 101.7, 101.7, 101.7,
  101.9,
]

const xLabels = [
  'May 28',
  'May 30',
  'Haz 01',
  'Haz 03',
  'Haz 05',
  'Haz 07',
  'Haz 09',
  'Haz 11',
  'Haz 13',
  'Haz 15',
  'Haz 17',
  'Haz 19',
  'Haz 21',
  'Haz 23',
  'Haz 25',
  'Haz 27',
  'Haz 29',
  'Tem',
]

function pointsFor(series) {
  const min = 95
  const max = 115
  const left = 34
  const top = 18
  const width = 930
  const height = 228

  return series
    .map((value, index) => {
      const x = left + (index / (series.length - 1)) * width
      const y = top + ((max - value) / (max - min)) * height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function AppHeader() {
  return (
    <header className="border-b-4 border-[#2d9b57] bg-white">
      <div className="mx-auto flex h-14 max-w-[1688px] items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-8">
            <div className="absolute left-0 top-0 h-0 w-0 border-y-[16px] border-l-[28px] border-y-transparent border-l-[#2bb673]" />
            <div className="absolute left-2 top-2 h-0 w-0 border-y-[10px] border-l-[18px] border-y-transparent border-l-white" />
            <div className="absolute bottom-0 left-0 h-0 w-0 border-y-[13px] border-l-[23px] border-y-transparent border-l-[#1d6f9f]" />
          </div>
          <div className="flex items-center gap-3 text-[21px] font-bold tracking-tight">
            <span>
              <span className="text-[#2bb673]">PORTFOLIO</span>
              <span className="text-[#1d6596]">BASE</span>
            </span>
            <span className="h-6 w-px bg-[#2bb673]" />
            <span className="font-normal text-[#2bb673]">FUNDS</span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-bold text-[#2f2f2f] lg:flex">
          {navItems.map((item) => (
            <span className="whitespace-nowrap" key={item}>
              {item}
              {['Yatırım Fonları', 'Emeklilik Fonları', 'Analiz'].includes(item) && (
                <span className="ml-2 text-lg leading-none">⌄</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden h-9 w-[310px] items-center justify-between rounded-full border border-slate-300 bg-slate-50 px-4 text-sm text-slate-600 xl:flex">
            <span>Fon,Endeks,Grup Giriniz...</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#3ca15f] text-xs font-black text-white">
              F
            </span>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-full border-4 border-black text-xs font-black">
            ●
          </span>
        </div>
      </div>
    </header>
  )
}

function MainTabs() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1688px] justify-between px-3">
        <p className="py-4 text-sm font-medium text-[#005b9f]">
          Yatırım Fonları / Karşılaştırma /{' '}
          <span className="font-bold text-slate-950">Fon-Fon</span>
        </p>
        <div className="hidden items-end text-sm font-bold lg:flex">
          {mainTabs.map((tab) => (
            <span
              className={`px-3 py-4 ${
                tab === 'Karşılaştırma'
                  ? 'rounded-t border border-b-white border-slate-300 text-blue-700'
                  : 'text-slate-500'
              }`}
              key={tab}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SubTabs() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-12 max-w-[1688px] items-center justify-center gap-2 text-sm font-black">
        <span className="rounded bg-blue-700 px-3 py-3 text-white">Fon-Fon</span>
        <span className="px-2">Kurum (Büyüklük)</span>
        <span className="px-2">Fon-Diğer Yatırım Araçları</span>
      </div>
    </div>
  )
}

function ChartControls() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {periodTabs.map((period) => (
        <button
          className={`h-9 min-w-9 border px-3 text-sm ${
            period === '1A'
              ? 'border-[#2c9b5d] bg-[#2c9b5d] font-bold text-white'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
          key={period}
          type="button"
        >
          {period}
        </button>
      ))}
      <span className="mx-1 h-5 w-px bg-slate-300" />
      <button className="h-9 border border-slate-300 bg-white px-3" type="button">
        ▣
      </button>
      <select className="h-10 w-48 rounded border border-slate-300 bg-white px-4 text-sm font-semibold">
        <option>Kapanış</option>
      </select>
      <button className="h-10 rounded bg-[#258b4c] px-5 text-sm font-bold text-white" type="button">
        Fon Seçici
      </button>
      <span className="grid h-7 w-7 place-items-center rounded bg-[#21804a] text-xs font-black text-white">
        XLS
      </span>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-400 text-white">
        ↓
      </span>
    </div>
  )
}

function ComparisonChart() {
  return (
    <section className="mx-auto mt-2 max-w-[1672px] bg-[#f3f6fa] px-5 pb-3 pt-4">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-[#1a5d91]">Fon - Fon</h1>
        <ChartControls />
      </div>

      <div className="relative h-[290px] w-full">
        <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 280">
          {[95, 100, 105, 110, 115].map((value) => {
            const y = 18 + ((115 - value) / 20) * 228
            return (
              <g key={value}>
                <line stroke="#d5dbe2" strokeWidth="1" x1="34" x2="964" y1={y} y2={y} />
                <text fill="#111827" fontSize="7" x="18" y={y + 2}>
                  {value}
                </text>
              </g>
            )
          })}

          {xLabels.map((label, index) => {
            const x = 34 + (index / (xLabels.length - 1)) * 930
            return (
              <g key={label}>
                <line stroke="#d5dbe2" strokeWidth="0.8" x1={x} x2={x} y1="246" y2="252" />
                <text fill="#111827" fontSize="7" textAnchor="middle" x={x} y="268">
                  {label}
                </text>
              </g>
            )
          })}

          <polyline fill="none" points={pointsFor(blueSeries)} stroke="#1184ff" strokeWidth="1.15" />
          <polyline fill="none" points={pointsFor(greenSeries)} stroke="#148a24" strokeWidth="1.15" />
          <polyline fill="none" points={pointsFor(redSeries)} stroke="#ff3b37" strokeWidth="1.05" />
        </svg>
      </div>
    </section>
  )
}

function FonPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <AppHeader />
      <div className="mx-auto flex max-w-[1688px] justify-end px-3 py-3">
        <NavigationButton to="/report" text="Rapor Sayfasına Dön" />
      </div>
      <MainTabs />
      <SubTabs />
      <div className="border-b border-slate-200 py-2" />
      <ComparisonChart />
    </main>
  )
}

export default FonPage
