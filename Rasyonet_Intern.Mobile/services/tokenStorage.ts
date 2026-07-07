import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';

function canUseWebStorage() {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export async function saveAccessToken(token: string) {
    if (Platform.OS === 'web' && canUseWebStorage()) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
        return;
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
    if (Platform.OS === 'web' && canUseWebStorage()) {
        return window.localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function removeAccessToken() {
    if (Platform.OS === 'web' && canUseWebStorage()) {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        return;
    }

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}
