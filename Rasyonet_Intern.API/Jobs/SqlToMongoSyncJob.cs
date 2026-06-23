using Quartz;
using Rasyonet_Intern.API.Services;

namespace Rasyonet_Intern.API.Jobs
{
    [DisallowConcurrentExecution]
    public class SqlToMongoSyncJob : IJob
    {
        private readonly SqlToMongoSyncService _syncService;
        private readonly ILogger<SqlToMongoSyncJob> _logger;

        public SqlToMongoSyncJob(SqlToMongoSyncService syncService, ILogger<SqlToMongoSyncJob> logger)
        {
            _syncService = syncService;
            _logger = logger;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("SQL'den MongoDB'ye senkrozinasyon başladı : {Time}", DateTimeOffset.Now);

            await _syncService.SyncAsync(context.CancellationToken);

            _logger.LogInformation("SQL'den MongoDB'ye senkrozinasyon tamamlandı : {Time}", DateTimeOffset.Now);
        }
    }
}
