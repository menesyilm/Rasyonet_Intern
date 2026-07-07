import { Platform } from 'react-native';

const NATIVE_API_BASE_URL = 'http://192.168.88.173:5010/api';
const WEB_API_BASE_URL = 'http://localhost:5010/api';

export const API_BASE_URL =
    Platform.OS === 'web' ? WEB_API_BASE_URL : NATIVE_API_BASE_URL;
