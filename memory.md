# Proje Hafızası

Bu dosya, AI asistanların projeyi her açtığında bilmesi gereken sabit proje bilgisini tutar. Geçici not, şifre, token, API key veya connection string eklenmemelidir.

## Projenin Amacı

Rasyonet_Intern, satış ve kategori verilerini yöneten bir dashboard uygulamasıdır. Backend API, MongoDB ve MSSQL verilerini kullanarak satış/kategori verilerini ve grafik endpointlerini sunar. Frontend, performans tablosu ve satış grafiklerini gösterir; MongoDB değişikliklerinde SignalR ile chart verilerini anlık yeniler.

## Kullanılan Teknolojiler

- Backend: .NET 8, ASP.NET Core Web API, Entity Framework Core, SQL Server, MongoDB.Driver, AutoMapper, SignalR, Quartz, OpenTelemetry, Swagger, MemoryCache.
- Frontend: React 19, Vite, React Router, Tailwind CSS, amCharts 5, SignalR JavaScript Client.
- Test: NUnit, Moq, FluentAssertions, Jest, Testing Library, k6.
- Altyapı: Docker, Docker Compose, MSSQL Server 2022, MongoDB 7 replica set.

## Mimari Yaklaşım

- API katmanlı bir ASP.NET Core uygulamasıdır: Controller -> Repository/Service -> SQL veya MongoDB.
- MongoDB, dashboard okuma ve aggregation sorguları için kullanılır.
- MSSQL, relational entity modeli ve EF Core migrationları için kullanılır.
- SQL verileri Quartz job ile MongoDB'ye senkronize edilir.
- Chart endpointleri MemoryCache ile cache'lenir.
- MongoDB Change Stream, Sales collection değişikliklerini izler; cache invalidation yapar ve SignalR ile frontend'e `salesChartsInvalidated` eventi gönderir.

## Katmanlar ve Klasör Yapısı

- `Rasyonet_Intern.API/`: ASP.NET Core Web API.
- `Rasyonet_Intern.API/Controllers/`: HTTP endpointleri.
- `Rasyonet_Intern.API/Data/Sql/`: EF Core `AppDbContext`.
- `Rasyonet_Intern.API/Data/Mongo/`: MongoDB context ve ayarları.
- `Rasyonet_Intern.API/Entities/`: MSSQL entity modelleri.
- `Rasyonet_Intern.API/Documents/`: MongoDB document modelleri.
- `Rasyonet_Intern.API/DTOs/`: API ve chart response modelleri.
- `Rasyonet_Intern.API/Repositories/`: MongoDB okuma ve aggregation repositoryleri.
- `Rasyonet_Intern.API/Services/`: cache, background watcher, migration ve sync servisleri.
- `Rasyonet_Intern.API/Jobs/`: Quartz job tanımları.
- `Rasyonet_Intern.API/Hubs/`: SignalR hub.
- `Rasyonet_Intern.UI/`: React + Vite frontend.
- `Rasyonet_Intern.UI/public/images/`: UI tarafinda kullanilan statik gorsel dosyalari.
- `Rasyonet_Intern.UI/reports/`: UI icinde route edilen deney ve rapor sayfalari.
- `Rasyonet_Intern.UI/reports/gpt_5.4_test/`, `gpt_5.5_test/`, `haiku_4_5_test/`: AI deney sayfalari yontem bazli ayrilir; her klasorde referans gorsel basina ayri React page tutulur.
- `Rasyonet_Intern.UI/src/pages/`: performans ve chart sayfaları.
- `Rasyonet_Intern.UI/src/components/`: chart, navigation, status ve UI componentleri.
- `Rasyonet_Intern.UI/src/services/`: API ve SignalR client kodu.
- `Rasyonet_Intern.Test/`: backend NUnit testleri.
- `stress-test/`: k6 yük testi.

## Domain Kavramları

