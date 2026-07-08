const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5010/api'

const CHART_BASE_URL = `${API_BASE_URL}/Categories/public`
const SALES_BASE_URL = `${API_BASE_URL}/Sales/chart`

export const getCategories = async () => {
  const response = await fetch(
    `${CHART_BASE_URL}`
  )

  if (!response.ok) {
    throw new Error('Kategoriler alınamadı.')
  }

  return await response.json()
}

export const getPurchaseMethodData = async () => {
  const response = await fetch(
    `${SALES_BASE_URL}/by-purchase-method`
  )

  if (!response.ok) {
    throw new Error('Ödeme yöntemi verileri alınamadı.')
  }

  return await response.json()
}

export const getStoreLocationData = async () => {
  const response = await fetch(
    `${SALES_BASE_URL}/by-store-location`
  )

  if (!response.ok) {
    throw new Error('Mağaza verileri alınamadı.')
  }

  return await response.json()
}

export const getMonthlyTrendData = async () => {
  const response = await fetch(
    `${SALES_BASE_URL}/monthly-trend`
  )

  if (!response.ok) {
    throw new Error('Aylık trend verileri alınamadı.')
  }

  return await response.json()
}
