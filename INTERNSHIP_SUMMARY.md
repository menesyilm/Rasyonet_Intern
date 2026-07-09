# Internship Technical Summary

Bu doküman, staj sürecinde haftalık olarak yapılan çalışmaları, teknik araştırmaları ve projeye eklenen geliştirmeleri özetler.

---

## 1. Hafta - Proje Altyapısı, Chart Yapıları ve Test Araştırmaları

İlk hafta proje altyapısının kurulması, kullanılacak frontend teknolojilerinin araştırılması, backend tarafında Web API ve veritabanı yapısının hazırlanması, chart yapılarının oluşturulması ve test/performance konularının incelenmesi üzerine çalışmalar yapıldı.

<details>
<summary>Gün 1 - Proje Başlangıcı ve Teknoloji Araştırması</summary>

* Yapay zeka ile çalışma yöntemleri ve etkili prompt yazımı araştırıldı.
* Oluşturulacak UI için Vue ve React teknolojileri karşılaştırıldı.
* ASP.NET Core Web API projesi oluşturuldu.
* Verilen görsel üzerinden entity modelleri çıkarıldı.
* Migration işlemleri yapılarak MSSQL tarafında database yapısı oluşturuldu.

</details>

<details>
<summary>Gün 2 - Chart Yapıları ve UI Araştırmaları</summary>

* PrimeFlex CSS ve SCSS kullanımı araştırıldı.
* Projenin MSSQL’den MongoDB’ye geçirilmesi üzerine araştırma yapıldı.
* amCharts 4 ve amCharts 5 karşılaştırıldı.
* Güncel kullanım ve sürdürülebilirlik açısından amCharts 5 incelendi.
* Pie Chart oluşturuldu.
* Chart görünümünden tablo görünümüne geçiş için switch yapısı planlandı.
* Zaman kalmasıyla birlikte Bar Chart ve Line Chart projeye dahil edildi.
* 7 farklı fon verisi kullanılarak toplamı 100 olacak şekilde yüzdelik dağılım hazırlandı.

</details>

<details>
<summary>Gün 3 - MongoDB Veri Yapısı ve Dinamik Veri Kullanımı</summary>

* Chartlarda kullanılan statik fon verilerinin kaldırılması planlandı.
* MongoDB üzerinden veri çekme yapısı üzerinde çalışıldı.
* MongoDB database yapısı genişletildi.
* İnternetten örnek veri yapıları araştırılarak projeye uygun veri seti oluşturuldu.
* CategoryName alanı üzerinden MongoDB sorguları incelendi.
* Unit Test ve UI Test yaklaşımları araştırıldı.
* React projelerinde UI testlerinin nasıl yazılabileceği incelendi.

</details>

<details>
<summary>Gün 4 - UI Testleri, State Yönetimi ve Integration Test Araştırmaları</summary>

* React ile yazılmış örnek projeler üzerinden UI test yazımı incelendi.
* Jest kütüphanesi ile component davranışlarının nasıl test edilebileceği araştırıldı.
* Buton tıklama, input alanına veri girme ve component render kontrolü gibi UI test senaryoları değerlendirildi.
* useEffect ve useState kullanımı üzerinden frontend state yönetimi tekrar edildi.
* ReduxJS araştırıldı.
* SQL verileriyle farklı senaryoları kontrol edebilmek için Integration Test yaklaşımı incelendi.
* Loading state yönetimi ve spinner gösterimi üzerine çalışma yapıldı.
* Playwright test aracı araştırıldı.

</details>

<details>
<summary>Gün 5 - Stres Testi ve Coverage Araştırması</summary>

* Projeye stres testi yazılması üzerine araştırma yapıldı.
* Yük altında response süreleri, hata oranları ve sistem davranışının nasıl raporlanacağı incelendi.
* Sisteme yüksek sayıda eş zamanlı istek geldiğinde API’nin nasıl cevap vereceği değerlendirildi.
* Test coverage kavramı araştırıldı.
* Piyasada kabul edilebilir coverage oranları ve %100 coverage hedefinin her zaman gerekli olup olmadığı incelendi.
* Coverage oranının yapay şekilde yükseltilmemesi gerektiği değerlendirildi.
* Jest config yapısının projeye dahil edilip edilmemesi incelendi.

