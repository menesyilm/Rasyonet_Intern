import { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'

function PieChart() {
  const chartRef = useRef()

  const chartData = [
    { category: 'Alternatif', value: 43.48 },
    { category: 'Borsa Yatırım Fonları', value: 19.53 },
    { category: 'Değişken', value: 13.2 },
    { category: 'Borçlanma Araçları', value: 10.92 },
    { category: 'Para Piyasası', value: 6.71 },
    { category: 'Katılım', value: 5.29 },
    { category: 'Karma', value: 0.87 }
  ]

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current)

    const chart =
      root.container.children.push(
        am5percent.PieChart.new(root, {})
      )

    const series =
      chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'value',
          categoryField: 'category'
        })
      )

    series.data.setAll(chartData)

    return () => root.dispose()
  }, [])

  return (
    <div className="bg-white rounded-lg p-5 shadow mb-5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-5">
        Portföy Dağılımı
      </h2>

      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '500px'
        }}
      />
    </div>
  )
}

export default PieChart