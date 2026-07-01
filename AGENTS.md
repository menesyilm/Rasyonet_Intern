# AGENTS.md

Bu dosya, bu repository üzerinde çalışan AI agent için ana çalışma talimatıdır.

Her yeni promptta önce bu dosya dikkate alınmalıdır. Sonrasında `memory.md` proje bağlamı için okunmalı, `skills.md` ise çalışma standardı olarak uygulanmalıdır.

## Her Promptta Yapılacaklar

1. `memory.md` dosyasını oku ve proje bağlamını dikkate al.
2. `skills.md` dosyasındaki çalışma standardını uygula.
3. Kod yazmadan önce mimari sorumluluğu belirle.
4. Değişikliğin hangi katmanı ilgilendirdiğini düşün.
5. Mevcut mimariyi bozabilecek bir durum varsa kullanıcıya açıkla.
6. Refactoring, security, performance ve test edilebilirlik etkilerini kontrol et.
7. Secret, token, API key, gerçek connection string veya hassas bilgi yazma.

## Pattern Keşfedilince

Çalışma sırasında projeye özgü yeni bir genel pattern, yapı veya mekanizma keşfedilirse kullanıcıya sor:

> Şunu fark ettim, bunu memory.md'ye eklemek ister misin? Pattern: [pattern adı] - [1 cümle özet]

Kullanıcı açıkça onay verirse `memory.md` içine kısa ve kalıcı bir not olarak ekle.

Kullanıcı reddederse, kararsız kalırsa veya bilginin geçici olduğunu söylerse `memory.md` dosyasına yazma.

Örnek pattern konuları:

- DB schema yaklaşımı
- Config değişikliği
- Naming convention
- Runtime kuralı
- Layer arası kontrat
- Cache invalidation yaklaşımı
- SignalR event standardı
- Test stratejisi
- Docker çalışma kuralı

## memory.md Ne İçin Kullanılır?

`memory.md`, sabit proje hafızasıdır.

İçermesi gereken bilgiler:

- Proje amacı
- Kullanılan teknolojiler
- Mimari yaklaşım
- Katmanlar ve klasör yapısı
- Domain kavramları
- Veritabanı tercihleri
- Önemli endpointler
- Docker komutları
- Test komutları
- Bilinen mimari kararlar

`memory.md` içine agent davranış talimatı, geçici not, secret, token, API key veya gerçek connection string yazılmamalıdır.

## skills.md Ne İçin Kullanılır?

`skills.md`, çalışma standardı ve skill davranışları için kullanılır.

İçermesi gereken perspektifler:

- Senior backend davranışı
- Senior frontend davranışı
- Senior full-stack davranışı
- Software architecture davranışı
- Code reviewer davranışı
- Docker expert davranışı
- Security review davranışı
- Testing davranışı
- Clean code davranışı
- React best practices
- Tailwind ve UI/UX yaklaşımı

Bir prompt geldiğinde cevap veya implementasyon bu standartlara göre şekillenmelidir.

## Skill Perspektifi Seçimi

- UI veya tasarım isteklerinde: `senior-frontend`, `frontend-design`, `ui-ux-pro-max`, `tailwind-patterns`, `react-best-practices`
- Backend isteklerinde: `senior-backend`, `software-architecture`, `clean-code`, CQRS/MediatR, `security`
- Docker isteklerinde: `docker-expert`, `senior-fullstack`, `security`
- Test isteklerinde: `webapp-testing`, `clean-code`, `senior-fullstack`
- Kod inceleme isteklerinde: `code-reviewer`, `clean-code`, `software-architecture`, `security`, `performance-review`

Skill isimlerini cevapta her zaman tek tek saymak zorunlu değildir, fakat düşünme şekli bu perspektiflere uygun olmalıdır.

## Temel Çalışma Prensibi

Direkt çözüm veya kod üretmeden önce şu sırayı izle:

1. Problemi anla.
2. Mimari sorumluluğu belirle.
3. Etkilenen katmanı ve dosyaları düşün.
4. Riskleri kısa şekilde değerlendir.
5. Uygun çözümü uygula veya öner.

Bu repository üzerinde amaç sadece çalışan kod üretmek değil; sürdürülebilir, okunabilir, test edilebilir ve mimariye uygun çözüm üretmektir.
