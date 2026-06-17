import { useEffect, useState } from 'react'
import NavigationButton from '../components/NavigationButton'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import LineChart from '../components/LineChart'
import { getChartData } from '../services/api'

function ChartsPage() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getChartData()
        setChartData(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
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
        {error}
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

      <PieChart chartData={chartData} />

      <BarChart chartData={chartData} />

      <LineChart chartData={chartData} />
    </div>
  )
}

export default ChartsPage