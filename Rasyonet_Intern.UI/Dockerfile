# Frontend için Node.js image kullanıyoruz.
# alpine daha küçük Linux tabanlı bir image'dır.
FROM node:22-alpine

# Container içinde çalışma klasörü oluşturur.
# Bundan sonraki komutlar /app klasörü içinde çalışır.
WORKDIR /app

# Docker healthcheck için curl kuruyoruz.
# Frontend container kendi içinde http://localhost:5173 adresini kontrol edecek.
RUN apk add --no-cache curl

# Önce sadece package.json ve package-lock.json dosyalarını kopyalıyoruz.
# Bunun sebebi Docker cache avantajıdır.
# Bağımlılıklar değişmediyse npm ci adımı yeniden çalışmak zorunda kalmaz.
COPY package*.json ./

# package-lock.json'a göre bağımlılıkları temiz ve deterministik şekilde kurar.
# npm install yerine npm ci kullanmak Docker/build ortamlarında daha doğru bir yaklaşımdır.
RUN npm ci

# Projedeki geri kalan tüm frontend dosyalarını container içine kopyalar.
# src, public, vite.config.js gibi dosyalar burada gelir.
COPY . .

# Container'ın 5173 portundan servis vereceğini belirtir.
# Dikkat: EXPOSE tek başına portu dışarı açmaz.
# Dışarı açma işini docker-compose.yml içindeki ports yapar.
EXPOSE 5173

# Container çalışınca bu komut çalışır.
# npm run dev -> Vite dev server başlatır.
# --host 0.0.0.0 -> Vite sadece container içinden değil,
# dışarıdan da erişilebilir şekilde çalışır.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]