</details>

### 1. Hafta Teknik Kazanımları

* ASP.NET Core Web API proje yapısı oluşturuldu.
* Entity, migration ve database oluşturma süreçleri uygulandı.
* Vue ve React teknolojileri UI geliştirme açısından karşılaştırıldı.
* amCharts kullanılarak Pie Chart, Bar Chart ve Line Chart yapıları incelendi.
* Statik verilerden MongoDB kaynaklı dinamik veri kullanımına geçiş süreci başlatıldı.
* Unit Test, UI Test, Integration Test, Playwright ve Jest konuları araştırıldı.
* Stres testi ve test coverage konularında temel araştırmalar yapıldı.

### 1. Hafta Değerlendirmesi

İlk hafta, projenin teknik temelini oluşturma ve sonraki geliştirmelere hazırlık yapma üzerine geçti. Backend tarafında Web API ve veritabanı yapısı hazırlanırken, frontend tarafında chart yapıları ve test edilebilirlik üzerine çalışmalar yapıldı.


## 2. Hafta - Test, Senkronizasyon, Realtime Güncelleme ve Docker Çalışmaları

İkinci hafta stres testi, test coverage, SQL-MongoDB veri senkronizasyonu, MongoDB değişim takibi, cache invalidation, realtime UI güncelleme ve Docker ile container yapısı üzerine çalışmalar yapıldı.

<details>
<summary>Gün 1 - Önceki Hafta Kodlarının İncelenmesi</summary>

* Önceki hafta yazılan kodlar tekrar gözden geçirildi.
* Chart yapıları, veri çekme akışı ve test araştırmaları üzerinden genel kontrol yapıldı.
* Kodların okunabilirliği ve proje yapısına uygunluğu değerlendirildi.
* Eksik veya iyileştirilebilecek noktalar not alındı.

</details>

<details>
<summary>Gün 2 - Stres Testi, Coverage ve SQL-MongoDB Senkronizasyon Planı</summary>

* Stres testi sonuçlarında hangi metriklerin takip edilmesi gerektiği araştırıldı.
* Response time, hata oranı ve sistemin yük altındaki davranışı gibi kriterler değerlendirildi.
* Test coverage çalıştırmak için `jest --coverage` komutu incelendi.
* Coverage oranının sektörde nasıl değerlendirildiği ve %100 coverage hedefinin her zaman gerekli olup olmadığı araştırıldı.
* Günün belirli saatinde çalışacak bir scheduled job yapısı planlandı.
* MSSQL’deki verilerin belirli aralıklarla MongoDB’ye aktarılması üzerine çalışma yapıldı.
* Schedule job dışında manuel veri değişikliği yapılırsa bu değişikliğin de nasıl yakalanabileceği değerlendirildi.
* MongoDB’deki `watch` özelliğinin SQL tarafındaki karşılıkları araştırıldı.
* SQL-MongoDB senkronizasyonu için kullanılabilecek yapıların ön planlaması yapıldı.

</details>

<details>
<summary>Gün 3 - MongoDB Değişim Takibi, Loglama ve Cache Invalidation</summary>

* Stres testi sonuçlarının hangi eşiklerle yorumlanabileceği tekrar değerlendirildi.
* `test:coverage` script’i ile coverage çıktısı alma süreci incelendi.
* MongoDB tarafında gerçekleşen değişikliklerin yakalanması üzerine çalışma yapıldı.
* MongoDB Change Stream kullanılarak veri değişimlerinin takip edilebileceği görüldü.
* Yakalanan değişikliklerin loglanması üzerine çalışma yapıldı.
* MongoDB’deki değişimlerin cache invalidation mekanizmasına nasıl bağlanabileceği değerlendirildi.
* Veri değiştiğinde ilgili chart cache’lerinin temizlenmesi için yapı planlandı.
* Böylece cache kullanılırken eski veri gösterme riskinin azaltılması hedeflendi.

