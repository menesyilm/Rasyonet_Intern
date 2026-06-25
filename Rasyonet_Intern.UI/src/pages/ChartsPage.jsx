import { useCallback, useEffect, useRef, useState } from 'react'
import { getPurchaseMethodData, getStoreLocationData, getMonthlyTrendData } from '../services/api'
import { createDashboardConnection } from '../services/signalr'
import NavigationButton from '../components/NavigationButton'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import LineChart from '../components/LineChart'

function ChartsPage() {
  const [pieData, setPieData] = useState([])
  const [barData, setBarData] = useState([])
  const [lineData, setLineData] = useState([])

  const [pieError, setPieError] = useState(null)
  const [barError, setBarError] = useState(null)
  const [lineError, setLineError] = useState(null)

  const [pieLoading, setPieLoading] = useState(true)
  const [barLoading, setBarLoading] = useState(true)
  const [lineLoading, setLineLoading] = useState(true)

  const isActiveRef = useRef(true)
  const refreshTimeoutRef = useRef(null)

  const retryDelay = 2000
  const timeout = 15000

  const wait = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms))

  const loadChart = useCallback(async ({
    request,
    mapData,
    setData,
    setLoading,
    setError
  }) => {
    const startedAt = Date.now()

    setLoading(true)
    setError(null)

    while (isActiveRef.current) {
      try {
        const data = await request()

        if (!isActiveRef.current) return

        setData(mapData(data))
        setLoading(false)
        return
      } catch (err) {
        if (Date.now() - startedAt >= timeout) {
          if (!isActiveRef.current) return

          console.error(err)
          setError('Veri alinamadi. Lütfen sayfayı yenileyin.')
          setLoading(false)
          return
        }

        await wait(retryDelay)
      }
    }
  }, [])

  const loadAllCharts = useCallback(async () => {
    await Promise.all([
      loadChart({
        request: getPurchaseMethodData,
        mapData: data => data.map(item => ({
          category: item.purchaseMethod,
          value: item.totalSales,
          orderCount: item.orderCount
        })),
        setData: setPieData,
        setLoading: setPieLoading,
        setError: setPieError
      }),
      loadChart({
        request: getStoreLocationData,
        mapData: data => data.map(item => ({
          category: item.storeLocation,
          value: item.totalSales,
          orderCount: item.orderCount
        })),
        setData: setBarData,
        setLoading: setBarLoading,
        setError: setBarError
      }),
      loadChart({
        request: getMonthlyTrendData,
        mapData: data => data.map(item => ({
          period: item.period,
          value: item.totalSales,
          orderCount: item.orderCount
        })),
        setData: setLineData,
        setLoading: setLineLoading,
        setError: setLineError
      })
    ])
  }, [loadChart])

  useEffect(() => {
    isActiveRef.current = true

    loadAllCharts()

    return () => {
      isActiveRef.current = false
      clearTimeout(refreshTimeoutRef.current)
    }
  }, [loadAllCharts])

  useEffect(() => {
    const connection = createDashboardConnection()

    connection.on('salesChartsInvalidated', (event) => {
      console.log('SignalR event geldi:', event)

      clearTimeout(refreshTimeoutRef.current)

      refreshTimeoutRef.current = setTimeout(() => {
        loadAllCharts()
      }, 500)
    })

    const startConnection = async () => {
      try {
        console.log('SignalR bağlantısı başlatılıyor...')

        await connection.start()

        console.log('SignalR bağlantısı kuruldu:', connection.connectionId)
      } catch (error) {
        console.error('SignalR bağlantı hatası:', error)
      }
    }

    startConnection()

    return () => {
      connection.off('salesChartsInvalidated')
      connection.stop()
    }
  }, [loadAllCharts])

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-medium text-green-600">
          Grafikler
        </h1>

        <NavigationButton
          to="/"
          text="Performans Sayfası"
        />
      </div>

      <PieChart
        chartData={pieData}
        isLoading={pieLoading}
        error={pieError}
      />

      <BarChart
        chartData={barData}
        isLoading={barLoading}
        error={barError}
      />

      <LineChart
        chartData={lineData}
        isLoading={lineLoading}
        error={lineError}
      />
    </div>
  )
}

export default ChartsPage