- `Category`: kategori bilgisi; performans verileri ile ilişkilidir.
- `Performance`: kategori bazlı performans değeri.
- `Sale`: satış kaydı; tarih, kupon kullanımı, mağazanın lokasyonu ve satın alma yöntemi bilgilerini taşır.
- `SaleItem`: satış içindeki ürün kalemleri; fiyat ve adet aggregation hesaplarında kullanılır.
- `SaleCustomer`: satışa bağlı müşteri bilgisi.
- `SyncState`: senkronizasyon durumunu takip etmek için kullanılır.
- Chart kavramları: mağazaya göre toplam satış, satın alma yöntemi dağılımı, aylık satış trendi, kategori chart verisi.

## Veritabanı Tercihleri

- MSSQL tarafında EF Core entity modeli ve migrationlar bulunur.
- MongoDB tarafında `Categories` ve `Sales` collectionları dashboard okuma modeli olarak kullanılır.
- MongoDB Change Stream gerektiği için MongoDB replica set modunda çalışmalıdır.
- Connection string, şifre ve gizli bilgiler bu dosyada tutulmaz; `appsettings`, environment variable veya güvenli secret mekanizmaları kullanılmalıdır.

## Önemli Endpointler

- `GET /health`
- `GET /swagger`
- `GET /api/Categories`
- `GET /api/Categories/chart`
- `GET /api/Sales`
- `GET /api/Sales/{id}`
- `GET /api/Sales/chart/by-store-location`
- `GET /api/Sales/chart/by-purchase-method`
- `GET /api/Sales/chart/monthly-trend`
- SignalR hub: `/hubs/dashboard`

## Kodlama Standartları

- Backend C# kodunda DI kullanılır; repository ve servisler `Program.cs` içinde kaydedilir.
- Async operasyonlarda `async/await` kullanılır.
- MongoDB aggregation sonuçları DTO'lara map edilir.
- Entity ve document modelleri ayrı tutulur; entity-document dönüşümlerinde AutoMapper tercih edilir.
- Cache keyleri merkezi olarak `CacheKeys` altında tutulur.
- Frontend componentleri sayfa, component ve service klasörleri altında ayrılır.
- Secret, connection string, token veya API key commitlenmemeli ve dokümantasyona kopyalanmamalıdır.

## Bilinen Mimari Kararlar

- Chart okumaları MongoDB aggregation pipeline ile yapılır.
- Satış chart endpointleri cache'lenir; Sales collection değişince cache temizlenir.
- Frontend chart yenilemesi SignalR eventleriyle tetiklenir.
- Quartz, SQL -> MongoDB senkronizasyonunu zamanlamak için kullanılır.
- Docker ortamında API host portu `5010`, UI host portu `5173` olarak kullanılır.
- `docker-compose.local-db.yml`, DB containerlarını silmeden sadece API/UI containerlarını çalıştırır; API local MSSQL ve local MongoDB'ye `host.docker.internal` üzerinden bağlanır.
- Development ortamında Swagger aktiftir.
- OpenTelemetry tracing API, HTTP client ve MongoDB driver instrumentation için kuruludur.
- AI deney sayfalarında ortak header, tab ve ikon yapıları `ReportChrome` benzeri paylaşımlı component ile toplanır; bu yaklaşım tekrar eden UI kodunu azaltır ve rapor sayfaları arasında tutarlılığı artırır.

## Çalıştırma Komutları

Backend:

```bash
dotnet restore
dotnet run --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj
```

Migration:

```bash
dotnet ef database update --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj
```

MongoDB'den MSSQL'e manuel veri aktarımı:

```bash
dotnet run --project Rasyonet_Intern.API/Rasyonet_Intern.API.csproj -- --migrate-mongo-to-sql
```

Frontend:

```bash
cd Rasyonet_Intern.UI
npm install
npm run dev
```

## Test ve Docker Bilgileri

Backend testleri:

```bash
dotnet test
dotnet test Rasyonet_Intern.Test/Rasyonet_Intern.TEST.csproj
```

Frontend test/lint/build:

```bash
cd Rasyonet_Intern.UI
npm test
npm run lint
npm run build
```

Docker Compose:

Compose dosyaları `.env` dosyasındaki değişkenleri kullanır. Örnek değerler için `.env.example` dosyasına bakılmalı, gerçek şifre ve connection string değerleri sadece git'e eklenmeyen `.env` dosyasında tutulmalıdır.

Tüm Docker ortamını başlatmak için:

