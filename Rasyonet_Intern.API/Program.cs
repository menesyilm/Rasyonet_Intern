using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using MongoDB.Driver.Core.Extensions.DiagnosticSources;
using OpenTelemetry.Exporter;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Quartz;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Data.Sql;
using Rasyonet_Intern.API.Hubs;
using Rasyonet_Intern.API.Jobs;
using Rasyonet_Intern.API.Repositories.Implementations;
using Rasyonet_Intern.API.Repositories.Interfaces;
using Rasyonet_Intern.API.Services;
using Rasyonet_Intern.API.Services.Auth.Implementations;
using Rasyonet_Intern.API.Services.Auth.Interfaces;
using Rasyonet_Intern.API.Services.BackgroundServices;
using Rasyonet_Intern.API.Services.Cache;
using Rasyonet_Intern.API.Settings;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//Add services to the container.
builder.Services.AddControllers();
//Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Health Check servislerini DI container'a ekler.
// Bu sayede uygulama içinde /health gibi bir endpoint açabiliriz.
// İlk aşamada sadece uygulama ayakta mı kontrol edeceğiz.
// MongoDB / MSSQL bağlantılarını ayrıca kontrol etmiyoruz.
builder.Services.AddHealthChecks();
//MongoDB Mongo Change Watcher Service
builder.Services.AddHostedService<MongoChangeWatcher>(); //AddhostedService -> Uygulama ayağa kalkınca MongoChangeWatcher otomatik başlasın.
//Sql Connection
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration["SqlDbSettings:ConnectionString"],
        sqlOptions =>
        {
            //SQL Server container ayağa kalkarken backend bazen daha erken bağlanmaya çalışabilir.
            sqlOptions.EnableRetryOnFailure();
        });
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
// JWT Authentication
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
var jwtSettings = builder.Configuration
    .GetSection("JwtSettings")
    .Get<JwtSettings>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings!.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.SecretKey)
            ),

            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();
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
// SignalR
builder.Services.AddSignalR();
//Backend ile Mobile uygulama arasında CORS ayarları -> Cross-Origin Resource Sharing
//Mobil uygulamayı browser üzerinden test ederken CORS hatası almamak için bu ayarları ekliyoruz.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMobileDev", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// CORS ayarları -> Cross-Origin Resource Sharing
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // Frontend adresi
            .AllowAnyHeader() // Frontend'in request header göndermesine izin verir.
            .AllowAnyMethod() // Frontend'in farklı HTTP methodlarıyla istek atmasına izin verir.
            .AllowCredentials(); // SignalR tarafında özellikle önemlidir.
                                 // Cookie, authorization bilgisi veya bazı bağlantı bilgileri gerektiğinde
                                 // browser'ın bunları göndermesine izin verir.
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
// Local Docker ortamında uygulamayı HTTP üzerinden çalıştırıyoruz.
// Health check de http://localhost:8080/health adresini kontrol edecek.
// Development ortamında HTTPS redirect yaparsak Docker health check gereksiz sorun çıkarabilir.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactApp");
app.UseCors("AllowMobileDev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Backend'in sağlık durumunu kontrol etmek için endpoint açıyoruz.
// Docker Compose bu endpoint'e istek atacak.
// Eğer API ayaktaysa genelde "Healthy" cevabı döner.
app.MapHealthChecks("/health");

// Bu satır backend’de SignalR endpoint açar -> Bu sadece bu Hub endpoint’i için CORS politikasını uygular.
app.MapHub<DashboardHub>("/hubs/dashboard").RequireCors("AllowReactApp");

app.Run();
