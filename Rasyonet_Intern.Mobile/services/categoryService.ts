import { API_BASE_URL } from '@/constants/api'
import { Category } from '@/types/category'

export async function getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/Categories`)

    if (!response.ok) {
        throw new Error('Kategoriler alınamadı.')
    }
    return response.json()
}
//Screen içinde fetch yazmıyoruz.
//API çağrısını service katmanına alıyoruz.