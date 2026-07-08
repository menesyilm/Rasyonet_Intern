import { API_BASE_URL } from '@/constants/api';
import { AuthRequiredError } from '@/services/categoryService';
import { getAccessToken } from '@/services/tokenStorage';
import { StoreLocationSalesChartItem } from '@/types/salesChart';

export async function getStoreLocationSalesChart(): Promise<StoreLocationSalesChartItem[]> {
    const token = await getAccessToken();

    const headers: HeadersInit = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/Sales/chart/by-store-location`, {
        method: 'GET',
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        throw new AuthRequiredError();
    }

    if (!response.ok) {
        throw new Error('Satış chart verileri alınamadı.');
    }

    return response.json();
}
