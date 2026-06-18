import React, { useState, useEffect } from 'react'
import NavigationButton from '../components/NavigationButton'
import SortButton from '../components/SortButton'
import { getCategories } from '../services/api'

function PerformancePage() {
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  })

  useEffect(() => {
    let isActive = true
    const retryDelay = 2000
    const timeout = 15000

    const wait = (ms) =>
      new Promise(resolve => setTimeout(resolve, ms))

    const fetchData = async () => {
      const startedAt = Date.now()

      setLoading(true)
      setError(null)

      while (isActive) {
        try {
          const data = await getCategories()

          if (!isActive) return

          setPerformanceData(data)

          const categories = {}

          const uniqueCategories = [
            ...new Set(
              data.map(
                item =>
                  item.categoryName ||
                  'Kategori Yok'
              )
            )
          ]

          uniqueCategories.forEach(name => {
            categories[name] = true
          })

          setExpandedCategories(categories)
          setDataLoaded(true)
          setError(null)
          setLoading(false)
          return
        } catch (err) {
          if (Date.now() - startedAt >= timeout) {
            if (!isActive) return

            console.error(err)
            setError('Veri alinamadi. Lütfen sayfayı yenileyin.')
            setLoading(false)
            return
          }

          await wait(retryDelay)
        }
      }
    }

    if (!dataLoaded) {
      fetchData()
    }

    return () => {
      isActive = false
    }
  }, [dataLoaded])

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  {/*sıralama fonksiyonu*/ }
  const handleSort = (key) => {
    let direction = 'asc'

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc'
    }

    setSortConfig({
      key,
      direction
    })
  }
  const getSortedPerformances = (performances) => {
    if (!sortConfig.key) {
      return performances
    }

    return [...performances].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? 0
      const bValue = b[sortConfig.key] ?? 0

      if (sortConfig.direction === 'asc') {
        return aValue - bValue
      }

      return bValue - aValue
    })
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
                <div className="flex items-center gap-2">
                  Büyüklük
                  <SortButton
                    column="value"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </div>
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Fiyat
                  <SortButton
                    column="price"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </div>
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Günlük (%)
                  <SortButton
                    column="dailyChange"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </div>
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Haftalık (%)
                  <SortButton
                    column="weeklyChange"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </div>
              </th>

              <th className="py-1 px-[5px] text-left font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Aylık (%)
                  <SortButton
                    column="monthlyChange"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  <div className="h-[500px] flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="6"
                  className="h-[500px] text-center text-red-500"
                >
                  Hata: {error}
                </td>
              </tr>
            ) : performanceData.map(category => (
              <React.Fragment key={category.id?.timestamp}>
                <tr
                  className="bg-green-100 font-semibold text-green-900 cursor-pointer border-b border-gray-200"
                  onClick={() => toggleCategory(category.categoryName)}
                >
                  <td className="py-[15px] px-[15px] text-[15px]">
                    <div className="flex items-center gap-[10px]">
                      <span
                        className={`inline-block text-[12px] transition-transform duration-300 ${expandedCategories[category.categoryName]
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
                  getSortedPerformances(category.performances).map(row => (
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