</details>

<details>
<summary>Gün 4 - WebSocket, SignalR ve Anlık UI Güncelleme</summary>

* WebSocket kavramı araştırıldı.
* Socket.IO ve SignalR teknolojileri karşılaştırıldı.
* Backend tarafı ASP.NET Core olduğu için SignalR kullanımının projeye daha uygun olduğu değerlendirildi.
* Değişen verinin UI tarafına anlık olarak yansıtılması üzerine çalışma yapıldı.
* SignalR bağlantısı ile backend’den frontend’e bildirim gönderme yapısı kuruldu.
* Frontend tarafında chart verilerinin değişiklik sonrası yeniden çekilmesi sağlandı.
* `src/components` altında `SignalRStatusBadge` component’i oluşturuldu.
* Kullanıcıya bağlantı durumunu göstermek için bağlı, bağlanıyor, yeniden bağlanıyor ve bağlantı kapalı durumları ele alındı.

</details>

<details>
<summary>Gün 5 - Dockerfile, Docker Compose ve Healthcheck</summary>

* Docker Desktop üzerinden proje container yapısına hazırlandı.
* Backend için Dockerfile oluşturuldu.
* Frontend için Dockerfile oluşturuldu.
* UI ve Backend servislerinin Docker üzerinden çalıştırılması sağlandı.
* Docker Compose ile servislerin birlikte ayağa kaldırılması üzerine çalışma yapıldı.
* Backend ve frontend servisleri için healthcheck yapısı eklendi.
* Container’ın sadece çalışıyor görünmesi değil, gerçekten servis verebilir durumda olup olmadığının kontrol edilmesi hedeflendi.

</details>

### 2. Hafta Teknik Kazanımları

* Stres testi metrikleri ve test coverage yaklaşımı araştırıldı.
* SQL-MongoDB veri senkronizasyonu için scheduled job yapısı planlandı.
* MongoDB Change Stream ile veri değişimlerinin takip edilmesi üzerine çalışma yapıldı.
* Cache invalidation mantığı, veri değişimlerini yakalama süreciyle ilişkilendirildi.
* WebSocket, Socket.IO ve SignalR teknolojileri karşılaştırıldı.
* ASP.NET Core backend ile uyumlu realtime iletişim için SignalR kullanıldı.
* Frontend tarafında SignalR bağlantı durumunu göstermek için status badge component’i eklendi.
* Backend ve frontend için Dockerfile oluşturuldu.
* Docker Compose ve healthcheck yapıları projeye dahil edildi.

### 2. Hafta Değerlendirmesi

İkinci hafta, projenin daha gerçekçi kullanım senaryolarına yaklaştırılması üzerine geçti. Test, performans, veri senkronizasyonu, cache yönetimi, realtime bildirim ve container yönetimi gibi konular ele alındı. Bu çalışmalarla proje yalnızca çalışan bir dashboard olmaktan çıkarılıp daha sürdürülebilir, izlenebilir ve operasyonel olarak yönetilebilir bir yapıya taşınmaya başladı.

## 3. Hafta - Docker Ortamı, Yapay Zeka Kullanımı, MCP/Figma Karşılaştırmaları ve Mobil Uygulama Çalışmaları

Üçüncü hafta Docker ortamının daha stabil hale getirilmesi, yapay zeka araçlarının daha verimli kullanılması, Figma tasarımlarının MCP ve Codex üzerinden projeye aktarılması, farklı model/skill çıktılarının karşılaştırılması ve React Native Expo ile mobil uygulama geliştirme üzerine çalışmalar yapıldı.

<details>
<summary>Gün 1 - Docker Alert Sistemi, README ve Veritabanı Container Hazırlıkları</summary>

