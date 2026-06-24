using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Service;

namespace Rasyonet_Intern.API.Services.BackgroundServices
{
    public class MongoChangeWatcher : BackgroundService
    {
        private readonly IMongoDatabase _mongoDatabase;
        private readonly ILogger<MongoChangeWatcher> _logger;
        private readonly CacheInvalidationService _cacheInvalidationService;

        public MongoChangeWatcher(IMongoDatabase mongoDatabase, ILogger<MongoChangeWatcher> logger, CacheInvalidationService cacheInvalidationService)
        {
            _mongoDatabase = mongoDatabase;
            _logger = logger;
            _cacheInvalidationService = cacheInvalidationService;
        }
        // BackgroundService çalışmaya başladığında ExecuteAsync otomatik tetiklenir.
        // stoppingToken uygulama kapanırken veya servis durdurulurken iptal sinyali verir.
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MongoDB Change Watcher başlatıldı.");
            // Şu an boş pipeline kullanılıyor.
            // Yani insert, update, delete, replace gibi tüm değişiklikleri dinler.
            var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>();
            // Change Stream seçenekleri.
            var options = new ChangeStreamOptions
            {
                // UpdateLookup, değişiklik olduğunda değişen belgenin tam halini almak için kullanılır.
                FullDocument = ChangeStreamFullDocumentOption.UpdateLookup
            };

            try
            {
                //database içindeki tüm collection değişiklikleri izlenir.
                //WatchAsync, sadece replica set veya sharded cluster üzerinde çalışır.
                using var cursor = await _mongoDatabase.WatchAsync(pipeline, options, stoppingToken);
                //Servis durdurulmadığı sürece Change Stream cursor hareket ettirilir.
                while (!stoppingToken.IsCancellationRequested && await cursor.MoveNextAsync(stoppingToken))
                {
                    //cursor.Current, MongoDB'den gelen mevcut değişiklik event'lerinin listesidir.
                    foreach (var changeEvent in cursor.Current)
                    {
                        // Yakalanan değişikliği logla.
                        LogChange(changeEvent);
                        // Hangi collection değiştiyse o collection'a bağlı cache key'lerini temizle.
                        _cacheInvalidationService.InvalidateForCollection(changeEvent.CollectionNamespace.CollectionName);
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
            // Değişen dokümanın _id değerini almaya çalışır.
            var documentId = changeEvent.DocumentKey != null && changeEvent.DocumentKey.Contains("_id")
                ? changeEvent.DocumentKey["_id"].ToString()
                : "Unknown";

            _logger.LogInformation(
                "MongoDB değişiklik algılandı. Collection: {CollectionName}, Operation: {OperationType}, DocumentId: {DocumentId}",
                collectionName,
                changeEvent.OperationType,
                documentId);
        }
    }
}
