using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Hubs;
using Rasyonet_Intern.API.Services.Cache;

namespace Rasyonet_Intern.API.Services.BackgroundServices
{
    // MongoChangeWatcher bir BackgroundService'tir.
    // Yani API çalıştığı sürece arka planda sürekli çalışan bir servistir.
    // Kullanıcının herhangi bir endpoint'e istek atmasına gerek kalmadan MongoDB değişikliklerini dinler.
    public class MongoChangeWatcher : BackgroundService
    {
        private readonly IMongoDatabase _mongoDatabase;
        private readonly ILogger<MongoChangeWatcher> _logger;
        private readonly CacheInvalidationService _cacheInvalidationService;
        private readonly IHubContext<DashboardHub> _hubContext;

        public MongoChangeWatcher(IMongoDatabase mongoDatabase, ILogger<MongoChangeWatcher> logger, CacheInvalidationService cacheInvalidationService, IHubContext<DashboardHub> hubContext)
        {
            _mongoDatabase = mongoDatabase;
            _logger = logger;
            _cacheInvalidationService = cacheInvalidationService;
            _hubContext = hubContext;
        }
        // BackgroundService çalışmaya başladığında ExecuteAsync otomatik tetiklenir.
        // stoppingToken uygulama kapanırken veya servis durdurulurken iptal sinyali verir.
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MongoDB Change Watcher başlatıldı.");
            // Şu an boş pipeline kullanılıyor.
            // Yani insert, update, delete, replace gibi tüm değişiklikleri dinler.
            var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>();

            try
            {
                //database içindeki tüm collection değişiklikleri izlenir.
                //WatchAsync, sadece replica set veya sharded cluster üzerinde çalışır.
                using var cursor = await _mongoDatabase.WatchAsync(pipeline, cancellationToken: stoppingToken);
                //Servis durdurulmadığı sürece Change Stream cursor hareket ettirilir.
                while (!stoppingToken.IsCancellationRequested && await cursor.MoveNextAsync(stoppingToken))
                {
                    //cursor.Current, MongoDB'den gelen mevcut değişiklik event'lerinin listesidir.
                    foreach (var changeEvent in cursor.Current)
                    {
                        // Değişikliğin hangi collection üzerinde olduğunu alıyoruz.
                        var collectionName = changeEvent.CollectionNamespace.CollectionName;
                        // Yapılan işlemin türünü alıyoruz. insert, update, delete, replace gibi.
                        var operationType = changeEvent.OperationType.ToString();
                        // Değişen dokümanın ID'sini alıyoruz. BsonId
                        var documentId = GetDocumentId(changeEvent);

                        // Yakalanan değişikliği logla.
                        LogChange(changeEvent);

                        //chart endpointleri sales collection'ında olduğu için sadece burası değişirse cache temizleme ve signalR event gönderme işlemi yapılır.
                        if (collectionName == "Sales")
                        {
                            // Hangi collection değiştiyse o collection'a bağlı cache key'lerini temizle.
                            _cacheInvalidationService.InvalidateSalesCharts();

                            // SignalR ile frontend'e mesaj gönderiyoruz. 
                            await _hubContext.Clients.All.SendAsync("salesChartsInvalidated",
                            new
                            {
                                // Hangi collection değişti?
                                Collection = collectionName,
                                // Ne tür işlem oldu?
                                Operation = operationType,
                                // Hangi document değişti?
                                DocumentId = documentId,
                                // Değişiklik zamanı.
                                ChangedAt = DateTime.UtcNow

                            },
                            stoppingToken);

                            // SignalR mesajı gönderildikten sonra bunu da logluyoruz.
                            // Bu sayede akışı takip edebiliriz:
                            //
                            // 1. MongoDB değişikliği yakalandı mı?
                            // 2. Cache temizlendi mi?
                            // 3. SignalR event gönderildi mi?
                            _logger.LogInformation("SignalR event gönderildi: {EventName}, Collection: {CollectionName}, Operation: {OperationType}",
                                "salesChartsInvalidated",
                                collectionName,
                                operationType);
                        }
                    }
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                // Uygulama normal şekilde kapanırken CancellationToken tetiklenir.
                // Bu bir hata değildir, kontrollü kapanıştır.
                _logger.LogInformation("MongoDB Change Watcher durduruldu.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MongoDB Change Stream dinlenirken hata oluştu.");
            }
        }

        // MongoDB'den gelen değişiklik event'ini okunabilir şekilde loglar.
        private void LogChange(ChangeStreamDocument<BsonDocument> changeEvent)
        {
            // Değişikliğin hangi collection üzerinde olduğunu alır.
            var collectionName = changeEvent.CollectionNamespace.CollectionName;
            var documentId = GetDocumentId(changeEvent);

            _logger.LogInformation(
                "MongoDB değişiklik algılandı. Collection: {CollectionName}, Operation: {OperationType}, DocumentId: {DocumentId}",
                collectionName,
                changeEvent.OperationType,
                documentId);
        }

        // Change Stream event'inden değişen document'in _id bilgisini almaya çalışır.
        // static olmasının sebebi:
        // Bu method sınıf içindeki field'ları kullanmıyor.
        // Sadece kendisine verilen changeEvent üzerinden işlem yapıyor.
        private static string GetDocumentId(ChangeStreamDocument<BsonDocument> changeEvent)
        {
            // Change Stream event içinde DocumentKey varsa
            // ve bu DocumentKey içinde "_id" alanı varsa onu almaya çalışıyoruz.
            if (changeEvent.DocumentKey != null && changeEvent.DocumentKey.TryGetValue("_id", out var id))
            {
                // id null değilse string'e çevir.
                // Null ise "Unknown" dön.
                return id?.ToString() ?? "Unknown";
            }
            // Bazı event türlerinde document key beklediğimiz şekilde gelmeyebilir.
            // Bu durumda hata fırlatmak yerine Unknown dönüyoruz.
            return "Unknown";
        }
    }
}
