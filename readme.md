# Rasyonet Intern Dashboard

Rasyonet Intern, performans verilerini ve satış chartlarını gösteren bir dashboard uygulamasıdır. Proje; .NET 8 Web API, React/Vite web arayüzü, React Native Expo mobil uygulaması, MSSQL, MongoDB, SignalR, Quartz, Docker ve test araçlarıyla geliştirilmiştir.

Uygulamanın ana amacı kategori bazlı performans verilerini tablo olarak göstermek, satış verilerini grafiklerle analiz etmek ve MongoDB üzerinde gerçekleşen veri değişikliklerini frontend tarafına anlık olarak yansıtmaktır.

## İçerik

- .NET 8 ASP.NET Core Web API
- React 19 + Vite web dashboard
- React Native Expo mobil uygulaması
- MSSQL ve MongoDB veri katmanı
- MongoDB Change Stream ile veri değişikliği takibi
- SignalR ile anlık chart yenileme
- MemoryCache ve cache invalidation yapısı
- Quartz ile zamanlanmış SQL -> MongoDB senkronizasyonu
- JWT tabanlı login/register akışı
- NUnit backend testleri
- Jest/Testing Library frontend testleri
- k6 stres testi
- Docker ve Docker Compose desteği

## Proje Yapısı

```text
.
|-- Rasyonet_Intern.API/          # .NET 8 ASP.NET Core Web API
|-- Rasyonet_Intern.UI/           # React + Vite web frontend
|-- Rasyonet_Intern.Mobile/       # React Native Expo mobil/web istemci
|-- Rasyonet_Intern.Test/         # NUnit backend test projesi
|-- stress-test/                  # k6 yük testi
|-- docker-compose.yml            # API, UI, MSSQL ve MongoDB servisleri
|-- docker-compose.local-db.yml   # Local DB ile API/UI çalıştırma yapısı
|-- .env.example                  # Örnek ortam değişkenleri
|-- internship_summary.md         # Haftalık staj teknik özeti
|-- memory.md                     # Proje hafızası
|-- skills.md                     # AI çalışma standartları
|-- RTK.md                        # RTK kullanım notları
|-- Rasyonet_Intern.slnx          # .NET solution
`-- readme.md
```

## Ana Modüller

### Backend

Backend tarafı `Rasyonet_Intern.API` klasöründe yer alır. Controller, repository, service, document, entity ve DTO yapıları ayrı tutulmuştur.

- `Controllers/`: HTTP endpointleri.
- `Data/Sql/`: EF Core `AppDbContext`.
- `Data/Mongo/`: MongoDB context ve ayarları.
- `Entities/`: MSSQL entity modelleri.
- `Documents/`: MongoDB document modelleri.
- `DTOs/`: API response ve request modelleri.
- `Repositories/`: MongoDB okuma ve aggregation repositoryleri.
- `Services/`: cache, auth, background watcher, migration ve sync servisleri.
- `Jobs/`: Quartz job tanımları.
- `Hubs/`: SignalR dashboard hub.
- `Settings/`: JWT gibi konfigürasyon modelleri.

Backend akışı genel olarak `Controller -> Service/Repository -> MSSQL veya MongoDB` şeklindedir. Entity modelleri doğrudan API response olarak dışarı verilmez; DTO kullanımı tercih edilmiştir.

### Web Frontend

Web frontend `Rasyonet_Intern.UI` klasöründe yer alır.

- `/`: Performans sayfası. Kategori bazlı performans tablosunu gösterir.
- `/charts`: Satış chartları sayfası. Bar chart, pie chart ve line chart yapılarını içerir.
- `src/services/`: API ve SignalR client kodları.
- `src/components/`: chart, navigation, status ve ortak UI componentleri.
- `reports/`: Figma/MCP ve farklı AI model çıktılarının karşılaştırıldığı deney sayfaları.

Chart tarafında amCharts 5 kullanılmıştır. SignalR üzerinden `salesChartsInvalidated` bildirimi geldiğinde chart verileri tekrar çekilir.

### Mobil Uygulama

Mobil uygulama `Rasyonet_Intern.Mobile` klasöründe React Native Expo ile geliştirilmiştir.

- `app/`: Expo Router route dosyaları.
- `app/auth/`: login ve register ekranları.
- `app/index.tsx`: performans ekranı.
- `app/charts.tsx`: chart ekranı.
- `services/`: API client, auth session ve token storage servisleri.
- `types/`: TypeScript modelleri.
- `components/performance/`: performans ekranı componentleri.

Mobil tarafta login/register akışı JWT ile çalışır. Token native ortamda `expo-secure-store`, web ortamında ise `localStorage` ile saklanır. Chart ekranında React Native ile uyumlu olduğu için `react-native-gifted-charts` tercih edilmiştir.

## Kullanılan Teknolojiler

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
- JWT Bearer Authentication

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- amCharts 5
- SignalR JavaScript Client
- Jest
- Testing Library

### Mobil

- React Native
- Expo
- Expo Router
- TypeScript
- expo-secure-store
- react-native-gifted-charts
- react-native-svg

### Test ve Altyapı

- Docker
- Docker Compose
- NUnit
- Moq
- FluentAssertions
- Jest
- k6

## Uygulama Akışı

1. Backend, MSSQL ve MongoDB bağlantılarını kurar.
2. API, kategori ve satış verilerini controllerlar üzerinden dışarı açar.
3. Performans sayfası kategori verilerini `GET /api/Categories` üzerinden alır.
4. Chart sayfası satış verilerini `GET /api/Sales` ve chart endpointleri üzerinden alır.
5. Chart endpointleri sık kullanıldığı için MemoryCache ile cache'lenir.
6. MongoDB Change Stream, `Sales` collection değişikliklerini izler.
7. Veri değiştiğinde ilgili cache anahtarları temizlenir.
8. SignalR hub frontend'e `salesChartsInvalidated` bildirimi gönderir.
9. Frontend chart verilerini tekrar çekerek güncel veriyi gösterir.
10. Quartz job, SQL verilerini belirli zamanlarda MongoDB'ye senkronize eder.

## Önemli Endpointler

Varsayılan Docker ortamında API adresi:

```text
http://localhost:5010
```

Genel endpointler:

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

Auth endpointleri:

```text
POST /api/Users/register
POST /api/Users/login
GET /api/Users/get-all-users
GET /api/Profiles/me
```

`GET /api/Profiles/me` JWT Bearer token ister. Token geçerliyse kullanıcı bilgileri döner; token süresi dolmuşsa veya geçersizse kullanıcı tekrar login akışına yönlendirilir.

## Docker ile Çalıştırma

Ön koşullar:

- Docker Desktop
- Docker Compose

Kök dizinde çalıştırın:

```bash
docker compose up --build
```

Varsayılan servis adresleri:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5010
Swagger:  http://localhost:5010/swagger
MSSQL:    localhost:1433
MongoDB:  localhost:27017
```

