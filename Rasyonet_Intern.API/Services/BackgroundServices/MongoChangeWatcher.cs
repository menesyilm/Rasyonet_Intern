using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Hubs;
using Rasyonet_Intern.API.Services.Cache;

namespace Rasyonet_Intern.API.Services.BackgroundServices
{
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
                        var collectionName = changeEvent.CollectionNamespace.CollectionName;
                        var operationType = changeEvent.OperationType.ToString();
                        var documentId = GetDocumentId(changeEvent);

                        // Yakalanan değişikliği logla.
                        LogChange(changeEvent);

                        if (collectionName == "Sales")
                        {


                            // Hangi collection değiştiyse o collection'a bağlı cache key'lerini temizle.
                            _cacheInvalidationService.InvalidateSalesCharts();

                            // SignalR hub'ına değişikliği bildir. 
                            await _hubContext.Clients.All.SendAsync("salesChartsInvalidated",
                            new
                            {
                                Collection = collectionName,
                                Operation = operationType,
                                DocumentId = documentId,
                                ChangedAt = DateTime.UtcNow

                            },
                            stoppingToken);

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
        private static string GetDocumentId(ChangeStreamDocument<BsonDocument> changeEvent)
        {
            if (changeEvent.DocumentKey != null &&
                changeEvent.DocumentKey.TryGetValue("_id", out var id))
            {
                return id?.ToString() ?? "Unknown";
            }

            return "Unknown";
        }
    }
}
