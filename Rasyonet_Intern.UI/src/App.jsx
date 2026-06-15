import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})

  useEffect(() => {
    const fetchFonData = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5010/api/fons')
        
        if (!response.ok) {
          throw new Error('Veri çekilemedi')
        }
        
        const data = await response.json()
        setPerformanceData(data)
        
        const categories = {}
        const uniqueCategories = [...new Set(data.map(item => item.kategoriAdi))]
        uniqueCategories.forEach(adi => {
        categories[adi] = true
          })
        setExpandedCategories(categories)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Hata:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFonData()
  }, [])

  const toggleCategory = (kategoriId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [kategoriId]: !prev[kategoriId]
    }))
  }

 const groupedData = performanceData.reduce((acc, item) => {
  const key = item.kategoriAdi  // fonKategoriId yerine kategoriAdi kullan
  if (!acc[key]) {
    acc[key] = {
      kategoriAdi: item.kategoriAdi,
      fonlar: [],
      toplamBuyukluk: 0
    }
  }
  acc[key].fonlar.push(item)
  acc[key].toplamBuyukluk += item.buyukluk || 0
  return acc
}, {})

  if (loading) {
    return (
      <div className="app-container">
        <div className="table-wrapper">
          <h1 className="table-title">Performans</h1>
          <p>Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="table-wrapper">
          <h1 className="table-title">Performans</h1>
          <p style={{ color: 'red' }}>Hata: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="table-wrapper">
        <h1 className="table-title">Performans</h1>
        <table className="performance-table">
          <thead>
            <tr>
              <th>Fon Kodu</th>
              <th>Büyüklük</th>
              <th>Fiyat</th>
              <th>Günlük (%)</th>
              <th>Haftalık (%)</th>
              <th>Aylık (%)</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedData).map((category) => (
              <React.Fragment key={category.kategoriAdi}>
                {/* Kategori Başlığı - 6 ayrı hücre */}
                <tr
                  className="category-row"
                  onClick={() => toggleCategory(category.kategoriAdi)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="category-header">
                    <span className={`dropdown-arrow ${expandedCategories[category.kategoriAdi] ? 'open' : ''}`}>
                      ▶
                    </span>
                    {category.kategoriAdi}
                  </td>
                  <td className="category-total">
                    {category.toplamBuyukluk.toLocaleString('tr-TR')}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                {/* Fonlar */}
                {expandedCategories[category.kategoriAdi] && category.fonlar.map((row) => (
                  <tr key={row.fonPerformansId} className="data-row">
                    <td className="code-cell">
                      <div className="fon-code">{row.fonKodu}</div>
                      <div className="fon-adi">{row.fonAdi}</div>
                    </td>
                    <td className="number-cell">{row.buyukluk?.toLocaleString('tr-TR') || '-'}</td>
                    <td className="number-cell">{row.fiyat?.toFixed(6) || '-'}</td>
                    <td className="number-cell">{row.gunlukDegisimYuzde?.toFixed(4) || '-'}</td>
                    <td className="number-cell">{row.haftalikDegisimYuzde?.toFixed(4) || '-'}</td>
                    <td className="number-cell">{row.aylikDegisimYuzde?.toFixed(4) || '-'}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App