Containerları durdurmak için:

```bash
docker compose down
```

Volume verilerini de silmek için:

```bash
docker compose down -v
```

Local MSSQL ve local MongoDB kullanarak yalnızca API/UI containerlarını çalıştırmak için:

```bash
docker compose -f docker-compose.local-db.yml up --build
```

Bu senaryoda gerekli connection string ve secret değerleri `.env` dosyasında veya terminal environment'ında tanımlanmalıdır. Örnek değişkenler için `.env.example` dosyasına bakılmalıdır. Gerçek şifre, token, API key veya connection string değerleri dokümantasyona yazılmamalıdır.

## Lokal Geliştirme

### Backend

Ön koşullar:

- .NET 8 SDK
- SQL Server
- MongoDB replica set modunda çalışan lokal MongoDB

Kurulum ve çalıştırma:

```bash
dotnet restore
dotnet run --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj
```

Migration uygulamak için:

```bash
dotnet ef database update --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj
```

MongoDB'den MSSQL'e manuel veri aktarımı için:

```bash
dotnet run --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj -- --migrate-mongo-to-sql
```

### Web Frontend

Ön koşullar:

- Node.js
- npm

Kurulum ve çalıştırma:

```bash
cd Rasyonet_Intern.UI
npm install
npm run dev
```

Varsayılan frontend adresi:

```text
http://localhost:5173
```

Frontend ortam değişkenleri:

```text
VITE_API_BASE_URL=http://localhost:5010/api
VITE_SIGNALR_URL=http://localhost:5010/hubs/dashboard
```

### Mobil Uygulama

Ön koşullar:

- Node.js
- npm
- Expo CLI veya `npx expo`
- Mobil cihazda Expo Go veya web çalışma ortamı

Kurulum ve çalıştırma:

```bash
cd Rasyonet_Intern.Mobile
npm install
npm run web
```

Native cihazda çalıştırmak için:

```bash
cd Rasyonet_Intern.Mobile
npm start
```

Mobil cihazdan API'ye erişirken bilgisayarın LAN IP adresi kullanılmalıdır. İnternet ağı değiştiğinde IPv4 adresi de değişebileceği için mobil API base URL değeri kontrol edilmelidir.

## Testler

Backend testleri:

```bash
dotnet test
dotnet test Rasyonet_Intern.Test/Rasyonet_Intern.TEST.csproj
```

Frontend testleri:

```bash
cd Rasyonet_Intern.UI
npm test
```

Frontend lint ve build:

```bash
cd Rasyonet_Intern.UI
npm run lint
npm run build
```

Mobil lint:

```bash
cd Rasyonet_Intern.Mobile
npm run lint
```

k6 stres testi:

```bash
k6 run stress-test/load-test.js
```

Stres testi satış chart endpointlerini hedefler:

```text
/api/Sales/chart/by-store-location
/api/Sales/chart/by-purchase-method
/api/Sales/chart/monthly-trend
```

## Dikkat Edilecek Noktalar

- MongoDB Change Stream kullanılacağı için MongoDB replica set modunda çalışmalıdır.
- Docker ortamında backend, MongoDB'ye container servis adı üzerinden bağlanır.
- Tarayıcıdaki frontend API'ye `http://localhost:5010` üzerinden gider.
- SignalR için CORS ayarları frontend origin'ine izin verecek şekilde yapılandırılmalıdır.
- Gerçek secret, token, API key veya connection string değerleri README, `memory.md` ya da kaynak kod içine yazılmamalıdır.
- Mobil cihazdan backend'e erişirken `localhost` yerine bilgisayarın LAN IP adresi kullanılmalıdır.

## Lisans

Bu proje staj çalışması kapsamında geliştirilmiştir.
