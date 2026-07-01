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

  //Bağlantı durumu: connecting, connected, reconnecting, disconnected
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
    //yenilenme sorunu showloading ile çözüldü. showloading false olursa grafik loading ekranına dönmez.
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
        //Veri şu satırda state’e yazılıyor:
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
        //Veri şu satırda state’e yazılıyor:
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
        //Veri şu satırda state’e yazılıyor:
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
        //Veri şu satırda state’e yazılıyor:
        setData: setLineData,
        setLoading: setLineLoading,
        setError: setLineError,
        showLoading
      })
    ])
  }, [loadChart])
  //ilk veri çekimi yapılan yer ve loadAllChart fonksiyonu burada çağrılıyor. showLoading true olursa grafik loading ekranına döner.
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
    // Bu flag, component hâlâ ekranda mı kontrol etmek için.
    let isConnectionActive = true
    // Aynı anda birden fazla connection.start() çağrılmasını engeller.
    let isStarting = false
    // Manuel reconnect denemeleri arasındaki bekleme süresi.
    const retryConnectionDelay = 3000
    // Bağlantı koparsa 3 saniye sonra yeniden bağlanmayı denemek için kullanılır.
    const scheduleReconnect = () => {
      clearTimeout(reconnectTimeoutRef.current)

      reconnectTimeoutRef.current = setTimeout(() => {
        if (isConnectionActive) {
          startConnection()
        }
      }, retryConnectionDelay)
    }

    // SignalR bağlantısını gerçekten başlatan fonksiyon.
    const startConnection = async () => {
      // Eğer component kapanmışsa veya zaten bağlantı başlatılıyorsa tekrar başlatma.
      if (!isConnectionActive || isStarting) return

      try {
        isStarting = true
        // UI'daki SignalR badge "Bağlanıyor" durumuna geçer.
        setSignalRStatus('connecting')
        // SignalR bağlantısı burada başlıyor.
        // Dikkat: createDashboardConnection sadece connection nesnesi oluşturur.
        // Gerçek bağlantı burada başlar.
        await connection.start()

        if (isConnectionActive) {
          // Bağlantı başarılıysa badge "Connected" olur.
          setSignalRStatus('connected')
          // Bağlantı kurulduktan sonra chart datasını sessizce yeniliyorsun.
          //
          // 
          // ÖNEMLİ ÇÖZÜM
          // Bu durumda grafik datası sessizce yenilenir, ama grafik loading ekranına dönmez.
          loadAllCharts({ showLoading: false })
        }
      } catch (error) {
        console.error('SignalR bağlantı hatası:', error)

        if (isConnectionActive) {
          // Bağlantı kurulamadıysa status disconnected olur.
          setSignalRStatus('disconnected')
          // 3 saniye sonra tekrar bağlanmayı dene.
          scheduleReconnect()
        }
      } finally {
        isStarting = false
      }
    }

    connection.on('salesChartsInvalidated', () => {
      clearTimeout(refreshTimeoutRef.current)

      refreshTimeoutRef.current = setTimeout(() => {
        //
        // 
        // ÖNEMLİ ÇÖZÜM
        // Bu durumda grafik datası sessizce yenilenir, ama grafik loading ekranına dönmez.
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

  // ... importlar aynı

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-green-600">
          Grafikler
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <SignalRStatusBadge status={signalRStatus} />

          <NavigationButton
            to="/"
            text="Performans Sayfası"
          />
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5">
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

        <div className="lg:col-span-2">
          <LineChart
            chartData={lineData}
            isLoading={lineLoading}
            error={lineError}
          />
        </div>
      </div>
    </div>
  )
}

export default ChartsPage