* Docker Desktop üzerinde çalışan servislerin durumunu takip edebilmek için alert sistemi araştırıldı.
* Container’ların hem çalışır durumda hem de durduğu senaryolarda nasıl izlenebileceği değerlendirildi.
* Canlı ve test ortamları için ayrı Dockerfile dosyaları kullanılabileceği not edildi.
* Proje dokümantasyonu için README.md dosyası oluşturulması planlandı.
* MSSQL ve MongoDB için Docker Desktop üzerinde container oluşturma süreci ele alındı.
* Veritabanı servislerinin container yapısında nasıl yönetileceği üzerine çalışma yapıldı.

</details>

<details>
<summary>Gün 2 - Yapay Zeka Kullanımı, Prompt ve Token Optimizasyonu</summary>

* Yapay zeka araçlarının yazılım geliştirme sürecinde daha etkili nasıl kullanılabileceği araştırıldı.
* Prompt yazarken görev tanımının, bağlamın ve beklenen çıktının net verilmesi gerektiği değerlendirildi.
* Token tüketimini azaltmak için gereksiz dosya, açıklama ve tekrarların promptlardan çıkarılması gerektiği incelendi.
* Büyük görevleri tek seferde vermek yerine daha küçük ve kontrollü parçalara bölmenin daha verimli olduğu görüldü.
* AI destekli geliştirme sürecinde doğru bağlam verme, çıktı sınırlandırma ve karşılaştırmalı test yapma yaklaşımları incelendi.

</details>

<details>
<summary>Gün 3 - Figma MCP, Codex Karşılaştırmaları ve Docker Sorunlarının Çözülmesi</summary>

* Figma üzerinden seçilen bir tasarım dosyasının MCP ile Codex’e aktarılması ve projede uygulanması üzerine çalışma yapıldı.
* Figma tasarımının MCP aracılığıyla okunup kod tarafına yansıtılması test edildi.
* Aynı görseller üzerinden üç farklı yaklaşım karşılaştırıldı:

  * Skill kullanılarak yapılan çıktı
  * Düz Codex ile yapılan çıktı
  * Özel hazırlanmış skill ile yapılan çıktı
* Bu yaklaşımların token kullanımı ve çıktı kalitesi açısından karşılaştırılması planlandı.
* Karşılaştırma sonuçlarının daha okunabilir olması için kıyaslamalı HTML raporu ekletildi.
* Docker tarafında yaşanan çalışmama probleminin, önceki build çıktılarının kalmasından kaynaklandığı tespit edildi.
* Eski build kaynaklı problem düzeltilerek container yapısı tekrar çalışır hale getirildi.
* MongoDB’nin replica set modunda çalışabilmesi için docker-compose yapısına `Rasyonet-mongodb-init` klasörü eklendi.
* Local MongoDB’deki veriler Docker içerisindeki MongoDB container’ına taşındı.
* Bu sayede Docker ortamındaki MongoDB’nin proje için gerekli verilerle çalışması sağlandı.

</details>

<details>
<summary>Gün 4 - Mobil Görünüm İyileştirmesi ve Model Karşılaştırma Raporları</summary>

* Performans tablosunda fon kodu alanının mobil görünümde sol tarafa sabitlenmesi üzerine çalışma yapıldı.
* Mobil ekranda yatay scroll sırasında fon kodunun kaybolmaması sağlandı.
* Böylece kullanıcı scroll yaptığında hangi satırdaki fona baktığını daha rahat takip edebilir hale geldi.
* Kıyaslamalı rapor yapısı projeye ekletildi.
* GPT 5.5, GPT 5.4 ve Haiku 4.5 çıktıları için karşılaştırmalı sayfalar oluşturuldu.
* Farklı modellerin aynı görsel/tasarım görevi üzerindeki performansı, çıktı kalitesi ve uygulanabilirliği karşılaştırıldı.

</details>

