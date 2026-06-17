import { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

function LineChart({ chartData }) {
  const chartRef = useRef(null)

  useLayoutEffect(() => {
    if (!chartData.length) return

    const root = am5.Root.new(chartRef.current)

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {})
    )

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    )

    xAxis.get('renderer').labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingTop: 10
    })

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    )

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis,
        yAxis,
        categoryXField: 'category',
        valueYField: 'value',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{categoryX}: {valueY}'
        })
      })
    )

    series.bullets.push(() => {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: series.get('fill')
        })
      })
    })

    xAxis.data.setAll(chartData)
    series.data.setAll(chartData)

    return () => {
      root.dispose()
    }
  }, [chartData])

  return (
    <div className="bg-white rounded-lg p-5 shadow">
      <h2 className="text-2xl font-semibold text-gray-700 mb-5">
        Fon Performans Değişimi
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

export default LineChart