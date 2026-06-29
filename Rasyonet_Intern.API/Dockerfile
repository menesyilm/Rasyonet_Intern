# SDK image kullanıyoruz çünkü restore, build ve publish işlemleri için SDK gerekir.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Build aşamasındaki çalışma klasörü.
WORKDIR /src

# Önce sadece csproj dosyasını kopyalıyoruz.
# Bunun sebebi Docker cache optimizasyonudur.
# NuGet paketleri değişmediyse restore adımı cache'den gelir.
COPY ["Rasyonet_Intern.API.csproj", "./"]

# NuGet paketlerini indirir.
RUN dotnet restore "Rasyonet_Intern.API.csproj"

# Projedeki tüm backend dosyalarını container içine kopyalar.
# Controllers, Services, Program.cs, appsettings.json gibi dosyalar burada gelir.
COPY . .

# Uygulamayı Release modunda publish eder.
# Çıktıyı /app/publish klasörüne koyar.
# UseAppHost=false ile platforma özel executable üretmek yerine
# dotnet Rasyonet_Intern.API.dll şeklinde çalıştırılacak çıktı üretir.
RUN dotnet publish "Rasyonet_Intern.API.csproj" -c Release -o /app/publish /p:UseAppHost=false


# Final aşaması.
# Burada SDK değil, sadece ASP.NET Core runtime image kullanıyoruz.
# Çünkü artık build etmeyeceğiz, sadece uygulamayı çalıştıracağız.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Runtime container içindeki çalışma klasörü.
WORKDIR /app

# Docker healthcheck içinde HTTP isteği atabilmek için curl kuruyoruz.
# Container belirli aralıklarla /health endpoint'ini curl ile kontrol edecek.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# ASP.NET Core uygulaması container içinde 8080 portundan dinlesin.
# http://+:8080 ifadesi tüm network interface'lerinden gelen HTTP isteklerini kabul eder.
ENV ASPNETCORE_URLS=http://+:8080

# Container'ın 8080 portundan servis vereceğini belirtir.
# Dışarı açma işini yine docker-compose.yml içindeki ports yapar.
EXPOSE 8080

# Build aşamasında publish edilen dosyaları final image içine kopyalar.
COPY --from=build /app/publish .


# Container başladığında çalışacak komut.
# ASP.NET Core uygulamasını başlatır.
ENTRYPOINT ["dotnet", "Rasyonet_Intern.API.dll"]