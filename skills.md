# AI Working Rules

Bu dosya proje bilgisini tutmaz. Proje bilgisi icin `memory.md` kullanilir.

Amac: Bu repository uzerinde calisan AI asistanin kisa, mimariye uygun, guvenli ve test edilebilir cozumler uretmesini saglamak.

## Temel Calisma Sirasi

Her istekte once sunlari dusun:

1. Problem gercekte ne istiyor?
2. Degisiklik hangi katmana ait?
3. API, UI, database, Docker veya test etkisi var mi?
4. Mevcut mimariyi bozma riski var mi?
5. Security, performance ve test edilebilirlik etkisi var mi?

Sonra cozum oner veya uygula.

## Skill Secim Kurallari

Her istekte uygun skill perspektiflerini sec ve cevabi ona gore ver.

Ornek:

- UI tasarim degisikligi istenirse: `senior-frontend`, `frontend-design`, `ui-ux-pro-max`, `tailwind-patterns`, `react-best-practices`
- React component refactor istenirse: `senior-frontend`, `react-best-practices`, `clean-code`
- Backend endpoint veya business logic istenirse: `senior-backend`, `software-architecture`, `clean-code`
- CQRS/MediatR handler istenirse: `senior-backend`, `software-architecture`, `clean-code`
- Docker veya compose istenirse: `docker-expert`, `senior-fullstack`, `security`
- Kod inceleme istenirse: `code-reviewer`, `clean-code`, `software-architecture`, `security`
- Performans problemi istenirse: `senior-fullstack`, `performance-review`, `software-architecture`
- Test yazma istenirse: `webapp-testing`, `clean-code`, `senior-fullstack`

Skill isimleri etiket gibi dusunulmelidir. Cevapta tek tek sayilmasi zorunlu degildir; onemli olan cevabin bu perspektiflere uygun olmasidir.

## Mimari Kurallar

- Controller sadece HTTP concern ile ilgilenmelidir.
- Business logic controller icine dagitilmamalidir.
- Entity modelleri direkt API response olarak donulmemelidir; DTO tercih edilmelidir.
- Frontend tarafinda API call'lar merkezi servislerde tutulmalidir.
- Backend contract degisirse frontend etkisi kontrol edilmelidir.
- Database modeli degisirse migration, veri uyumlulugu ve test etkisi dusunulmelidir.
- Gereksiz abstraction, klasor, paket veya pattern eklenmemelidir.

## Kod Kalitesi

- Kod okunabilir, sade ve amacini belli eder sekilde yazilmalidir.
- Isimler niyeti anlatmalidir.
- Magic string ve magic number kullanimi azaltilmalidir.
- Tekrar eden logic anlamliysa ortak helper, service veya component'e alinmalidir.
- Refactor yaparken davranis korunmalidir.
- Gereksiz yorum eklenmemelidir; yorum sadece karmasik kararlari aciklamalidir.

## Frontend Kurallari

- Component tek bir ana sorumluluga sahip olmalidir.
- Loading, error ve empty state dusunulmelidir.
- Gereksiz state tutulmamalidir; derived state mumkunse hesaplanmalidir.
- Responsive davranis, text overflow, spacing ve alignment kontrol edilmelidir.
- Tailwind class kalabaligi buyurse component veya helper ile sadelestirilmelidir.

## Backend Kurallari

- I/O islemleri async olmalidir.
- Uygun yerlerde cancellation token kullanilmalidir.
- Validation business flow'dan once gelmelidir.
- Error handling tutarli olmalidir.
- Repository veya service sadece gercek sorumluluk ayrimi sagliyorsa eklenmelidir.

## Docker ve RTK Kurallari

- Shell komutlari mumkun oldugunca `rtk` prefix'i ile calistirilmalidir.
- Docker komutlarinda da `rtk docker ...` veya gerekirse `rtk proxy docker ...` kullanilmalidir.
- Secret, token, API key veya gercek connection string dosyalara yazilmamalidir.
- Dockerfile veya compose icine hassas bilgi gomulmemelidir.
- Config icin environment variable tercih edilmelidir.

## Test ve Review Kurallari

- Testler implementation detail yerine davranisa odaklanmalidir.
- Business rule unit test ile, API/database davranisi integration test ile kontrol edilmelidir.
- Kod review ederken generic yorum yapma; dosya, davranis ve risk uzerinden somut feedback ver.
- Kritik degisikliklerde test, build veya lint calistirma ihtiyacini degerlendir.

## Aciklama Stili

- Kisa, teknik ve pratik aciklama yap.
- Junior developer'in anlayabilecegi kadar net ol.
- Trade-off varsa kisaca belirt.
- Sadece bugun calisan degil, proje buyuyunce de bakimi kolay kalacak cozum oner.
