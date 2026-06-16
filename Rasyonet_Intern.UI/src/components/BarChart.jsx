import { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

function BarChart() {
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
        am5xy.XYChart.new(root, {})
      )

    const xAxis =
      chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'category',
          renderer:
            am5xy.AxisRendererX.new(root, {})
        })
      )

    const yAxis =
      chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer:
            am5xy.AxisRendererY.new(root, {})
        })
      )

    const series =
      chart.series.push(
        am5xy.ColumnSeries.new(root, {
          xAxis,
          yAxis,
          categoryXField: 'category',
          valueYField: 'value'
        })
      )

    xAxis.data.setAll(chartData)
    series.data.setAll(chartData)

    return () => root.dispose()
  }, [])

  return (
    <div className="bg-white rounded-lg p-5 shadow mb-5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-5">
        Kategori Karşılaştırması
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

export default BarChart