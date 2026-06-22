import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Özel metrikler
const errorRate = new Rate('errors');
const storeLatency = new Trend('store_location_ms');
const methodLatency = new Trend('purchase_method_ms');
const trendLatency = new Trend('monthly_trend_ms');

export const options = {
    stages: [
        { duration: '15s', target: 10000 }, // 15 saniyede 10bine fırla
        { duration: '30s', target: 10000 }, // 30 saniye orada tut
        { duration: '5s', target: 0 },     // bitir
    ],
    //eşikler
    thresholds: {
        // Hata oranı %5'in altında olsun
        // 100 istekte 5'ten fazla hata çıkarsa test başarısız
        errors: ['rate<0.05'],

        // Bu endpoint özelinde — %90'ı 1.5sn altında olsun
        // p(90) kullandık çünkü bu endpoint daha ağır
        monthly_trend_ms: ['p(90)<1500'],

        // Bu endpoint özelinde — %90'ı 1.5sn altında olsun
        // p(90) kullandık çünkü bu endpoint daha ağır
        purchase_method_ms: ['p(90)<1500'],

        // Bu endpoint özelinde — %90'ı 1.5sn altında olsun
        // p(90) kullandık çünkü bu endpoint daha ağır
        store_location_ms: ['p(90)<1500'],

        // Tüm endpointlerin %95'i 2sn altında olsun
        // En genel kural, hepsini kapsıyor
        http_req_duration: ['p(95)<2000'],
    },
};

const BASE = 'http://localhost:5010';

const ENDPOINTS = [
    '/api/Sales/chart/by-store-location',
    '/api/Sales/chart/by-purchase-method',
    '/api/Sales/chart/monthly-trend',
];

export default function () {
    // --- 1. by-store-location ---
    const r1 = http.get(`${BASE}${ENDPOINTS[0]}`);
    storeLatency.add(r1.timings.duration);
    check(r1, {
        'store: 200': r => r.status === 200,
        'store: <2s': r => r.timings.duration < 2000,
        'store: json array': r => {
            try { return Array.isArray(JSON.parse(r.body)); }
            catch { return false; }
        },
    });
    errorRate.add(r1.status !== 200);
    sleep(0.3);

    // --- 2. by-purchase-method ---
    const r2 = http.get(`${BASE}${ENDPOINTS[1]}`);
    methodLatency.add(r2.timings.duration);
    check(r2, {
        'method: 200': r => r.status === 200,
        'method: <2s': r => r.timings.duration < 2000,
    });
    errorRate.add(r2.status !== 200);
    sleep(0.3);

    // --- 3. monthly-trend ---
    const r3 = http.get(`${BASE}${ENDPOINTS[2]}`);
    trendLatency.add(r3.timings.duration);
    check(r3, {
        'trend: 200': r => r.status === 200,
        'trend: <2s': r => r.timings.duration < 2000,
    });
    errorRate.add(r3.status !== 200);
    sleep(1);
}