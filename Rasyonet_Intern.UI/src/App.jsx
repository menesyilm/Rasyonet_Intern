import { Routes, Route } from 'react-router-dom'
import PerformancePage from './pages/PerformancePage'
import ChartsPage from './pages/ChartsPage'
import AiExperimentReportPage from '../reports/AiExperimentReportPage'
import Gpt54FonPage from '../reports/gpt_5_4_test/FonPage'
import Gpt54YonetimUcretiDegisiklikleriPage from '../reports/gpt_5_4_test/YonetimUcretiDegisiklikleriPage'
import Gpt55FonPage from '../reports/gpt_5_5_test/FonPage'
import Gpt55YonetimUcretiDegisiklikleriPage from '../reports/gpt_5_5_test/YonetimUcretiDegisiklikleriPage'
import Haiku45FonPage from '../reports/haiku_4_5_test/FonPage'
import Haiku45YonetimUcretiDegisiklikleriPage from '../reports/haiku_4_5_test/YonetimUcretiDegisiklikleriPage'

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

      <Route
        path="/yonetim-ucreti-degisiklikleri"
        element={<Gpt54YonetimUcretiDegisiklikleriPage />}
      />

      <Route
        path="/reports/gpt_5_4_test/fon"
        element={<Gpt54FonPage />}
      />

      <Route
        path="/reports/gpt_5_4_test/yonetim-ucreti-degisiklikleri"
        element={<Gpt54YonetimUcretiDegisiklikleriPage />}
      />

      <Route
        path="/reports/gpt_5_5_test/fon"
        element={<Gpt55FonPage />}
      />

      <Route
        path="/reports/gpt_5_5_test/yonetim-ucreti-degisiklikleri"
        element={<Gpt55YonetimUcretiDegisiklikleriPage />}
      />

      <Route
        path="/reports/haiku_4_5_test/fon"
        element={<Haiku45FonPage />}
      />

      <Route
        path="/reports/haiku_4_5_test/yonetim-ucreti-degisiklikleri"
        element={<Haiku45YonetimUcretiDegisiklikleriPage />}
      />
    </Routes>

  )
}

export default App
