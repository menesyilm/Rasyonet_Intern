import { useEffect, useState } from 'react'
import { getPurchaseMethodData, getStoreLocationData, getMonthlyTrendData } from '../services/api'
import NavigationButton from '../components/NavigationButton'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import LineChart from '../components/LineChart'

function ChartsPage() {
  const [pieData, setPieData] = useState([])
  const [barData, setBarData] = useState([])
  const [lineData, setLineData] = useState([])

  const [error, setError] = useState(null)

  const [pieLoading, setPieLoading] = useState(true)
  const [barLoading, setBarLoading] = useState(true)
  const [lineLoading, setLineLoading] = useState(true)

  useEffect(() => {
    getPurchaseMethodData()
      .then(data => {
        setPieData(
          data.map(item => ({
            category: item.purchaseMethod, value: item.totalSales, orderCount: item.orderCount
          }))
        )
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setPieLoading(false)
      })

    getStoreLocationData()
      .then(data => {
        setBarData(
          data.map(item => ({
            category: item.storeLocation, value: item.totalSales, orderCount: item.orderCount
          }))
        )
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setBarLoading(false)
      })

    getMonthlyTrendData()
      .then(data => {
        setLineData(
          data.map(item => ({
            period: item.period, value: item.totalSales, orderCount: item.orderCount
          }))
        )
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setLineLoading(false)
      })
  }, [])

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

      <PieChart
        chartData={pieData}
        isLoading={pieLoading}
      />

      <BarChart
        chartData={barData}
        isLoading={barLoading}
      />

      <LineChart
        chartData={lineData}
        isLoading={lineLoading}
      />
    </div>
  )
}
export default ChartsPage