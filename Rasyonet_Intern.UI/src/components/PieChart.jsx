import { useLayoutEffect, useRef, useState } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import {
  HiOutlineChartPie,
  HiOutlineTableCells
} from 'react-icons/hi2'

function PieChart({ chartData, isLoading }) {
  const chartRef = useRef(null)
  const [view, setView] = useState('pie')

  useLayoutEffect(() => {
    if (isLoading) return
    if (!chartData.length || !chartRef.current) return
    if (view !== 'pie') return

    const root = am5.Root.new(chartRef.current)

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {})
    )

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category'
      })
    )

    series.labels.template.setAll({
      text: '%{valuePercentTotal.formatNumber("#.00")}'
    })

    series.data.setAll(chartData)

    return () => {
      root.dispose()
    }
  }, [view, chartData, isLoading])

  return (
    <div className="bg-white rounded-lg p-5 shadow mb-5">
      <div className="flex justify-between items-center mb-5 border-b pb-3 border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700">
          Ödeme Yöntemine Göre Dağılım
        </h2>

        <div className="flex bg-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('pie')}
            className={`p-3 transition ${view === 'pie'
              ? 'bg-white shadow'
              : ''
              }`}
          >
            <HiOutlineChartPie
              size={24}
              className="text-blue-600"
            />
          </button>

          <button
            onClick={() => setView('table')}
            className={`p-3 transition ${view === 'table'
              ? 'bg-white shadow'
              : ''
              }`}
          >
            <HiOutlineTableCells
              size={24}
              className="text-gray-500"
            />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[500px] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          {view === 'pie' && (
            <div
              ref={chartRef}
              style={{
                width: '100%',
                height: '500px'
              }}
            />
          )}

          {view === 'table' && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-black">
                    Ödeme Yöntemi
                  </th>

                  <th className="p-3 text-right text-black">
                    Toplam Satış
                  </th>

                  <th className="p-3 text-right text-black">
                    Sipariş Sayısı
                  </th>
                </tr>
              </thead>

              <tbody>
                {chartData.map(item => {
                  const total = chartData.reduce(
                    (sum, x) => sum + x.value,
                    0
                  )

                  const percentage = (
                    (item.value / total) *
                    100
                  ).toFixed(2)

                  return (
                    <tr
                      key={item.category}
                      className="border-b"
                    >
                      <td className="p-3 text-gray-500">
                        {item.category}
                      </td>

                      <td className="p-3 text-right text-gray-500">
                        ₺
                        {Number(item.value).toLocaleString(
                          'tr-TR',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                      </td>

                      <td className="p-3 text-right text-gray-500">
                        {item.orderCount} (%{percentage})
                      </td>
                    </tr>
                  )
                })}

                <tr className="font-bold bg-black/70">
                  <td className="p-3 text-white">
                    Toplam
                  </td>

                  <td className="p-3 text-right text-white">
                    ₺
                    {Number(
                      chartData.reduce(
                        (sum, x) => sum + x.value,
                        0
                      )
                    ).toLocaleString('tr-TR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>

                  <td className="p-3 text-right text-white">
                    {chartData.reduce(
                      (sum, x) => sum + x.orderCount,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
export default PieChart