import React, { useState, useEffect } from 'react'
import NavigationButton from '../components/NavigationButton'

function PerformancePage() {
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const response = await fetch('http://localhost:5010/api/categories')

        if (!response.ok) {
          throw new Error('Veri çekilemedi')
        }

        const data = await response.json()

        setPerformanceData(data)

        const categories = {}

        const uniqueCategories = [
          ...new Set(data.map(item => item.categoryName || 'Kategori Yok'))
        ]

        uniqueCategories.forEach(name => {
          categories[name] = true
        })

        setExpandedCategories(categories)
        setError(null)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white p-4">
          <h1 className="text-4xl font-medium text-green-600">
            Performans
          </h1>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white p-4">
          <h1 className="text-4xl font-medium text-green-600">
            Performans
          </h1>
          <p className="mt-4 text-red-500">
            Error: {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="w-full bg-white p-[5px]">
        <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-medium text-green-600 m-4">
          Performans
        </h1>
        <NavigationButton
        to="/charts"
        text="Portföy Dağılımı"
      />
        </div>

        <table className="w-full border-collapse text-sm table-fixed">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                Fon Kodu
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                Büyüklük
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                Fiyat
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                Günlük (%)
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                Haftalık (%)
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                Aylık (%)
              </th>
            </tr>
          </thead>

<tbody>
  {performanceData.map(category => (
    <React.Fragment key={category.id?.timestamp}>
      <tr
        className="bg-green-100 font-semibold text-green-900 cursor-pointer border-b border-gray-200"
        onClick={() => toggleCategory(category.categoryName)}
      >
        <td className="py-[15px] px-[15px] text-[15px]">
          <div className="flex items-center gap-[10px]">
            <span
              className={`inline-block text-[12px] transition-transform duration-300 ${
                expandedCategories[category.categoryName]
                  ? 'rotate-90'
                  : ''
              }`}
            >
              ▶
            </span>

            {category.categoryName}
          </div>
        </td>

        <td className="py-[15px] px-[15px] font-bold text-[14px]">
          {category.performances
            ?.reduce((sum, p) => sum + (p.value || 0), 0)
            .toLocaleString('tr-TR')}
        </td>

        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>

      {expandedCategories[category.categoryName] &&
        category.performances?.map(row => (
          <tr
            key={row.uniqueCode}
            className="border-b border-gray-200 h-[72px] hover:bg-gray-50"
          >
            <td className="py-1 px-[5px] font-medium text-gray-800">
              <div className="w-[280px] mb-1 text-[15px]">
                {row.uniqueCode}
              </div>

              <div className="text-[13px] text-gray-500 font-normal">
                {row.performanceName}
              </div>
            </td>

            <td className="py-1 px-[5px] text-gray-600 font-mono">
              {row.value?.toLocaleString('tr-TR') ?? '-'}
            </td>

            <td className="py-1 px-[5px] text-gray-600 font-mono">
              {row.price?.toFixed(6) ?? '-'}
            </td>

            <td className="py-1 px-[5px] text-gray-600 font-mono">
              {row.dailyChange?.toFixed(4) ?? '-'}
            </td>

            <td className="py-1 px-[5px] text-gray-600 font-mono">
              {row.weeklyChange?.toFixed(4) ?? '-'}
            </td>

            <td className="py-1 px-[5px] text-gray-600 font-mono">
              {row.monthlyChange?.toFixed(4) ?? '-'}
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

export default PerformancePage