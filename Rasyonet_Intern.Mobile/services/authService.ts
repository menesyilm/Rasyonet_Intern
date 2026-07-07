import { API_BASE_URL } from '@/constants/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';
import { saveAccessToken } from './tokenStorage';

async function handleResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Bir hata olustu.');
    }

    return data;
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/Users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const data: AuthResponse = await handleResponse(response);

    await saveAccessToken(data.accessToken);

    return data;
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/Users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    return await handleResponse(response);
}
