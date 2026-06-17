const API_URL = 'http://localhost:5010/api'

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`)

  if (!response.ok) {
    throw new Error('Kategoriler alınamadı')
  }

  return await response.json()
}

export const getChartData = async () => {
  const response = await fetch(
    `${API_URL}/categories/chart`
  )

  if (!response.ok) {
    throw new Error('Chart verisi alınamadı')
  }

  return await response.json()
}