<details>
<summary>Gün 5 - Excel Frozen Column ve React Native Expo Mobil Uygulama</summary>

* Excel çıktılarında ilk sütunun sabit kalması için sticky yaklaşımı yerine frozen column mantığı değerlendirildi.
* Backend tarafında Excel üretiminde ilk sütunun sabitlenmesi için gerekli yapı araştırıldı.
* React Native Expo ile mobil uygulama projesi oluşturuldu.
* Varsayılan Expo ekranı `npx expo start` komutu ile çalıştırıldı.
* Expo Go uygulaması ile aynı ağ üzerinden mobil cihazda projeyi çalıştırma süreci test edildi.
* Mobil proje içerisinden API controller endpointlerine istek atıldı.
* UI tarafındaki Categories sayfasına benzer bir ekran React Native ile mobil uygulama için oluşturuldu.
* İnternet ağı değiştiğinde bilgisayarın IPv4 adresinin de değiştiği ve mobil uygulamanın API’ye erişmesi için base URL’in buna göre güncellenmesi gerektiği anlaşıldı.
* Expo projesini web tarafında `http://localhost:8081` üzerinden çalıştırmak istendiğinde CORS ayarlarının gerekli olduğu görüldü.

</details>

### 3. Hafta Teknik Kazanımları

* Docker Desktop üzerinde container durumlarını izleme ve alert sistemi mantığı araştırıldı.
* Canlı ve test ortamları için ayrı Dockerfile kullanılabileceği değerlendirildi.
* README.md ile proje dokümantasyonu hazırlama süreci ele alındı.
* MSSQL ve MongoDB container yapıları üzerinde çalışma yapıldı.
* Yapay zeka araçlarında prompt kalitesi, bağlam yönetimi ve token optimizasyonu üzerine araştırma yapıldı.
* Figma tasarımlarının MCP ve Codex aracılığıyla projeye aktarılması test edildi.
* Skill, düz Codex ve özel skill yaklaşımları çıktı kalitesi ve token kullanımı açısından karşılaştırıldı.
* Karşılaştırmalı HTML rapor yapısı projeye dahil edildi.
* Docker build kaynaklı problem tespit edilip düzeltildi.
* MongoDB’nin replica set modunda çalışması için init yapısı oluşturuldu.
* Local MongoDB verileri Docker MongoDB container’ına taşındı.
* Mobil görünümde fon kodu alanının sabit kalması sağlandı.
* GPT 5.5, GPT 5.4 ve Haiku 4.5 için karşılaştırmalı rapor sayfaları oluşturuldu.
* Excel çıktılarında ilk sütunun sabit kalması için frozen column yaklaşımı araştırıldı.
* React Native Expo projesi oluşturuldu.
* Mobil uygulamadan API endpointlerine istek atıldı.
* Expo Go, IPv4 adresi, local network erişimi ve CORS konuları uygulamalı olarak değerlendirildi.

### 3. Hafta Değerlendirmesi

Üçüncü hafta, projenin yalnızca web dashboard tarafıyla sınırlı kalmayıp farklı geliştirme ve kullanım senaryolarına genişletildiği bir hafta oldu. Docker ortamındaki problemler giderilirken, MongoDB’nin replica set modunda çalışması için gerekli yapı güçlendirildi. Yapay zeka araçlarının daha verimli kullanılması, token tüketiminin azaltılması ve farklı model çıktılarının karşılaştırılması üzerine çalışmalar yapıldı. Ayrıca React Native Expo ile mobil uygulama geliştirme sürecine başlanarak API verilerinin mobil tarafta da kullanılabileceği test edildi.

## 4. Hafta - Local MongoDB Yapılandırması, JWT Authentication ve React Native Chart Çalışmaları

Dördüncü hafta Docker ortamında local MongoDB kullanımının düzenlenmesi, ortam değişkenlerinin güvenli hale getirilmesi, React Native tarafında login/register akışının oluşturulması, JWT tabanlı authentication yapısının backend ve mobil uygulama ile entegre edilmesi, protected endpoint kullanımı ve mobil chart kütüphanesi araştırmaları üzerine çalışmalar yapıldı.

