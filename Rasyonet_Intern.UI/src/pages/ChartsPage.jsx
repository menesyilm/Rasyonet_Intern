import { useCallback, useEffect, useRef, useState } from 'react'
import { getPurchaseMethodData, getStoreLocationData, getMonthlyTrendData } from '../services/api'
import { createDashboardConnection } from '../services/signalr'
import NavigationButton from '../components/NavigationButton'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import LineChart from '../components/LineChart'
import SignalRStatusBadge from '../components/SignalRStatusBadge'

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
  const [signalRStatus, setSignalRStatus] = useState('connecting')

  const isActiveRef = useRef(true)
  const refreshTimeoutRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const retryDelay = 2000
  const timeout = 15000

  const wait = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms))

  const loadChart = useCallback(async ({
    request,
    mapData,
    setData,
    setLoading,
    setError,
    showLoading = true
  }) => {
    const startedAt = Date.now()

    if (showLoading) {
      setLoading(true)
    }

    setError(null)

    while (isActiveRef.current) {
      try {
        const data = await request()

        if (!isActiveRef.current) return

        setData(mapData(data))

        if (showLoading) {
          setLoading(false)
        }

        return
      } catch (err) {
        if (Date.now() - startedAt >= timeout) {
          if (!isActiveRef.current) return

          console.error(err)

          if (showLoading) {
            setError('Veri alinamadi. Lütfen sayfayı yenileyin.')
            setLoading(false)
          }

          return
        }

        await wait(retryDelay)
      }
    }
  }, [])

  const loadAllCharts = useCallback(async ({ showLoading = true } = {}) => {
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
        setError: setPieError,
        showLoading
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
        setError: setBarError,
        showLoading
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
        setError: setLineError,
        showLoading
      })
    ])
  }, [loadChart])

  useEffect(() => {
    isActiveRef.current = true

    loadAllCharts({ showLoading: true })

    return () => {
      isActiveRef.current = false
      clearTimeout(refreshTimeoutRef.current)
      clearTimeout(reconnectTimeoutRef.current)
    }
  }, [loadAllCharts])

  useEffect(() => {
    const connection = createDashboardConnection()
    let isConnectionActive = true
    let isStarting = false
    const retryConnectionDelay = 3000

    const scheduleReconnect = () => {
      clearTimeout(reconnectTimeoutRef.current)

      reconnectTimeoutRef.current = setTimeout(() => {
        if (isConnectionActive) {
          startConnection()
        }
      }, retryConnectionDelay)
    }

    const startConnection = async () => {
      if (!isConnectionActive || isStarting) return

      try {
        isStarting = true
        setSignalRStatus('connecting')
        await connection.start()

        if (isConnectionActive) {
          setSignalRStatus('connected')
          loadAllCharts({ showLoading: false })
        }
      } catch (error) {
        console.error('SignalR bağlantı hatası:', error)

        if (isConnectionActive) {
          setSignalRStatus('disconnected')
          scheduleReconnect()
        }
      } finally {
        isStarting = false
      }
    }

    connection.on('salesChartsInvalidated', () => {
      clearTimeout(refreshTimeoutRef.current)

      refreshTimeoutRef.current = setTimeout(() => {
        loadAllCharts({ showLoading: false })
      }, 500)
    })

    connection.onreconnecting(() => {
      if (isConnectionActive) {
        setSignalRStatus('reconnecting')
      }
    })

    connection.onreconnected(() => {
      if (isConnectionActive) {
        setSignalRStatus('connected')
        loadAllCharts({ showLoading: false })
      }
    })

    connection.onclose(() => {
      if (isConnectionActive) {
        setSignalRStatus('disconnected')
        scheduleReconnect()
      }
    })

    startConnection()

    return () => {
      isConnectionActive = false
      clearTimeout(refreshTimeoutRef.current)
      clearTimeout(reconnectTimeoutRef.current)
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

        <div className="flex items-center gap-3">
          <SignalRStatusBadge status={signalRStatus} />

          <NavigationButton
            to="/"
            text="Performans Sayfası"
          />
        </div>
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
