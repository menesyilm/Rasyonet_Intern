import { API_BASE_URL } from '@/constants/api'
import { Category } from '@/types/category'
import { getAccessToken } from '@/services/tokenStorage'

export class AuthRequiredError extends Error {
    constructor(message = 'Oturum süresi doldu.') {
        super(message)
        this.name = 'AuthRequiredError'
        Object.setPrototypeOf(this, AuthRequiredError.prototype)
    }
}

export function isAuthRequiredError(error: unknown) {
    return (
        error instanceof AuthRequiredError ||
        (error instanceof Error && error.name === 'AuthRequiredError')
    )
}

export async function getCategories(): Promise<Category[]> {
    const token = await getAccessToken()

    if (!token) {
        throw new AuthRequiredError()
    }

    const response = await fetch(`${API_BASE_URL}/Categories`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.status === 401 || response.status === 403) {
        throw new AuthRequiredError()
    }

    if (!response.ok) {
        throw new Error('Kategoriler alınamadı.')
    }
    return response.json()
}
//Screen içinde fetch yazmıyoruz.
//API çağrısını service katmanına alıyoruz.
