import { useMemo, useState } from 'react'

const referencePages = [
  {
    id: 'fonFon',
    title: 'Fon Fon Sayfasi',
    imageName: 'fon-fon.png',
    imageSrc: '/images/fon-fon.png',
  },
  {
    id: 'yonetimUcreti',
    title: 'Yonetim Ucreti Degisiklikleri Sayfasi',
    imageName: 'yonetim-ucreti-degisiklikleri.png',
    imageSrc: '/images/yonetim-ucreti-degisiklikleri.png',
  },
]

const methods = [
  {
    id: 'claudeSkill',
    label: 'Claude + Skill',
    detail: 'Claude tarafinda hazir skill ile uretim',
  },
  {
    id: 'claudeNoSkill',
    label: "Claude + Skill'siz",
    detail: 'Claude uzerinden skill kullanmadan uretim',
  },
  {
    id: 'claudeCustomSkill',
    label: 'Claude + Ozel Skill',
    detail: 'Kendi olusturdugun skill ile Claude uretimi',
  },
]

const emptyMetric = {
  inputTokens: 0,
  outputTokens: 0,
  credits: 0,
  iterations: 1,
  fileCount: 0,
  componentCount: 0,
  duplicateRate: 0,
  responsiveScore: 0,
  accessibilityScore: 0,
  promptCount: 1,
}

const initialMetrics = referencePages.reduce((pageAcc, page) => {
  pageAcc[page.id] = methods.reduce((methodAcc, method) => {
    methodAcc[method.id] = { ...emptyMetric }
    return methodAcc
  }, {})

  return pageAcc
}, {})

const initialNotes = referencePages.reduce((acc, page) => {
  acc[page.id] = ''
  return acc
}, {})

const metricGuide = [
  ['Toplam token / credit', 'Maliyet'],
  ['Iterasyon sayisi', 'Kac kere duzeltme istendigini gosterir'],
  ['Olusan dosya sayisi', 'Kodun parcalanma seviyesini gosterir'],
  ['Component sayisi', 'Frontend mimarisi icin onemli'],
  ['Kod tekrar orani', 'Clean Code kalitesi'],
  ['Responsive uyum', 'UI kalitesi'],
  ['Accessibility', 'Profesyonel frontend kalitesi'],
  ['Prompt sayisi', 'Yapay zekayi ne kadar yonlendirdigini gosterir'],
]

function toNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0
}

function getTotalTokens(metric) {
  return toNumber(metric.inputTokens) + toNumber(metric.outputTokens)
}

function getQualityScore(metric) {
  const responsive = Math.min(toNumber(metric.responsiveScore), 100)
  const accessibility = Math.min(toNumber(metric.accessibilityScore), 100)
  const cleanCode = Math.max(0, 100 - Math.min(toNumber(metric.duplicateRate), 100))
  const structure = Math.min(
    100,
    toNumber(metric.fileCount) * 8 + toNumber(metric.componentCount) * 10,
  )

  return Math.round(
    responsive * 0.28 + accessibility * 0.28 + cleanCode * 0.24 + structure * 0.2,
  )
}

function formatNumber(value) {
  return new Intl.NumberFormat('tr-TR').format(Math.round(toNumber(value)))
}

function getPageRows(pageId, metrics) {
  return methods.map((method, index) => {
    const metric = metrics[pageId][method.id]

    return {
      ...method,
      testNo: index + 1,
      ...metric,
      totalTokens: getTotalTokens(metric),
      qualityScore: getQualityScore(metric),
    }
  })
}

function getSummary(rows) {
  const filledRows = rows.filter((row) => row.totalTokens > 0 || toNumber(row.credits) > 0)
  const totalTokens = rows.reduce((sum, row) => sum + row.totalTokens, 0)
  const totalCredits = rows.reduce((sum, row) => sum + toNumber(row.credits), 0)
  const lowestToken = [...filledRows].sort((a, b) => a.totalTokens - b.totalTokens)[0]
  const highestQuality = [...rows].sort((a, b) => b.qualityScore - a.qualityScore)[0]
  const lowestIteration = [...rows]
    .filter((row) => toNumber(row.iterations) > 0)
    .sort((a, b) => toNumber(a.iterations) - toNumber(b.iterations))[0]
  const highestPromptCount = [...rows].sort(
    (a, b) => toNumber(b.promptCount) - toNumber(a.promptCount),
  )[0]

  return {
    totalTokens,
    totalCredits,
    lowestToken: lowestToken?.label || '-',
    highestQuality: highestQuality?.qualityScore > 0 ? highestQuality.label : '-',
    lowestIteration: lowestIteration?.label || '-',
    highestPromptCount:
      toNumber(highestPromptCount?.promptCount) > 0 ? highestPromptCount.label : '-',
  }
}

