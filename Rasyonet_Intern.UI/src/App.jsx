import { Routes, Route } from 'react-router-dom'
import PerformancePage from './pages/PerformancePage'
import PieChartPage from './pages/PieChartPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<PerformancePage />}
      />

      <Route
        path="/distribution"
        element={<PieChartPage />}
      />
    </Routes>
  )
}

export default App