```bash
docker compose up --build
```

Local DB kullanarak sadece API ve UI containerlarını başlatmak için:

```bash
docker compose -f docker-compose.local-db.yml up --build
```

`docker-compose.local-db.yml` çalışmadan önce `LOCAL_SQL_CONNECTION_STRING` ve `LOCAL_MONGODB_CONNECTION_STRING` değerleri private `.env` dosyasında veya terminal environment'ında tanımlı olmalıdır. SignalR chart yenilemesi için local MongoDB replica set modunda `rs0` olarak çalışmalıdır.

Docker ortamını kapatmak için:

```bash
docker compose down
docker compose down -v
```

Varsayılan lokal servis adresleri:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5010`
- Swagger: `http://localhost:5010/swagger`
- MSSQL: `localhost:1433`
- MongoDB: `localhost:27017`

k6 stres testi:

```bash
k6 run stress-test/load-test.js
```

Stres testi satış chart endpointlerini hedefler.

## Auth, JWT ve Mobile Klasör Yapısı

Backend auth/JWT klasörleri:

- `Rasyonet_Intern.API/Controllers/UsersController.cs`: register, login ve kullanıcı listeleme endpointleri.
- `Rasyonet_Intern.API/Controllers/ProfilesController.cs`: JWT ile giriş yapmış kullanıcının profil bilgilerini dönen endpoint.
- `Rasyonet_Intern.API/DTOs/Auth/`: login, register, auth response ve user response DTO modelleri.
- `Rasyonet_Intern.API/Services/Auth/`: auth, password hashing ve JWT token üretim servisleri.
- `Rasyonet_Intern.API/Settings/JwtSettings.cs`: JWT issuer, audience, secret ve expiration ayarları.

Mobile auth klasörleri:

- `Rasyonet_Intern.Mobile/`: Expo Router tabanlı mobil/web istemci.
- `Rasyonet_Intern.Mobile/app/`: Expo Router route dosyaları.
- `Rasyonet_Intern.Mobile/app/auth/`: login ve register ekranları.
- `Rasyonet_Intern.Mobile/services/`: mobile API client, auth session ve token storage servisleri.
- `Rasyonet_Intern.Mobile/types/`: mobile tarafında kullanılan TypeScript modelleri.

Auth endpointleri:

- `POST /api/Users/register`
- `POST /api/Users/login`
- `GET /api/Users/get-all-users`
- `GET /api/Profiles/me`: JWT Bearer token ister; token claimlerinden kullanıcı id, email ve ad bilgisini döner.

Auth mimari kararlar:

- Auth akışı `UsersController -> IAuthService/AuthService -> IUserRepository/UserRepository` hattından ilerler.
- Register ve login response modelleri `AuthResponseDto`, kullanıcı dış response modeli `UserResponseDto` üzerinden döner; `PasswordHash` API response olarak dışarı verilmez.
- `AuthService`, auth DTO/document dönüşümlerinde AutoMapper kullanır. `RegisterRequestDto -> UserDocument` ve `UserDocument -> UserResponseDto` mappingleri `GeneralMapping` içindedir.
- JWT token `JwtTokenService` tarafından üretilir; token claimleri `NameIdentifier`, `Email` ve `Name` bilgisini taşır.
- `[Authorize]` ile korunan endpointlerde JWT Bearer token gerekir; `GET /api/Profiles/me` token içindeki kullanıcı claimlerini okumak için kullanılır.
- Mobile auth guard Expo Router `Stack.Protected` ve `AuthSessionProvider` ile yönetilir. Token yoksa auth ekranları, token varsa `index` performans sayfası açılır.
- Mobile login başarılı olunca token saklanır ve performans sayfasına geçilir. Register başarılı olunca otomatik giriş yaptırılmaz; kullanıcı login ekranına yönlendirilir.
- Mobile token storage native ortamda `expo-secure-store`, web ortamında `localStorage` kullanır.
- Mobile web API adresi `http://localhost:5010/api`, native/mobile cihaz API adresi LAN IP üzerinden tanımlanır.

Mobile çalıştırma:

```bash
cd Rasyonet_Intern.Mobile
npm install
npm run web
```
