const navigationItems = [
  { label: 'Yatırım Fonları', hasDropdown: true },
  { label: 'Emeklilik Fonları', hasDropdown: true },
  { label: 'Analiz', hasDropdown: true },
  { label: 'PYŞ Portföy Değerleri' },
  { label: 'Fon Filtreleme' },
  { label: 'Fon Piyasası Görünümü' },
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

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

function ChevronDownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  )
}

export function CalendarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M5.5 2.5v2M14.5 2.5v2M3 6.5h14M5 4.5h10a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 15 16.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  )
}

export function DownloadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20">
      <path d="M10 3.5v8m0 0 3-3m-3 3-3-3M4 14.5h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  )
}

export function ExcelIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 20 20">
      <rect fill="#217346" height="18" rx="2.2" width="12" x="7" y="1" />
      <rect fill="#1b5e20" height="14" rx="1.5" width="8.6" x="1" y="3" />
      <path d="m4 6 2 3-2 3M7 6 5 9l2 3" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      <path d="M10 5h6M10 8h6M10 11h6M10 14h6" stroke="#d9f0df" strokeLinecap="round" strokeWidth="1" />
    </svg>
  )
}

export function SortIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 12 16">
      <path d="M6 2 2.7 5.7h6.6L6 2Z" fill="currentColor" />
      <path d="m6 14 3.3-3.7H2.7L6 14Z" fill="currentColor" />
    </svg>
  )
}

export function ChatIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5c-4.42 0-8 2.96-8 6.6 0 1.7.79 3.25 2.08 4.43L5.3 19l3.26-1.64c1.01.3 2.1.46 3.44.46 4.42 0 8-2.95 8-6.59C20 7.96 16.42 5 12 5Z"
        fill="currentColor"
      />
      <circle cx="9" cy="11.2" fill="#fff" r="1" />
      <circle cx="12" cy="11.2" fill="#fff" r="1" />
      <circle cx="15" cy="11.2" fill="#fff" r="1" />
    </svg>
  )
}

export function BellIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4.5a4.25 4.25 0 0 0-4.25 4.25v2.13c0 .83-.27 1.63-.77 2.29L5.7 15.02a1 1 0 0 0 .8 1.6h11a1 1 0 0 0 .8-1.6l-1.28-1.85a3.75 3.75 0 0 1-.77-2.29V8.75A4.25 4.25 0 0 0 12 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M10 18.25a2 2 0 0 0 4 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function PortfolioMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-8">
        <div className="absolute left-0 top-0 h-0 w-0 border-y-[16px] border-l-[28px] border-y-transparent border-l-[#2bb673]" />
        <div className="absolute left-[7px] top-[7px] h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-white" />
        <div className="absolute bottom-0 left-0 h-0 w-0 border-y-[13px] border-l-[23px] border-y-transparent border-l-[#1d6f9f]" />
      </div>
      <div className="flex items-center gap-3 tracking-tight">
        <span className="text-[18px] font-bold leading-none md:text-[22px]">
          <span className="text-[#2bb673]">PORTFOLIO</span>
          <span className="text-[#1d6596]">BASE</span>
        </span>
        <span className="hidden h-6 w-px bg-[#46aa69] sm:block" />
        <span className="hidden text-[18px] font-light tracking-[0.18em] text-[#2bb673] sm:block">FUNDS</span>
      </div>
    </div>
  )
}

function SearchChip() {
  return (
    <div className="hidden h-9 min-w-[300px] items-center justify-between rounded-full border border-[#b6c1cc] bg-white px-5 text-[15px] text-[#4a4f55] xl:flex">
      <span className="truncate">Fon,Endeks,Grup Giriniz...</span>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#46a962] text-white">
        <svg fill="none" viewBox="0 0 18 18" className="h-4 w-4">
          <path d="M5 4h8M5 8h6M5 12h5M12.5 4v8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
      </span>
    </div>
  )
}

function ProfileBadge() {
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-black text-black">
      <div className="h-3.5 w-3.5 rounded-full border-[2px] border-current" />
    </div>
  )
}

export function ReportHeader() {
  return (
    <header className="border-b-[3px] border-[#45a96a] bg-white">
      <div className="mx-auto flex h-14 max-w-[1710px] items-center justify-between gap-4 px-4">
        <PortfolioMark />

        <nav className="hidden items-center gap-7 text-[15px] font-semibold text-[#2f3236] xl:flex">
          {navigationItems.map(({ label, hasDropdown }) => (
            <span className="flex items-center gap-1 whitespace-nowrap" key={label}>
              {label}
              {hasDropdown ? <ChevronDownIcon className="h-3.5 w-3.5 text-[#2e3338]" /> : null}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <SearchChip />
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#46a962] text-white xl:hidden">
            <svg fill="none" viewBox="0 0 18 18" className="h-4 w-4">
              <path d="M5 4h8M5 8h6M5 12h5M12.5 4v8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            </svg>
          </div>
          <ProfileBadge />
        </div>
      </div>
    </header>
  )
}

export function ReportTopTabs({ breadcrumb, activeTab }) {
  return (
    <div className="border-b border-[#d4d7dc] bg-white">
      <div className="mx-auto flex max-w-[1710px] flex-col gap-3 px-4 py-2 lg:flex-row lg:items-end lg:justify-between lg:py-0">
        <p className="py-2 text-[14px] font-medium text-[#1f5d93]">
          {breadcrumb.map((item, index) => (
            <span key={item}>
              {index > 0 ? <span className="text-[#76828f]"> / </span> : null}
              <span className={index === breadcrumb.length - 1 ? 'font-semibold text-[#1f1f1f]' : ''}>{item}</span>
            </span>
          ))}
        </p>

        <div className="flex flex-wrap items-end gap-0 text-[14px] font-semibold text-[#8a8f96]">
          {mainTabs.map((tab) => (
            <span
              className={cn(
                'rounded-t border border-transparent px-3 py-3',
                tab === activeTab
                  ? 'border-[#d4d7dc] border-b-white bg-white text-[#0f26d8]'
                  : 'text-[#7d838b]'
              )}
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

export function ReportSubTabs({ tabs, activeTab }) {
  return (
    <div className="border-b border-[#d4d7dc] bg-white">
      <div className="mx-auto flex max-w-[1710px] flex-wrap items-center justify-center gap-2 px-4 py-2 text-[14px] font-semibold">
        {tabs.map((tab) => (
          <span
            className={cn(
              'rounded px-3 py-2.5',
              tab === activeTab ? 'bg-[#0718d6] text-white shadow-sm' : 'text-[#111111]'
            )}
            key={tab}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  )
}
