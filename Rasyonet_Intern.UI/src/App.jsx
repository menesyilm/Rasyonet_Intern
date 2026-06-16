import { Routes, Route } from 'react-router-dom'
import PerformancePage from './pages/PerformancePage'
import ChartsPage from './pages/ChartsPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<PerformancePage />}
      />

      <Route
        path="/charts"
        element={<ChartsPage/>}
      />
    </Routes>
  )
}

export default App