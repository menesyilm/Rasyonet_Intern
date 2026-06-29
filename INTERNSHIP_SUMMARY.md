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
