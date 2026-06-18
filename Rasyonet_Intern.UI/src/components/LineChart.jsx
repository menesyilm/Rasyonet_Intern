import { useLayoutEffect, useRef, useState } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

function LineChart({ chartData, isLoading }) {
  const chartRef = useRef(null)

  // Chart render işlemi
  useLayoutEffect(() => {
    if (!chartData.length || !chartRef.current) return

    const root = am5.Root.new(chartRef.current)

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {})
    )

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'period',
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    )

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis,
        yAxis,
        categoryXField: 'period',
        valueYField: 'value'
      })
    )

    // Çizginin stilini ayarla
    series.strokes.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0x3b82f6) // Mavi renk
    })

    // Veri noktaları (bullets)
    const bullet = am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: am5.color(0x3b82f6)
      })
    })
    series.bullets.push(() => bullet)

    xAxis.data.setAll(chartData)
    series.data.setAll(chartData)

    return () => {
      root.dispose()
    }
  }, [chartData])

  return (
    <div className="bg-white rounded-lg p-5 shadow mb-5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-5">
        Aylık Satış Trendi
      </h2>

      {isLoading ? (
        <div className="h-[500px] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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

export default LineChart