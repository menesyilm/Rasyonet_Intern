import { useEffect, useState } from 'react'
import NavigationButton from '../components/NavigationButton'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import LineChart from '../components/LineChart'

import {
  getPurchaseMethodData,
  getStoreLocationData,
  getMonthlyTrendData
} from '../services/api'

function ChartsPage() {
  const [pieData, setPieData] = useState([])
  const [barData, setBarData] = useState([])
  const [lineData, setLineData] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [
          purchaseData,
          storeData,
          monthlyData
        ] = await Promise.all([
          getPurchaseMethodData(),
          getStoreLocationData(),
          getMonthlyTrendData()
        ])

        setPieData(
          purchaseData.map(item => ({
            category: item.purchaseMethod,
            value: item.totalSales,
            orderCount: item.orderCount
          }))
        )

        setBarData(
          storeData.map(item => ({
            category: item.storeLocation,
            value: item.totalSales,
            orderCount: item.orderCount
          }))
        )

        setLineData(
          monthlyData.map(item => ({
            period: item.period,
            value: item.totalSales,
            orderCount: item.orderCount
          }))
        )

        setError(null)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-5">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 text-red-500">
        Hata: {error}
      </div>
    )
  }

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

      <PieChart chartData={pieData} />
      <BarChart chartData={barData} />
      <LineChart chartData={lineData} />
    </div>
  )
}

export default ChartsPage