<details>
<summary>Gün 1 - Local MongoDB Kullanımı, Environment Yapısı ve Kod İncelemesi</summary>

* Docker içerisindeki MongoDB yerine local MongoDB kullanımı için ayrı bir `docker-compose.yml` dosyası oluşturuldu.
* Docker Compose içerisinde doğrudan yazılan password ve benzeri hassas konfigürasyon değerleri `.env` dosyasına taşındı.
* Kullanıcının hangi environment değişkenlerini tanımlaması gerektiğini görebilmesi için `.env.example` dosyası oluşturuldu.
* `Internship_summary.md` dosyasına üçüncü hafta özeti eklendi.
* Projedeki kodlar genel olarak gözden geçirildi.
* Kod yapısı, klasör organizasyonu, okunabilirlik ve sürdürülebilirlik açısından incelendi.

</details>

<details>
<summary>Gün 2 - React Native Login/Register Ekranları ve JWT Authentication</summary>

* React Native tarafında login ve register ekranlarının oluşturulması üzerine çalışma yapıldı.
* Mobil uygulamada authentication akışının nasıl kurulacağı değerlendirildi.
* Register ekranı ile kullanıcı oluşturma süreci mobil tarafa eklendi.
* Login ekranı ile kullanıcının backend üzerinden kimlik doğrulaması yapması sağlandı.
* Backend tarafında JWT tabanlı authentication yapısı kuruldu.
* JWT üretimi ve doğrulaması için `System.IdentityModel.Tokens.Jwt` ve `Microsoft.AspNetCore.Authentication.JwtBearer` kütüphaneleri kullanıldı.
* JWT’nin mobil tarafta güvenli şekilde saklanabilmesi için `expo-secure-store` kullanıldı.
* JWT kullanılmasının temel amacı, her endpoint isteğinde kullanıcının email ve şifresini tekrar göndermek yerine backend’in kullanıcıyı token üzerinden güvenli şekilde tanıyabilmesini sağlamaktır.
* UI tarafında bulunan Pie Chart ekranının React Native tarafında nasıl karşılanabileceği araştırıldı.
* amCharts 5’in React Native için doğrudan uygun olmaması nedeniyle alternatif chart kütüphaneleri incelendi.

</details>

<details>
<summary>Gün 3 - Protected Endpoint, Token Expire Kontrolü ve Storage Yapısı</summary>

* Login işlemi sonrasında alınan token’ın kullanım akışı gözden geçirildi.
* Categories sayfasında daha önce GET metodu ile veri çekilen yapı, JWT kontrolü yapılacak şekilde yeniden düzenlendi.
* Token geçerliliğinin backend tarafından kontrol edilebilmesi için ilgili endpoint `POST` olarak güncellendi.
* Endpoint’e `[Authorize]` ve `[HttpPost]` attribute’ları eklendi.
* Böylece token süresi dolduğunda backend’in yetkisiz istek dönmesi ve mobil uygulamanın kullanıcıyı tekrar login ekranına yönlendirmesi hedeflendi.
* Expo projesi web ortamında çalışırken JWT saklama işlemi için `localStorage` kullanımı değerlendirildi.
* Mobil ortamda JWT’nin `expo-secure-store` üzerinden cihazın güvenli depolama alanında tutulması sağlandı.
* `localStorage` yapısının yalnızca token için değil; dil seçimi, tema seçimi ve benzeri kalıcı kullanıcı tercihleri için de kullanılabileceği not edildi.
* Web ve mobil ortamda token saklama yöntemlerinin farklılaşması gerektiği görüldü.

</details>

<details>
<summary>Gün 4 - React Native Chart Kütüphanesi Araştırması ve Pie Chart Ekranı</summary>

