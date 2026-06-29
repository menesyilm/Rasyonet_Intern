// @microsoft/signalr paketi, React/JavaScript tarafında SignalR bağlantısı kurmamızı sağlar.
//
// Backend tarafında:
// DashboardHub : Hub
import * as signalR from '@microsoft/signalr'
const SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL ?? 'http://localhost:5010/hubs/dashboard'

// Neden fonksiyon olarak yazıyoruz?
// Çünkü bağlantı oluşturma sorumluluğunu component'lerden ayırıyoruz.
// Böylece Dashboard, Chart veya başka component'lerde tekrar tekrar aynı SignalR ayarlarını yazmayız.
export const createDashboardConnection = () => {
    return new signalR.HubConnectionBuilder()
        // Backend'deki SignalR Hub endpoint adresidir.
        .withUrl(SIGNALR_URL)
        // Bağlantı koparsa SignalR'ın otomatik tekrar bağlanmayı denemesini sağlar.
        // - API kısa süreliğine kapanıp açılırsa
        // - Network anlık koparsa
        // - Sayfa açıkken backend restart edilirse
        .withAutomaticReconnect()
        // build() sadece connection nesnesini oluşturur.
        // Bağlantıyı başlatmaz.
        .build()
}