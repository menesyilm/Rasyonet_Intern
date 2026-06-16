import { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

function LineChart() {
  const chartRef = useRef()

  const lineData = [
    {
      period: 'Günlük',
      value: 1.2
    },
    {
      period: 'Haftalık',
      value: 4.7
    },
    {
      period: 'Aylık',
      value: 7.8
    }
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
          categoryField: 'period',
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
        am5xy.LineSeries.new(root, {
          xAxis,
          yAxis,
          categoryXField: 'period',
          valueYField: 'value'
        })
      )

    xAxis.data.setAll(lineData)
    series.data.setAll(lineData)

    return () => root.dispose()
  }, [])

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