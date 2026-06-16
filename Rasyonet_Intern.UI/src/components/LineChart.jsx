import { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

function LineChart() {
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

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {})
    )

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    )

    // Uzun kategori isimleri için etiketleri döndür
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

    // Noktaları görünür yapmak istersen
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