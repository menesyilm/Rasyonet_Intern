import React, { useState, useEffect } from 'react'

function App() {
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})

  useEffect(() => {
    const fetchFonData = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5010/api/fons')

        if (!response.ok) {
          throw new Error('Veri çekilemedi')
        }

        const data = await response.json()
        setPerformanceData(data)

        const categories = {}
        const uniqueCategories = [...new Set(data.map(item => item.kategoriAdi))]
        uniqueCategories.forEach(adi => {
          categories[adi] = true
        })
        setExpandedCategories(categories)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Hata:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFonData()
  }, [])

  const toggleCategory = (kategoriId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [kategoriId]: !prev[kategoriId]
    }))
  }

  const groupedData = performanceData.reduce((acc, item) => {
    const key = item.kategoriAdi
    if (!acc[key]) {
      acc[key] = {
        kategoriAdi: item.kategoriAdi,
        fonlar: [],
        toplamBuyukluk: 0
      }
    }
    acc[key].fonlar.push(item)
    acc[key].toplamBuyukluk += item.buyukluk || 0
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 w-full">
        <div className="w-full bg-white p-2">
          <h1 className="text-4xl font-medium text-green-600 m-4">Performans</h1>
          <p className="m-4 text-gray-500">Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 w-full">
        <div className="w-full bg-white p-2">
          <h1 className="text-4xl font-medium text-green-600 m-4">Performans</h1>
          <p className="m-4 text-red-500">Hata: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="w-full bg-white p-[5px]">
        <h1 className="text-4xl font-medium text-green-600 m-4">Performans</h1>
        <table className="w-full border-collapse text-sm table-fixed">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="py-1 px-[5px] text-left font-semibold text-gray-700 whitespace-nowrap">Fon Kodu</th>
              <th className="py-1 px-[5px] text-left font-semibold text-gray-700 whitespace-nowrap">Büyüklük</th>
              <th className="py-1 px-[5px] text-left font-semibold text-gray-700 whitespace-nowrap">Fiyat</th>
              <th className="py-1 px-[5px] text-left font-semibold text-gray-700 whitespace-nowrap">Günlük (%)</th>
              <th className="py-1 px-[5px] text-left font-semibold text-gray-700 whitespace-nowrap">Haftalık (%)</th>
              <th className="py-1 px-[5px] text-left font-semibold text-gray-700 whitespace-nowrap">Aylık (%)</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedData).map((category) => (
              <React.Fragment key={category.kategoriAdi}>
                {/* Kategori Satırı */}
                <tr
                  className="bg-green-100 font-semibold text-green-900 cursor-pointer border-b border-gray-200 transition-colors duration-200 "
                  onClick={() => toggleCategory(category.kategoriAdi)}
                >
                  <td className="py-[15px] px-[15px] text-[15px]">
                    <div className="flex items-center gap-[10px]">
                      <span
                        className={`inline-block text-[12px] transition-transform duration-300 ${
                          expandedCategories[category.kategoriAdi] ? 'rotate-90' : ''
                        }`}
                      >
                        ▶
                      </span>
                      {category.kategoriAdi}
                    </div>
                  </td>
                  <td className="py-[15px] px-[15px] text-left font-bold text-[14px]">
                    {category.toplamBuyukluk.toLocaleString('tr-TR')}
                  </td>
                  <td className="py-[15px] px-[15px] bg-green-100"></td>
                  <td className="py-[15px] px-[15px] bg-green-100"></td>
                  <td className="py-[15px] px-[15px] bg-green-100"></td>
                  <td className="py-[15px] px-[15px] bg-green-100"></td>
                </tr>

                {/* Fon Satırları */}
                {expandedCategories[category.kategoriAdi] && category.fonlar.map((row) => (
                  <tr
                    key={row.fonPerformansId}
                    className="border-b border-gray-200 h-[72px] transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="py-1 px-[5px] font-medium text-gray-800">
                      <div className="w-[280px] min-w-[280px] max-w-[280px] mb-1 text-[15px]">
                        {row.fonKodu}
                      </div>
                      <div className="text-[13px] text-gray-500 font-normal">
                        {row.fonAdi}
                      </div>
                    </td>
                    <td className="py-1 px-[5px] text-left text-gray-600 font-mono">
                      {row.buyukluk?.toLocaleString('tr-TR') || '-'}
                    </td>
                    <td className="py-1 px-[5px] text-left text-gray-600 font-mono">
                      {row.fiyat?.toFixed(6) || '-'}
                    </td>
                    <td className="py-1 px-[5px] text-left text-gray-600 font-mono">
                      {row.gunlukDegisimYuzde?.toFixed(4) || '-'}
                    </td>
                    <td className="py-1 px-[5px] text-left text-gray-600 font-mono">
                      {row.haftalikDegisimYuzde?.toFixed(4) || '-'}
                    </td>
                    <td className="py-1 px-[5px] text-left text-gray-600 font-mono">
                      {row.aylikDegisimYuzde?.toFixed(4) || '-'}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App