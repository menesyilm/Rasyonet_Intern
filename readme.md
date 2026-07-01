# Rasyonet Intern

Rasyonet Intern, ASP.NET Core Web API ve React/Vite tabanli bir dashboard uygulamasidir. Proje; MSSQL ve MongoDB uzerinden satis/kategori verilerini yonetir, grafik verilerini API ile sunar, MongoDB degisikliklerini SignalR ile frontend'e anlik bildirir ve Docker Compose ile tum servisleri birlikte calistirabilir.

## Icerik

- ASP.NET Core 8 Web API
- React 19 + Vite frontend
- MSSQL veri tabani
- MongoDB document store
- MongoDB Change Stream ile degisiklik takibi
- SignalR ile realtime chart yenileme
- MemoryCache ve cache invalidation
- Quartz ile zamanlanmis SQL -> MongoDB senkronizasyonu
- NUnit backend testleri
- Jest/Testing Library frontend testleri
- k6 stres testi
- Docker ve Docker Compose destegi

## Proje Yapisi

```text
.
|-- Rasyonet_Intern.API/       # ASP.NET Core Web API
|-- Rasyonet_Intern.UI/        # React + Vite frontend
|-- Rasyonet_Intern.Test/      # NUnit backend testleri
|-- stress-test/               # k6 yuk testi
|-- docker-compose.yml         # API, UI, MSSQL, MongoDB servisleri
|-- Rasyonet_Intern.slnx       # .NET solution
|-- INTERNSHIP_SUMMARY.md      # Staj sureci teknik ozeti
`-- Readme.md
```

## Teknolojiler

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- MongoDB.Driver
- AutoMapper
- SignalR
- Quartz
- OpenTelemetry
- Swagger
- MemoryCache

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- amCharts 5
- SignalR JavaScript Client
- Jest
- Testing Library

### Altyapi ve Test

- Docker
- Docker Compose
- NUnit
- Moq
- FluentAssertions
- k6

## Uygulama Akisi

1. Backend, MSSQL ve MongoDB baglantilarini kurar.
2. API, kategori ve satis verilerini controller'lar uzerinden disari acar.
3. Chart endpointleri sik kullanildigi icin MemoryCache ile cache'lenir.
4. MongoDB Change Stream, veri degisikliklerini izler.
5. Veri degistiginde ilgili cache anahtarlari temizlenir.
6. SignalR hub, frontend'e `salesChartsInvalidated` bildirimi gonderir.
7. Frontend chart verilerini sessizce yeniden ceker ve ekrani gunceller.
8. Quartz job, her gun saat 10:00'da MSSQL'den MongoDB'ye senkronizasyon calistiracak sekilde ayarlanmistir.

## Sayfalar

- `/`: Performans sayfasi. Kategori bazli performans tablosu, acilir kategori satirlari ve siralama kontrolleri icerir.
- `/charts`: Grafik sayfasi. Odeme yontemi, magazaya gore satis ve aylik satis trendi grafiklerini gosterir. SignalR baglanti durumu bu sayfada izlenebilir.

## API Endpointleri

Varsayilan Docker ortaminda API adresi:

```text
http://localhost:5010
```

Baslica endpointler:

```text
GET /health
GET /swagger
GET /api/Categories
GET /api/Categories/chart
GET /api/Sales
GET /api/Sales/{id}
GET /api/Sales/chart/by-store-location
GET /api/Sales/chart/by-purchase-method
GET /api/Sales/chart/monthly-trend
GET /hubs/dashboard
```

## Docker ile Calistirma

On kosullar:

- Docker Desktop
- Docker Compose

Kok dizinde calistirin:

```bash
docker compose up --build
```

Servisler:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5010
Swagger:  http://localhost:5010/swagger
MSSQL:    localhost:1433
MongoDB:  localhost:27017
```

Container'lari durdurmak icin:

```bash
docker compose down
```

Volume'leri de silmek isterseniz:

```bash
docker compose down -v
```

## Lokal Gelistirme

### Backend

On kosullar:

- .NET 8 SDK
- SQL Server
- MongoDB replica set olarak calisan lokal MongoDB

API ayarlari `Rasyonet_Intern.API/appsettings.json` icindedir:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017/?replicaSet=rs0",
    "DatabaseName": "Rasyonet_Intern"
  },
  "SqlDbSettings": {
    "ConnectionString": "Server=Enes\\SQLEXPRESS;Database=Rasyonet_Intern;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Calistirma:

```bash
dotnet restore
dotnet run --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj
```

Migration uygulamak icin:

```bash
dotnet ef database update --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj
```

MongoDB'den MSSQL'e manuel veri aktarimi icin:

```bash
dotnet run --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj -- --migrate-mongo-to-sql
```

### Frontend

On kosullar:

- Node.js
- npm

Kurulum ve calistirma:

```bash
cd Rasyonet_Intern.UI
npm install
npm run dev
```

Varsayilan frontend adresi:

```text
http://localhost:5173
```

Frontend ortam degiskenleri:

```text
VITE_API_BASE_URL=http://localhost:5010/api
VITE_SIGNALR_URL=http://localhost:5010/hubs/dashboard
```

## Testler

### Backend Testleri

```bash
dotnet test
```

Sadece test projesini calistirmak icin:

```bash
dotnet test Rasyonet_Intern.Test/Rasyonet_Intern.TEST.csproj
```

### Frontend Testleri

```bash
cd Rasyonet_Intern.UI
npm test
```

Lint:

```bash
cd Rasyonet_Intern.UI
npm run lint
```

Build:

```bash
cd Rasyonet_Intern.UI
npm run build
```

### Stres Testi

On kosul: k6 kurulu olmali ve API `http://localhost:5010` uzerinden calisiyor olmali.

```bash
k6 run stress-test/load-test.js
```

Stres testi su endpointleri hedefler:

```text
/api/Sales/chart/by-store-location
/api/Sales/chart/by-purchase-method
/api/Sales/chart/monthly-trend
```

## Docker Servisleri

`docker-compose.yml` icindeki servisler:

- `backend`: ASP.NET Core API, host portu `5010`, container portu `8080`
- `frontend`: Vite frontend, port `5173`
- `mssql`: SQL Server 2022, port `1433`
- `mongodb`: MongoDB 7.0, replica set `rs0`, port `27017`

Kalici veriler Docker volume'lerinde tutulur:

- `mssql_data`
- `mongodb_data`

## Dikkat Edilecek Noktalar

- MongoDB Change Stream kullanildigi icin MongoDB'nin replica set modunda calismasi gerekir.
- Docker ortaminda backend, MongoDB'ye `mongodb:27017` servis adi ile baglanir.
- Frontend tarayicida calistigi icin API'ye `http://localhost:5010` uzerinden gider.
- SignalR icin CORS ayari `http://localhost:5173` origin'ine izin verecek sekilde yapilandirilmistir.
- OpenTelemetry OTLP exporter varsayilan olarak `http://localhost:4317` adresine veri gondermeye calisir.

## Lisans

Bu proje staj calismasi kapsaminda gelistirilmistir.
