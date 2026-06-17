import { useLayoutEffect, useRef, useState } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'

function BarChart() {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Backend endpoint'ini çağır ve veriyi çek
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5010/api/sales/chart/by-store-location')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Backend'den gelen veriyi chart'ın anlayacağı formata dönüştür
        // Backend: { storeLocation, totalSales, orderCount }
        // Chart beklediği: { category, value }
        const mappedData = data.map(item => ({
          category: item.storeLocation,        // X ekseni (mağaza adı)
          value: item.totalSales,              // Y ekseni (toplam satış)
          orderCount: item.orderCount          // Bonus bilgi (isterseniz tooltip'te gösterebilirsiniz)
        }))

        setChartData(mappedData)
        setError(null)
      } catch (err) {
        console.error('Veri çekme hatası:', err)
        setError(err.message)
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Chart render işlemi
  useLayoutEffect(() => {
    if (!chartData.length || !chartRef.current) return

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

    xAxis.data.setAll(chartData)
    series.data.setAll(chartData)

    return () => {
      root.dispose()
    }
  }, [chartData])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-5 shadow mb-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">
          Mağaza Lokasyonuna Göre Satış
        </h2>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-5 shadow mb-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">
          Mağaza Lokasyonuna Göre Satış
        </h2>
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500">Hata: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-5 shadow mb-5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-5">
        Mağaza Lokasyonuna Göre Satış
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