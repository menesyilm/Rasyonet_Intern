import React, { useState, useMemo } from 'react';
import NavigationButton from '../../src/components/NavigationButton';

// Mock data for management fees
const mockFundsData = [
  {
    id: 1,
    kod: 'OSL:TMF',
    isim: 'Osmanlı Portföy Kısa Vadeli Borçlanma Araçları (TL) Fonu',
    degisimTarihi: '02/01/2026',
    yonetimUcreti: 3.29,
    oncekiYonetimUcreti: 1.75
  },
  {
    id: 2,
    kod: 'PAB:TMF',
    isim: 'A1 Capital Portföy Para Piyasası (TL) Fonu',
    degisimTarihi: '02/01/2026',
    yonetimUcreti: 0.79,
    oncekiYonetimUcreti: 2.60
  },
  {
    id: 3,
    kod: 'PLA:TMF',
    isim: 'Yapı Kredi Portföy Play Fon Sepeti Özel Fonu',
    degisimTarihi: '05/01/2026',
    yonetimUcreti: 5.50,
    oncekiYonetimUcreti: null
  },
  {
    id: 4,
    kod: 'ITC:TMF',
    isim: 'Inveo Portföy Temettü Ödeyen Şirketler Hisse Senedi (TL) Fon (Hisse Senedi Yoğun Fon)',
    degisimTarihi: '06/01/2026',
    yonetimUcreti: 6.85,
    oncekiYonetimUcreti: null
  },
  {
    id: 5,
    kod: 'YZG:TMF',
    isim: 'Yapı Kredi Portföy Gümüş Fon Sepeti Fonu',
    degisimTarihi: '07/01/2026',
    yonetimUcreti: 7.67,
    oncekiYonetimUcreti: 5.50
  },
  {
    id: 6,
    kod: 'BVD:TMF',
    isim: 'BV Portföy Birinci Değişken Fon',
    degisimTarihi: '09/01/2026',
    yonetimUcreti: 6.85,
    oncekiYonetimUcreti: null
  },
  {
    id: 7,
    kod: 'GO1:TMF',
    isim: 'One Portföy Birinci Fon Sepeti Fonu',
    degisimTarihi: '12/01/2026',
    yonetimUcreti: 5.48,
    oncekiYonetimUcreti: 7.12
  },
  {
    id: 8,
    kod: 'GO2:TMF',
    isim: 'One Portföy Katılım Fon Sepeti Fonu',
    degisimTarihi: '12/01/2026',
    yonetimUcreti: 5.48,
    oncekiYonetimUcreti: 7.12
  },
  {
    id: 9,
    kod: 'GO3:TMF',
    isim: 'One Portföy Üçüncü Fon Sepeti Fonu',
    degisimTarihi: '12/01/2026',
    yonetimUcreti: 6.16,
    oncekiYonetimUcreti: 7.12
  },
  {
    id: 10,
    kod: 'GO4:TMF',
    isim: 'One Portföy Dördüncü Fon Sepeti Fonu',
    degisimTarihi: '12/01/2026',
    yonetimUcreti: 6.16,
    oncekiYonetimUcreti: 7.12
  },
  {
    id: 11,
    kod: 'PRY:TMF',
    isim: 'Pusula Portföy Para Piyasası (TL) Fonu',
    degisimTarihi: '12/01/2026',
    yonetimUcreti: 3.43,
    oncekiYonetimUcreti: 2.74
  },
  {
    id: 12,
    kod: 'NAK:TMF',
    isim: 'Neo Portföy Altın Katılım Fonu',
    degisimTarihi: '12/01/2026',
    yonetimUcreti: 4.93,
    oncekiYonetimUcreti: null
  },
  {
    id: 13,
    kod: 'KTV:TMF',
    isim: 'KT Portföy Kısa Vadeli Kira Sertifikaları Katılım Fonu',
    degisimTarihi: '22/01/2026',
    yonetimUcreti: 4.10,
    oncekiYonetimUcreti: 4.11
  }
];

// Determines arrow direction and color based on fee change
const getFeeChangeIndicator = (current, previous) => {
  if (!previous) return null;
  const diff = current - previous;
  if (diff > 0) return { direction: '▲', color: 'text-green-600' };
  if (diff < 0) return { direction: '▼', color: 'text-red-600' };
  return { direction: '→', color: 'text-gray-600' };
};

export default function YonetimUcretiDegisiklikleriPage() {
  const [startDate, setStartDate] = useState('2025-12-31');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [filteredData, setFilteredData] = useState(mockFundsData);

  const handleApply = () => {
    // Filter data based on date range
    const filtered = mockFundsData.filter((item) => {
      const [day, month, year] = item.degisimTarihi.split('/');
      const itemDate = new Date(year, month - 1, day);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredData(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-4 flex max-w-7xl justify-end">
        <NavigationButton to="/report" text="Rapor Sayfasına Dön" />
      </div>
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Yönetim Ücreti Değişiklikleri</h1>
        </div>

        {/* Date Range Filter Section */}
        <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Tarih:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <span className="text-gray-400 text-lg mb-1">-</span>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2 opacity-0">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleApply}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Uygula
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Kod</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">İsim</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Değişim Tarihi</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Yönetim Ücreti<br /><span className="text-xs font-normal">(1/100000)</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Önceki Yön. Ücreti<br /><span className="text-xs font-normal">(1/100000)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const indicator = getFeeChangeIndicator(
                    item.yonetimUcreti,
                    item.oncekiYonetimUcreti
                  );

                  return (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                          {item.kod}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {item.isim}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.degisimTarihi}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-gray-900">
                            {item.yonetimUcreti.toFixed(2)}
                          </span>
                          {indicator && (
                            <span className={`text-xs font-bold ${indicator.color}`}>
                              {indicator.direction}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-gray-600">
                          {item.oncekiYonetimUcreti !== null
                            ? item.oncekiYonetimUcreti.toFixed(2)
                            : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Seçilen tarih aralığında veri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-sm text-gray-600">
          <p>Toplam {filteredData.length} fon gösteriliyor</p>
        </div>
      </div>
    </div>
  );
}
