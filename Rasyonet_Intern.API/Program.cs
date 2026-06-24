using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.Driver.Core.Extensions.DiagnosticSources;
using OpenTelemetry.Exporter;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Quartz;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Data.Sql;
using Rasyonet_Intern.API.Jobs;
using Rasyonet_Intern.API.Repositories.Implementations;
using Rasyonet_Intern.API.Repositories.Interfaces;
using Rasyonet_Intern.API.Service;
using Rasyonet_Intern.API.Services;
using Rasyonet_Intern.API.Services.BackgroundServices;

var builder = WebApplication.CreateBuilder(args);

//Add services to the container.
builder.Services.AddControllers();
//Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//MongoDB Mongo Change Watcher Service
builder.Services.AddHostedService<MongoChangeWatcher>(); //AddhostedService -> Uygulama ayağa kalkınca MongoChangeWatcher otomatik başlasın.
//Sql Connection
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration["SqlDbSettings:ConnectionString"];

    options.UseSqlServer(connectionString);
});
//MongoDB Bağlantısı
//MongoClient'i düz oluşturmak yerine OpenTelemetry'nin MongoDB'yi izleyebilmesi için
//DiagnosticsActivityEventSubscriber kullanarak MongoClientSettings oluşturuyoruz.
var mongoClientSettings = MongoClientSettings.FromConnectionString(
    builder.Configuration["MongoDbSettings:ConnectionString"]);

mongoClientSettings.ClusterConfigurator = cb =>
{
    cb.Subscribe(new DiagnosticsActivityEventSubscriber());
};

var mongoClient = new MongoClient(mongoClientSettings);

var database = mongoClient.GetDatabase(
    builder.Configuration["MongoDbSettings:DatabaseName"]);

builder.Services.AddSingleton<IMongoDatabase>(database);
builder.Services.AddSingleton<MongoDbContext>();
//AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);
// Repositories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
// DataMigrationService
builder.Services.AddScoped<DataMigrationService>();
builder.Services.AddScoped<SqlToMongoSyncService>();
// MemoryCache
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<CacheService>();
builder.Services.AddSingleton<CacheInvalidationService>();
// Quartz -> MSSQL'den MongoDB'ye her gün 10:00'da senkrozinasyon
builder.Services.AddQuartz(options =>
{
    var jobKey = new JobKey("SqlToMongoSyncJob");

    options.AddJob<SqlToMongoSyncJob>(job => job.WithIdentity(jobKey));
    options.AddTrigger(trigger => trigger
        .ForJob(jobKey)
        .WithIdentity("SqlToMongoSyncJobTrigger")
        .WithCronSchedule("0 0 10 ? * *", cron => cron.InTimeZone(TimeZoneInfo.Local)));
});
builder.Services.AddQuartzHostedService(options =>
{
    options.WaitForJobsToComplete = true;
});
// CORS ayarları
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
// OpenTelemetry
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .SetResourceBuilder(
            ResourceBuilder.CreateDefault()
                .AddService("Rasyonet_Intern.API"))
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSource("MongoDB.Driver.Core.Extensions.DiagnosticSources")
        .AddOtlpExporter(opt =>
        {
            opt.Endpoint = new Uri("http://localhost:4317");
            opt.Protocol = OtlpExportProtocol.Grpc;
        }));
var app = builder.Build();
// MongoDB'den MSSQL'e veri aktarımı için
if (args.Contains("--migrate-mongo-to-sql"))
{
    using var scope = app.Services.CreateScope();
    var migrationService = scope.ServiceProvider
        .GetRequiredService<DataMigrationService>();
    await migrationService.MigrateMongoToSqlAsync();
    Console.WriteLine("MongoDB verileri MSSQL'e aktarıldı.");
    return;
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
