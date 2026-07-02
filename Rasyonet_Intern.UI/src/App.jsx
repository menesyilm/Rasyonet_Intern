import { Routes, Route } from 'react-router-dom'
import PerformancePage from './pages/PerformancePage'
import ChartsPage from './pages/ChartsPage'
import AiExperimentReportPage from '../reports/AiExperimentReportPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<PerformancePage />}
      />

      <Route
        path="/charts"
        element={<ChartsPage />}
      />

      <Route
        path="/report"
        element={<AiExperimentReportPage />}
      />
    </Routes>

  )
}

export default App