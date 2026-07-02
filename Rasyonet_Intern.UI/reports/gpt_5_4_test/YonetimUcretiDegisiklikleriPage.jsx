import {
  BellIcon,
  CalendarIcon,
  ChatIcon,
  ExcelIcon,
  ReportHeader,
  ReportSubTabs,
  ReportTopTabs,
  SortIcon,
} from './ReportChrome'
import NavigationButton from '../../src/components/NavigationButton'

const subTabs = ['Değişim', 'Fon Bazında', 'Grup Bazında']

const feeRows = [
  ['OSL:TMF', 'Osmanlı Portföy Kısa Vadeli Borçlanma Araçları (TL) Fonu', '02/01/2026', '3.29', '1.75'],
  ['PAB:TMF', 'A1 Capital Portföy Para Piyasası (TL) Fonu', '02/01/2026', '0.79', '2.60'],
  ['PLA:TMF', 'Yapı Kredi Portföy Play Fon Sepeti Özel Fonu', '05/01/2026', '5.50', ''],
  [
    'ITC:TMF',
    'Inveo Portföy Temettü Ödeyen Şirketler Hisse Senedi (TL) Fon (Hisse Senedi Yoğun Fon)',
    '06/01/2026',
    '6.85',
    '',
  ],
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

function DateField({ value }) {
  return (
    <button
      className="flex h-11 min-w-[182px] items-center justify-between rounded-md border border-[#cfd4db] bg-white px-4 text-[15px] font-semibold text-[#1f2831]"
      type="button"
    >
      {value}
      <CalendarIcon />
    </button>
  )
}

function Filters() {
  return (
    <section className="mx-auto flex max-w-[1710px] flex-wrap items-center gap-4 px-4 py-2.5">
      <span className="text-[15px] font-semibold text-[#1f2328]">Tarih:</span>
      <DateField value="31.12.2025" />
      <span className="text-[#48515c]">-</span>
      <DateField value="30.06.2026" />
      <button
        className="h-10 rounded-md bg-[#f1f3f6] px-6 text-[15px] font-semibold text-[#7f8893]"
        type="button"
      >
        Uygula
      </button>
      <button className="ml-auto h-10 rounded bg-[#2f9653] px-8 text-[15px] font-semibold text-white" type="button">
        Fon Seçici
      </button>
    </section>
  )
}

function ColumnHeader({ children, align = 'left', showSort = true }) {
  return (
    <th
      className={`border-b border-r border-[#d8dde3] bg-white px-4 py-3 text-[13px] font-bold text-[#33393f] ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : 'justify-between'}`}>
        <span>{children}</span>
        {showSort ? <SortIcon className="h-4 w-4 text-[#40a261]" /> : null}
      </div>
    </th>
  )
}

function FeeTable() {
  return (
    <section className="mx-auto mt-1 max-w-[1710px] px-4">
      <div className="bg-[#f4f7fb]">
        <div className="flex items-center justify-between px-5 py-2.5">
          <h1 className="text-[22px] font-bold text-[#1f5f94]">Yönetim Ücreti Değişiklikleri</h1>
          <button className="grid h-8 w-8 place-items-center text-[#217346]" type="button">
            <ExcelIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="min-w-[1400px] w-full border-collapse text-[15px]">
            <thead>
              <tr>
                <th className="w-14 border-b border-r border-[#d8dde3] bg-white px-4 py-3 text-left text-[13px] font-bold text-[#33393f]" />
                <ColumnHeader>Kod</ColumnHeader>
                <ColumnHeader>İsim</ColumnHeader>
                <ColumnHeader align="right">Değişim Tarihi</ColumnHeader>
                <ColumnHeader align="right">
                  Yönetim Ücreti
                  <br />
                  (1/100000)
                </ColumnHeader>
                <th className="border-b bg-white px-4 py-3 text-right text-[13px] font-bold text-[#33393f]">
                  <div className="flex items-center justify-end gap-2">
                    <span>
                      Önceki Yön. Ücreti
                      <br />
                      (1/100000)
                    </span>
                    <SortIcon className="h-4 w-4 text-[#40a261]" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {feeRows.map(([code, name, date, fee, previousFee], index) => (
                <tr className="border-b border-[#d8dde3] bg-[#f4f7fb]" key={code}>
                  <td className="border-r border-[#d8dde3] px-4 py-[14px] font-bold text-[#2f3237]">
                    {index + 1}
                  </td>
                  <td className="border-r border-[#d8dde3] px-4 py-[14px] font-bold text-[#3b3f44]">
                    <span className="underline">{code}</span>
                  </td>
                  <td className="border-r border-[#d8dde3] px-4 py-[14px] font-semibold text-[#23679a]">
                    {name}
                  </td>
                  <td className="border-r border-[#d8dde3] px-4 py-[14px] text-right font-bold text-[#363b40]">
                    {date}
                  </td>
                  <td className="border-r border-[#d8dde3] px-4 py-[14px] text-right font-bold text-[#363b40]">
                    {fee}
                  </td>
                  <td className="px-4 py-[14px] text-right font-bold text-[#363b40]">
                    {previousFee || '\u00A0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pointer-events-none absolute right-[2px] top-[48px] h-[87px] w-1 rounded-full bg-[#4ca86b]" />
          <div className="pointer-events-none absolute bottom-[6px] right-0 h-1 w-14 bg-[#767676]" />
        </div>
      </div>
    </section>
  )
}

function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-8 hidden flex-col items-center gap-4 lg:flex">
      <button className="grid h-14 w-14 place-items-center rounded-full bg-[#46a962] text-white shadow-lg" type="button">
        <ChatIcon />
      </button>

      <button
        className="relative grid h-14 w-14 place-items-center rounded-full border border-[#41b36c] bg-white text-[#41b36c] shadow"
        type="button"
      >
        <BellIcon />
        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#ff1b1b] text-[11px] font-bold text-white">
          29
        </span>
      </button>
    </div>
  )
}

function YonetimUcretiDegisiklikleriPage() {
  return (
    <main className="min-h-screen bg-white text-[#1d2732]">
      <ReportHeader />
      <div className="mx-auto flex max-w-[1710px] justify-end px-4 py-3">
        <NavigationButton to="/report" text="Rapor Sayfasına Dön" />
      </div>
      <ReportTopTabs
        activeTab="Yönetim Ücreti"
        breadcrumb={['Yatırım Fonları', 'Yönetim Ücreti', 'Değişim']}
      />
      <ReportSubTabs activeTab="Değişim" tabs={subTabs} />
      <Filters />
      <FeeTable />
      <FloatingActions />
    </main>
  )
}

export default YonetimUcretiDegisiklikleriPage
