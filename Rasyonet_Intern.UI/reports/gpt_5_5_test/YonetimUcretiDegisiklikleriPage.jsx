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

const feeRows = [
  ['OSL:TMF', 'Osmanlı Portföy Kısa Vadeli Borçlanma Araçları (TL) Fonu', '02/01/2026', '3.29', '1.75'],
  ['PAB:TMF', 'A1 Capital Portföy Para Piyasası (TL) Fonu', '02/01/2026', '0.79', '2.60'],
  ['PLA:TMF', 'Yapı Kredi Portföy Play Fon Sepeti Özel Fonu', '05/01/2026', '5.50', ''],
  ['ITC:TMF', 'Inveo Portföy Temettü Ödeyen Şirketler Hisse Senedi (TL) Fon (Hisse Senedi Yoğun Fon)', '06/01/2026', '6.85', ''],
  ['YZG:TMF', 'Yapı Kredi Portföy Gümüş Fon Sepeti Fonu', '07/01/2026', '7.67', '5.50'],
  ['BVD:TMF', 'BV Portföy Birinci Değişken Fon', '09/01/2026', '6.85', ''],
  ['GO1:TMF', 'One Portföy Birinci Fon Sepeti Fonu', '12/01/2026', '5.48', '7.12'],
  ['GO2:TMF', 'One Portföy Katılım Fon Sepeti Fonu', '12/01/2026', '5.48', '7.12'],
  ['GO3:TMF', 'One Portföy Üçüncü Fon Sepeti Fonu', '12/01/2026', '6.16', '7.12'],
  ['GO4:TMF', 'One Portföy Dördüncü Fon Sepeti Fonu', '12/01/2026', '6.16', '7.12'],
  ['PRY:TMF', 'Pusula Portföy Para Piyasası (TL) Fonu', '12/01/2026', '3.43', '2.74'],
  ['NAK:TMF', 'Neo Portföy Altın Katılım Fonu', '12/01/2026', '4.93', ''],
  ['KTV:TMF', 'KT Portföy Kısa Vadeli Kira Sertifikaları Katılım Fonu', '22/01/2026', '4.10', '4.11'],
]

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
          Yatırım Fonları / Yönetim Ücreti /{' '}
          <span className="font-bold text-slate-950">Değişim</span>
        </p>
        <div className="hidden items-end text-sm font-bold lg:flex">
          {mainTabs.map((tab) => (
            <span
              className={`px-3 py-4 ${
                tab === 'Yönetim Ücreti'
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
        <span className="rounded bg-blue-700 px-3 py-3 text-white">Değişim</span>
        <span className="px-2">Fon Bazında</span>
        <span className="px-2">Grup Bazında</span>
      </div>
    </div>
  )
}

function DateFilters() {
  return (
    <section className="mx-auto flex max-w-[1672px] flex-wrap items-center gap-5 py-2">
      <span className="text-sm font-black">Tarih:</span>
      {['31.12.2025', '30.06.2026'].map((date, index) => (
        <div className="flex items-center gap-3" key={date}>
          {index === 1 && <span className="text-slate-600">-</span>}
          <button
            className="flex h-10 w-[180px] items-center justify-between rounded border border-slate-300 bg-white px-4 text-sm font-bold"
            type="button"
          >
            {date}
            <span className="text-lg">▣</span>
          </button>
        </div>
      ))}
      <button className="h-10 rounded bg-slate-100 px-7 text-sm font-bold text-slate-500" type="button">
        Uygula
      </button>
      <button className="ml-auto h-10 rounded bg-[#258b4c] px-6 text-sm font-bold text-white" type="button">
        Fon Seçici
      </button>
    </section>
  )
}

function SortIcon() {
  return (
    <span className="ml-2 inline-grid align-middle text-[10px] leading-[8px] text-[#2b9b58]">
      <span>▲</span>
      <span>▼</span>
    </span>
  )
}

function FeeTable() {
  return (
    <section className="mx-auto mt-3 max-w-[1672px] bg-[#f3f6fa]">
      <div className="flex h-11 items-center justify-between px-5">
        <h1 className="text-2xl font-bold text-[#1a5d91]">Yönetim Ücreti Değişiklikleri</h1>
        <span className="grid h-7 w-7 place-items-center rounded bg-[#21804a] text-xs font-black text-white">
          XLS
        </span>
      </div>

      <div className="relative overflow-x-auto border-t border-slate-200">
        <table className="w-full min-w-[1320px] border-collapse text-left text-sm">
          <thead>
            <tr className="h-12 bg-white text-slate-800">
              <th className="w-[58px] border-r border-slate-200 px-4" />
              <th className="w-40 border-r border-slate-200 px-4 font-black">
                Kod <SortIcon />
              </th>
              <th className="border-r border-slate-200 px-4 font-black">
                İsim <SortIcon />
              </th>
              <th className="w-40 border-r border-slate-200 px-4 text-right font-black">
                Değişim Tarihi <SortIcon />
              </th>
              <th className="w-40 border-r border-slate-200 px-4 text-right font-black">
                Yönetim Ücreti
                <br />
                (1/100000) <SortIcon />
              </th>
              <th className="w-40 px-4 text-right font-black">
                Önceki Yön. Ücreti
                <br />
                (1/100000) <SortIcon />
              </th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {feeRows.map(([code, name, date, currentFee, previousFee], index) => (
              <tr className="h-[41px] border-t border-slate-200 bg-[#f3f6fa]" key={code}>
                <td className="border-r border-slate-200 px-4 text-slate-900">{index + 1}</td>
                <td className="border-r border-slate-200 px-4">
                  <span className="font-black text-slate-800 underline">{code}</span>
                </td>
                <td className="border-r border-slate-200 px-4 text-[#126196]">{name}</td>
                <td className="border-r border-slate-200 px-4 text-right text-slate-800">{date}</td>
                <td className="border-r border-slate-200 px-4 text-right text-slate-800">{currentFee}</td>
                <td className="px-4 text-right text-slate-800">{previousFee}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="absolute right-0 top-12 h-[90px] w-1 rounded bg-[#2fa060]" />
      </div>
    </section>
  )
}

function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-8 hidden flex-col items-center gap-4 lg:flex">
      <button className="grid h-14 w-14 place-items-center rounded-full bg-[#3ea45f] text-2xl text-white shadow-lg" type="button">
        ...
      </button>
      <button className="relative grid h-14 w-14 place-items-center rounded-full border border-emerald-400 bg-white text-xl text-emerald-600 shadow" type="button">
        ♧
        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-xs font-black text-white">
          29
        </span>
      </button>
    </div>
  )
}

function YonetimUcretiDegisiklikleriPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <AppHeader />
      <div className="mx-auto flex max-w-[1688px] justify-end px-3 py-3">
        <NavigationButton to="/report" text="Rapor Sayfasına Dön" />
      </div>
      <MainTabs />
      <SubTabs />
      <DateFilters />
      <FeeTable />
      <FloatingActions />
    </main>
  )
}

export default YonetimUcretiDegisiklikleriPage
