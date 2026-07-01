import { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

// Her kategori (il) için ayrılacak minimum piksel genişliği.
// Etiketler döndürülmüş olduğu için 70-80px arası rahat sığar.
const MIN_WIDTH_PER_CATEGORY = 80
const MIN_CHART_WIDTH = 320

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
      am5xy.XYChart.new(root, {
        paddingBottom: 10
      })
    )

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        })
      })
    )

    xAxis.get('renderer').labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 10,
      fontSize: 12,
      oversizedBehavior: 'truncate',
      maxWidth: 100
    })

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

    // amCharts yeni data ile genişlik değiştiğinde
    // eksen/etiketlerin doğru ölçülmesi için bir resize tetikler.
    rootRef.current?.resize()
  }, [chartData, isLoading, error])

  // Kategori sayısına göre gereken minimum genişlik.
  // Container bundan dar olursa yatay scroll devreye girer,
  // amCharts hiçbir zaman sıkışıp etiket atlamak zorunda kalmaz.
  const minWidth = Math.max(
    MIN_CHART_WIDTH,
    chartData.length * MIN_WIDTH_PER_CATEGORY
  )

  return (
    <div className="bg-white rounded-lg p-3 sm:p-5 shadow mb-5">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-3 sm:mb-5">
        Mağaza Lokasyonuna Göre Satış
      </h2>

      {isLoading ? (
        <div className="h-[280px] sm:h-[380px] lg:h-[450px] flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="h-[280px] sm:h-[380px] lg:h-[450px] flex justify-center items-center text-red-500 text-center px-2">
          Hata: {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div
            ref={chartRef}
            style={{ minWidth: `${minWidth}px` }}
            className="h-[280px] sm:h-[380px] lg:h-[450px]"
          />
        </div>
      )}
    </div>
  )
}

export default BarChart