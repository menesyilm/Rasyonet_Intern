import NavigationButton from '../src/components/NavigationButton'

const experimentReports = [
  {
    id: 'gpt_5_4_test',
    title: 'gpt_5_4_test',
    model: 'GPT 5.4',
    pageCount: 2,
    fileCount: 3,
    codeLines: 654,
    componentCount: 23,
    cleanCodeScore: 88,
    consistencyScore: 92,
    responsiveScore: 90,
    routes: {
      fon: '/reports/gpt_5_4_test/fon',
      yonetimUcreti: '/reports/gpt_5_4_test/yonetim-ucreti-degisiklikleri',
    },
    pages: [
      {
        name: 'FonPage',
        lines: 238,
        summary:
          'Grafik, tab ve header davranisi ortak ReportChrome yapisina bagli. Chart datasi deterministik ve referans ekrana yakin.',
      },
      {
        name: 'YonetimUcretiDegisiklikleriPage',
        lines: 191,
        summary:
          'Tablo, filtre ve floating action parcali componentlere ayrilmis. Ayni header kontratini kullandigi icin iki sayfa arasi tutarlilik yuksek.',
      },
      {
        name: 'ReportChrome',
        lines: 225,
        summary:
          'Tekrar eden header, tab, ikon ve layout parcasi ortaklastirilmis. Clean code skorunu yukselten ana fark bu dosya.',
      },
    ],
    verdict:
      'En dengeli sonuc. Bir dosya fazla acilmis gibi gorunse de bu dosya tekrar eden UI iskeletini topladigi icin bakimi kolaylastiriyor.',
  },
  {
    id: 'gpt_5_5_test',
    title: 'gpt_5_5_test',
    model: 'GPT 5.5',
    pageCount: 2,
    fileCount: 2,
    codeLines: 503,
    componentCount: 14,
    cleanCodeScore: 74,
    consistencyScore: 78,
    responsiveScore: 82,
    routes: {
      fon: '/reports/gpt_5_5_test/fon',
      yonetimUcreti: '/reports/gpt_5_5_test/yonetim-ucreti-degisiklikleri',
    },
    pages: [
      {
        name: 'FonPage',
        lines: 259,
        summary:
          'Grafik sayfasi referansa yakin; ancak header, tab ve ikon gibi ortak alanlar bu dosyada yeniden yazilmis.',
      },
      {
        name: 'YonetimUcretiDegisiklikleriPage',
        lines: 244,
        summary:
          'Tablo parcalanmasi yeterli, fakat FonPage ile ortak layout sozlesmesi olmadigi icin tekrar ve stil sapmasi var.',
      },
    ],
    verdict:
      'Dosya sayisi az ama tekrar orani daha yuksek. Kisa vadede okunabilir, uzun vadede ortak ReportChrome benzeri bir katman ister.',
  },
  {
    id: 'haiku_4_5_test',
    title: 'haiku_4_5_test',
    model: 'Haiku 4.5',
    pageCount: 2,
    fileCount: 2,
    codeLines: 405,
    componentCount: 3,
    cleanCodeScore: 55,
    consistencyScore: 48,
    responsiveScore: 64,
    routes: {
      fon: '/reports/haiku_4_5_test/fon',
      yonetimUcreti: '/reports/haiku_4_5_test/yonetim-ucreti-degisiklikleri',
    },
    pages: [
      {
        name: 'FonPage',
        lines: 149,
        summary:
          'Daha az satir var ama Math.random ile uretilen grafik verisi deterministik degil. Referans ekran detaylari sade kalmis.',
      },
      {
        name: 'YonetimUcretiDegisiklikleriPage',
        lines: 256,
        summary:
          'Filtreleme davranisi eklenmis, fakat sayfa tek buyuk component halinde kaldigi icin test edilebilirlik ve tekrar kullanimi zayif.',
      },
    ],
    verdict:
      'En hizli ve kisa cikti, fakat profesyonel UI tutarliligi ve clean code acisindan diger iki denemenin gerisinde.',
  },
]

const summaryItems = [
  ['Toplam klasor', experimentReports.length],
  ['Toplam referans sayfa', experimentReports.reduce((sum, report) => sum + report.pageCount, 0)],
  ['Toplam JSX dosya', experimentReports.reduce((sum, report) => sum + report.fileCount, 0)],
  ['Toplam kod satiri', experimentReports.reduce((sum, report) => sum + report.codeLines, 0)],
]

function ScoreBadge({ label, value }) {
  const tone =
    value >= 85
      ? 'bg-emerald-50 text-emerald-700'
      : value >= 70
        ? 'bg-amber-50 text-amber-700'
        : 'bg-rose-50 text-rose-700'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <strong className={`mt-2 inline-flex rounded-lg px-3 py-2 text-xl font-black ${tone}`}>
        %{value}
      </strong>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <strong className="mt-2 block text-2xl font-black tracking-normal text-slate-950">
        {value}
      </strong>
    </article>
  )
}

function ReportCard({ report }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-blue-700">
            {report.id}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-normal text-slate-950">
            {report.model} test raporu
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{report.verdict}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Sayfa" value={report.pageCount} />
            <SummaryCard label="Dosya" value={report.fileCount} />
            <SummaryCard label="Kod satiri" value={report.codeLines} />
            <SummaryCard label="Component" value={report.componentCount} />
          </div>
        </div>

        <div className="grid gap-3">
          <ScoreBadge label="Clean code" value={report.cleanCodeScore} />
          <ScoreBadge label="Tutarlilik" value={report.consistencyScore} />
          <ScoreBadge label="Responsive" value={report.responsiveScore} />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-normal text-slate-500">
            <tr>
              <th className="px-4 py-3">Icerik</th>
              <th className="px-4 py-3">Satir</th>
              <th className="px-4 py-3">Yorum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {report.pages.map((page) => (
              <tr key={page.name}>
                <td className="px-4 py-4 font-black text-slate-950">{page.name}</td>
                <td className="px-4 py-4 font-bold text-slate-800">{page.lines}</td>
                <td className="px-4 py-4 leading-6 text-slate-600">{page.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <NavigationButton to={report.routes.fon} text="FonPage'e Git" />
        <NavigationButton
          to={report.routes.yonetimUcreti}
          text="Yonetim Ucreti Sayfasina Git"
        />
      </div>
    </section>
  )
}

function AiExperimentReportPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-blue-700">
              AI deney raporu
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-4xl">
              Klasor Bazli Site Uretim Karsilastirmasi
            </h1>
            <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">
              gpt_5_4_test, gpt_5_5_test ve haiku_4_5_test klasorleri; acilan
              sayfa sayisi, yazilan kod satiri, component parcalanmasi, clean
              code yuzdesi ve sayfalar arasi tutarlilik acisindan raporlandi.
            </p>
          </div>

          <div className="flex shrink-0">
            <NavigationButton to="/charts" text="Grafikler Sayfasına Dön" />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map(([label, value]) => (
            <SummaryCard key={label} label={label} value={value} />
          ))}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black tracking-normal text-slate-950">
            Genel Sonuc
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            gpt_5_4_test en temiz mimariyi verdi; cunku ortak ReportChrome
            dosyasi ile iki sayfa arasindaki header, tab ve ikon tekrarlarini
            azaltti. gpt_5_5_test gorsel olarak yakin ama ortaklasma zayif.
            haiku_4_5_test daha az satir uretti fakat tek buyuk component,
            rastgele chart verisi ve daha dusuk referans benzerligi nedeniyle
            bakim kalitesi dusuk.
          </p>
        </section>

        {experimentReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </main>
  )
}

export default AiExperimentReportPage