* UI tarafında bulunan Pie Chart sayfasının React Native tarafında nasıl geliştirilebileceği üzerine araştırma yapıldı.
* amCharts 5 yerine React Native ile daha uyumlu chart kütüphaneleri incelendi.
* `react-native-gifted-charts` ve `react-native-chart-kit` kütüphaneleri karşılaştırıldı.
* Kullanım kolaylığı, mobil uyumluluk, görünüm özelleştirme ve veri gösterimi açısından `react-native-gifted-charts` tercih edildi.
* `by-store-location` endpointinden gelen veriler kullanılarak React Native tarafında Pie Chart ekranı oluşturuldu.
* Chart görünümünün yanında UI tarafındaki yapıya benzer tablo görünümü de eklendi.
* Böylece verinin yalnızca grafik üzerinde değil, tablo formatında da okunabilir şekilde gösterilmesi sağlandı.

</details>

<details>
<summary>Gün 5 - Proje Sunumu ve Genel Değerlendirme</summary>

* Hafta boyunca yapılan geliştirmeler genel olarak gözden geçirildi.
* Docker yapılandırması, local MongoDB kullanımı, `.env` yönetimi, JWT authentication ve React Native entegrasyonları sunuma hazırlandı.
* Login/register akışı, token saklama yapısı ve protected endpoint mantığı anlatıldı.
* React Native tarafında oluşturulan Pie Chart ve tablo görünümü gösterildi.
* Projenin web, backend, Docker ve mobil taraflarında yapılan geliştirmeler bütünsel olarak sunuldu.

</details>

### 4. Hafta Teknik Kazanımları

* Docker ortamında local MongoDB kullanımına yönelik ayrı compose yapısı oluşturuldu.
* Hassas konfigürasyon değerlerinin `.env` dosyasına taşınması sağlandı.
* Kullanıcıya örnek environment değişkenlerini göstermek için `.env.example` dosyası hazırlandı.
* Proje kodları okunabilirlik, sürdürülebilirlik ve yapı açısından genel olarak incelendi.
* React Native tarafında login ve register ekranları oluşturuldu.
* Backend tarafında JWT tabanlı authentication yapısı kuruldu.
* JWT üretimi ve doğrulaması için gerekli .NET kütüphaneleri projeye dahil edildi.
* Mobil tarafta JWT saklama işlemi için `expo-secure-store` kullanıldı.
* Web ortamında token ve kullanıcı tercihleri için `localStorage` kullanımı değerlendirildi.
* Protected endpoint mantığı `[Authorize]` attribute’u ile uygulandı.
* Token süresi dolduğunda kullanıcının tekrar login ekranına yönlendirilmesi üzerine çalışma yapıldı.
* React Native için chart kütüphaneleri araştırıldı.
* `react-native-gifted-charts` ve `react-native-chart-kit` karşılaştırıldı.
* `by-store-location` endpointinden gelen veriler React Native tarafında Pie Chart olarak gösterildi.
* Chart ekranına tablo görünümü eklenerek veri okunabilirliği artırıldı.
* Projenin genel sunumu yapıldı.

### 4. Hafta Değerlendirmesi

Dördüncü hafta, projenin mobil uygulama tarafının daha gerçekçi bir kullanıcı akışına yaklaştırıldığı bir hafta oldu. Backend tarafında JWT authentication yapısı kurularak login/register işlemleri güvenli hale getirildi. Token’ın web ve mobil ortamlarda farklı saklanması gerektiği görülerek web tarafında `localStorage`, mobil tarafta ise `expo-secure-store` kullanımı değerlendirildi. Ayrıca protected endpoint yapısı ile token geçerlilik kontrolü uygulandı. React Native tarafında chart kütüphaneleri karşılaştırılarak `react-native-gifted-charts` ile Pie Chart ekranı oluşturuldu ve tablo görünümüyle desteklendi. Docker ve environment yönetimi tarafında yapılan düzenlemelerle proje daha güvenli, taşınabilir ve sürdürülebilir bir yapıya yaklaştırıldı.
