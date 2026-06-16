import NavigationButton from '../components/NavigationButton'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import LineChart from '../components/LineChart'

function ChartsPage() {
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

      <PieChart />

      <BarChart />

      <LineChart />
    </div>
  )
}

export default ChartsPage