function NumberInput({ label, max, min = 0, onChange, value }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <input
        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        max={max}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        type="number"
        value={value}
      />
    </label>
  )
}

function SummaryCard({ label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <strong className="mt-2 block text-xl font-black tracking-normal text-slate-950">
        {value}
      </strong>
    </article>
  )
}

function PageReportSection({ note, onMetricChange, onNoteChange, page, rows }) {
  const summary = useMemo(() => getSummary(rows), [rows])
  const tokenRanking = useMemo(() => {
    return [...rows]
      .filter((row) => row.totalTokens > 0)
      .sort((a, b) => a.totalTokens - b.totalTokens)
  }, [rows])

  return (
    <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-blue-700">
            3 test
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-normal text-slate-950">
            {page.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bu bolumde ayni referans gorsel icin 3 farkli Claude uretim
            yontemi karsilastirilir.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Toplam token" value={formatNumber(summary.totalTokens)} />
            <SummaryCard label="Toplam credit" value={formatNumber(summary.totalCredits)} />
            <SummaryCard label="En az token" value={summary.lowestToken} />
            <SummaryCard label="En yuksek kalite" value={summary.highestQuality} />
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="grid aspect-video place-items-center overflow-hidden rounded-lg bg-white">
            <img
              alt={page.title}
              className="h-full w-full object-contain"
              src={page.imageSrc}
            />
          </div>
          <p className="mt-3 text-xs font-bold text-slate-500">{page.imageName}</p>
        </aside>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="text-lg font-black tracking-normal text-slate-950">
            Metrik Tablosu
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-normal text-slate-500">
              <tr>
                <th className="px-4 py-3">Test</th>
                <th className="px-4 py-3">Yontem</th>
                <th className="px-4 py-3">Input</th>
                <th className="px-4 py-3">Output</th>
                <th className="px-4 py-3">Credit</th>
                <th className="px-4 py-3">Iterasyon</th>
                <th className="px-4 py-3">Dosya</th>
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Tekrar %</th>
                <th className="px-4 py-3">Responsive</th>
                <th className="px-4 py-3">A11y</th>
                <th className="px-4 py-3">Prompt</th>
                <th className="px-4 py-3">Toplam</th>
                <th className="px-4 py-3">Kalite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map((row) => (
                <tr className="align-top" key={row.id}>
                  <td className="px-4 py-4">
                    <strong className="block font-black text-slate-950">
                      Test {row.testNo}
                    </strong>
                    <span className="text-xs font-semibold text-slate-500">
                      {row.detail}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-800">{row.label}</td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="Token"
                      onChange={(value) => onMetricChange(row.id, 'inputTokens', value)}
                      value={row.inputTokens}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="Token"
                      onChange={(value) => onMetricChange(row.id, 'outputTokens', value)}
                      value={row.outputTokens}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="Credit"
                      onChange={(value) => onMetricChange(row.id, 'credits', value)}
                      value={row.credits}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="Adet"
                      onChange={(value) => onMetricChange(row.id, 'iterations', value)}
                      value={row.iterations}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="Adet"
                      onChange={(value) => onMetricChange(row.id, 'fileCount', value)}
                      value={row.fileCount}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="Adet"
                      onChange={(value) => onMetricChange(row.id, 'componentCount', value)}
                      value={row.componentCount}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="0-100"
                      max="100"
                      onChange={(value) => onMetricChange(row.id, 'duplicateRate', value)}
                      value={row.duplicateRate}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="0-100"
                      max="100"
                      onChange={(value) => onMetricChange(row.id, 'responsiveScore', value)}
                      value={row.responsiveScore}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="0-100"
                      max="100"
                      onChange={(value) =>
                        onMetricChange(row.id, 'accessibilityScore', value)
                      }
                      value={row.accessibilityScore}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <NumberInput
                      label="Adet"
                      onChange={(value) => onMetricChange(row.id, 'promptCount', value)}
                      value={row.promptCount}
                    />
                  </td>
                  <td className="px-4 py-4 text-lg font-black text-blue-700">
                    {formatNumber(row.totalTokens)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex min-w-14 justify-center rounded-lg bg-emerald-50 px-3 py-2 text-base font-black text-emerald-700">
                      {row.qualityScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-black tracking-normal text-slate-950">
            Token Siralamasi
          </h3>
          <ol className="mt-4 grid gap-3">
            {tokenRanking.length ? (
              tokenRanking.map((row, index) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                  key={row.id}
                >
                  <span>
                    <strong className="block text-sm font-black text-slate-950">
                      {index + 1}. {row.label}
                    </strong>
                    <span className="text-xs font-semibold text-slate-500">
                      {row.iterations} iterasyon, {row.promptCount} prompt
                    </span>
                  </span>
                  <span className="text-lg font-black text-blue-700">
                    {formatNumber(row.totalTokens)}
                  </span>
                </li>
              ))
            ) : (
              <li className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm font-medium text-slate-500">
                Token degeri girilmedi.
              </li>
            )}
          </ol>
        </article>

        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-black tracking-normal text-slate-950">
            Sayfa Sonucu
          </h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p>
              En az iterasyon:{' '}
              <strong className="text-slate-950">{summary.lowestIteration}</strong>
            </p>
            <p>
              En cok prompt:{' '}
              <strong className="text-slate-950">{summary.highestPromptCount}</strong>
            </p>
          </div>
          <label className="mt-4 grid gap-2">
            <span className="text-sm font-bold text-slate-600">
              Degerlendirme notu
            </span>
            <textarea
              className="min-h-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder="Bu referans sayfa icin token maliyeti, kod detayi ve skill etkisini kisa yorumla."
              value={note}
            />
          </label>
        </article>
      </div>
    </section>
  )
}

function AiExperimentReportPage() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [reportDate, setReportDate] = useState(() => {
    return new Date().toISOString().slice(0, 10)
  })
  const [sharedPrompt, setSharedPrompt] = useState('')
  const [notes, setNotes] = useState(initialNotes)

  const pageRows = useMemo(() => {
    return referencePages.reduce((acc, page) => {
      acc[page.id] = getPageRows(page.id, metrics)
      return acc
    }, {})
  }, [metrics])

  const allRows = useMemo(() => {
    return referencePages.flatMap((page) =>
      pageRows[page.id].map((row) => ({
        ...row,
        pageId: page.id,
        pageTitle: page.title,
      })),
    )
  }, [pageRows])

  const overallSummary = useMemo(() => {
    const summary = getSummary(allRows)

    return {
      ...summary,
      totalTests: allRows.length,
    }
  }, [allRows])

  function updateMetric(pageId, methodId, field, value) {
    setMetrics((current) => ({
      ...current,
      [pageId]: {
        ...current[pageId],
        [methodId]: {
          ...current[pageId][methodId],
          [field]: value,
        },
      },
    }))
  }

  function updateNote(pageId, value) {
    setNotes((current) => ({
      ...current,
      [pageId]: value,
    }))
  }

  function resetReport() {
    setMetrics(initialMetrics)
    setSharedPrompt('')
    setNotes(initialNotes)
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-normal text-blue-700">
              AI deney raporu
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-4xl">
              Claude Site Uretim Karsilastirmasi
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Iki referans gorsel icin uc farkli Claude uretim yontemini ayri
              ayri karsilastir. Toplam 6 test satiri token, credit ve frontend
              kalite metrikleriyle takip edilir.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-950 shadow-sm transition hover:border-blue-500"
              onClick={resetReport}
              type="button"
            >
              Temizle
            </button>
            <button
              className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              onClick={() => window.print()}
              type="button"
            >
              PDF / Yazdir
            </button>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <label className="grid gap-2 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-sm font-bold text-slate-600">Ortak prompt</span>
            <textarea
              className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setSharedPrompt(event.target.value)}
              placeholder="Iki sayfa icin ortak kalan ana prompt veya kisa deney ozeti"
              value={sharedPrompt}
            />
          </label>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard label="Toplam test" value={overallSummary.totalTests} />
          <SummaryCard
            label="Toplam token"
            value={formatNumber(overallSummary.totalTokens)}
          />
          <SummaryCard
            label="Toplam credit"
            value={formatNumber(overallSummary.totalCredits)}
          />
          <SummaryCard label="Genel en az token" value={overallSummary.lowestToken} />
          <SummaryCard
            label="Genel en yuksek kalite"
            value={overallSummary.highestQuality}
          />
        </section>

        {referencePages.map((page) => (
          <PageReportSection
            key={page.id}
            note={notes[page.id]}
            onMetricChange={(methodId, field, value) =>
              updateMetric(page.id, methodId, field, value)
            }
            onNoteChange={(value) => updateNote(page.id, value)}
            page={page}
            rows={pageRows[page.id]}
          />
        ))}

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black tracking-normal text-slate-950">
            Metrik Anlamlari
          </h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-normal text-slate-500">
                <tr>
                  <th className="px-4 py-3">Metrik</th>
                  <th className="px-4 py-3">Neden onemli?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metricGuide.map(([metric, reason]) => (
                  <tr key={metric}>
                    <td className="px-4 py-3 font-bold text-slate-900">{metric}</td>
                    <td className="px-4 py-3 text-slate-600">{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AiExperimentReportPage
