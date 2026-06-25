import { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

function BarChart({ chartData, isLoading, error }) {
  const chartRef = useRef(null)
  const rootRef = useRef(null)
  const xAxisRef = useRef(null)
  const seriesRef = useRef(null)

  useLayoutEffect(() => {
    if (isLoading) return
    if (error) return
    if (!chartRef.current) return
    if (rootRef.current) return

    const root = am5.Root.new(chartRef.current)
    rootRef.current = root

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {})
    )

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    )

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        categoryXField: 'category',
        valueYField: 'value'
      })
    )

    xAxisRef.current = xAxis
    seriesRef.current = series

    return () => {
      root.dispose()
      rootRef.current = null
      xAxisRef.current = null
      seriesRef.current = null
    }
  }, [isLoading, error])

  useLayoutEffect(() => {
    if (isLoading) return
    if (error) return
    if (!chartData.length) return
    if (!xAxisRef.current || !seriesRef.current) return

    xAxisRef.current.data.setAll(chartData)
    seriesRef.current.data.setAll(chartData)
  }, [chartData, isLoading, error])

  return (
    <div className="bg-white rounded-lg p-5 shadow mb-5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-5">
        Mağaza Lokasyonuna Göre Satış
      </h2>

      {isLoading ? (
        <div className="h-[500px] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="h-[500px] flex justify-center items-center text-red-500">
          Hata: {error}
        </div>
      ) : (
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '500px'
          }}
        />
      )}
    </div>
  )
}

export default BarChart